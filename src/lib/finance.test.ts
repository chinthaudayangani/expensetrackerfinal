import { describe, expect, it } from "vitest";
import {
  EMPTY_STATE,
  addTransaction,
  budgetSummary,
  calculateTotals,
  parseAmount,
  removeTransaction,
  sanitizeState,
  setMonthlyBudget,
  type Transaction,
} from "./finance";

const tx = (over: Partial<Transaction>): Transaction => ({
  id: Math.random().toString(36),
  type: "expense",
  amount: 10,
  date: "2026-11-10",
  category: "Food",
  note: "",
  createdAt: 0,
  ...over,
});

describe("amount rules", () => {
  it("rejects negative amounts", () => {
    expect(parseAmount("-5")).toBeNull();
  });

  it("rejects zero for transactions", () => {
    expect(parseAmount("0")).toBeNull();
  });

  it("accepts euro amounts with a comma or dot", () => {
    expect(parseAmount("12,50")).toBe(12.5);
    expect(parseAmount("12.5")).toBe(12.5);
  });

  it("refuses to store a transaction with a negative amount", () => {
    expect(() => addTransaction(EMPTY_STATE, tx({ amount: -3 }))).toThrow();
  });

  it("refuses a negative monthly budget", () => {
    expect(() => setMonthlyBudget(EMPTY_STATE, -100)).toThrow();
  });

  it("drops negative amounts found in saved data", () => {
    const state = sanitizeState({ transactions: [tx({ amount: -20 })], monthlyBudget: -50 });
    expect(state.transactions).toHaveLength(0);
    expect(state.monthlyBudget).toBe(0);
  });
});

describe("totals", () => {
  it("remaining balance is total income minus total expenses", () => {
    const totals = calculateTotals([
      tx({ type: "income", amount: 2000, category: "Salary" }),
      tx({ type: "expense", amount: 650.25 }),
      tx({ type: "expense", amount: 49.75 }),
    ]);
    expect(totals.totalIncome).toBe(2000);
    expect(totals.totalExpenses).toBe(700);
    expect(totals.balance).toBe(1300);
  });

  it("recalculates totals after deleting a transaction", () => {
    let state = addTransaction(EMPTY_STATE, tx({ id: "a", type: "income", amount: 100 }));
    state = addTransaction(state, tx({ id: "b", amount: 40 }));
    expect(calculateTotals(state.transactions).balance).toBe(60);
    state = removeTransaction(state, "b");
    expect(calculateTotals(state.transactions).totalExpenses).toBe(0);
    expect(calculateTotals(state.transactions).balance).toBe(100);
  });
});

describe("monthly budget", () => {
  it("budget remaining is monthly budget minus total expenses", () => {
    const s = budgetSummary(500, 125);
    expect(s.remaining).toBe(375);
    expect(s.used).toBe(125);
    expect(s.percentUsed).toBe(25);
  });

  it("flags overspending when expenses exceed the budget", () => {
    const s = budgetSummary(200, 250);
    expect(s.remaining).toBe(-50);
    expect(s.isOver).toBe(true);
  });
});
