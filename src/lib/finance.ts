// Pure money logic for the expense tracker. No browser APIs here so it can be unit tested.

export type TransactionType = "income" | "expense";

export const INCOME_SOURCES = ["Salary", "Freelance", "Gift", "Other"] as const;
export const EXPENSE_CATEGORIES = [
  "Housing",
  "Food",
  "Transport",
  "Bills",
  "Shopping",
  "Health",
  "Study",
  "Other",
] as const;

export interface Transaction {
  id: string;
  type: TransactionType;
  /** Always a positive number of euros, rounded to cents. */
  amount: number;
  /** Local date as yyyy-MM-dd. */
  date: string;
  /** Income source or expense category. */
  category: string;
  note: string;
  createdAt: number;
}

export interface FinanceState {
  transactions: Transaction[];
  /** Monthly spending limit in euros. 0 means no budget set. */
  monthlyBudget: number;
}

export const EMPTY_STATE: FinanceState = { transactions: [], monthlyBudget: 0 };

const MAX_AMOUNT = 1_000_000_000;

const toCents = (n: number) => Math.round(n * 100);
const fromCents = (c: number) => c / 100;

/**
 * Turns user input like "12.50" or "12,50" into a euro amount.
 * Returns null for anything empty, negative, zero (unless allowZero), non-numeric,
 * or with more than two decimals.
 */
export function parseAmount(raw: string, { allowZero = false } = {}): number | null {
  const cleaned = raw.trim().replace(",", ".");
  if (!/^\d*(\.\d{0,2})?$/.test(cleaned) || cleaned === "" || cleaned === ".") return null;
  const value = Number(cleaned);
  if (!Number.isFinite(value) || value < 0 || value > MAX_AMOUNT) return null;
  if (value === 0 && !allowZero) return null;
  return fromCents(toCents(value));
}

export type AmountCheck = { ok: true; value: number } | { ok: false; error: string };

/** Friendly validation for the amount box: explains exactly what is wrong. */
export function validateAmount(raw: string): AmountCheck {
  const trimmed = raw.trim();
  if (trimmed === "") return { ok: false, error: "Please enter an amount." };
  if (trimmed.includes("-")) return { ok: false, error: "Amount can't be negative." };
  const cleaned = trimmed.replace(",", ".");
  if (!/^\d*(\.\d*)?$/.test(cleaned) || cleaned === ".")
    return { ok: false, error: "Use numbers only, for example 12.50." };
  if (/\.\d{3,}$/.test(cleaned)) return { ok: false, error: "Use at most 2 decimals (cents)." };
  const value = parseAmount(trimmed);
  if (value === null) {
    return Number(cleaned) === 0
      ? { ok: false, error: "Amount must be more than €0." }
      : { ok: false, error: "That amount is too large." };
  }
  return { ok: true, value };
}

export function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00`);
  return !Number.isNaN(d.getTime());
}

export function calculateTotals(transactions: Transaction[]) {
  let incomeCents = 0;
  let expenseCents = 0;
  for (const t of transactions) {
    if (t.type === "income") incomeCents += toCents(t.amount);
    else expenseCents += toCents(t.amount);
  }
  return {
    totalIncome: fromCents(incomeCents),
    totalExpenses: fromCents(expenseCents),
    // Remaining Balance = Total Income − Total Expenses
    balance: fromCents(incomeCents - expenseCents),
  };
}

export function budgetSummary(monthlyBudget: number, totalExpenses: number) {
  const used = totalExpenses;
  // Budget Remaining = Monthly Budget − Total Expenses
  const remaining = fromCents(toCents(monthlyBudget) - toCents(used));
  const percentUsed = monthlyBudget > 0 ? (used / monthlyBudget) * 100 : 0;
  return {
    budget: monthlyBudget,
    used,
    remaining,
    percentUsed,
    hasBudget: monthlyBudget > 0,
    isOver: monthlyBudget > 0 && remaining < 0,
  };
}

export type BudgetLevel = "none" | "ok" | "warn" | "over";

/** Colour level for the budget bar: warn from 80% used, over when spending passes the limit. */
export function budgetLevel(s: ReturnType<typeof budgetSummary>): BudgetLevel {
  if (!s.hasBudget) return "none";
  if (s.isOver) return "over";
  return s.percentUsed >= 80 ? "warn" : "ok";
}

/** Extra figures shown under the dashboard summary cards. */
export function summaryStats(transactions: Transaction[]) {
  const { totalIncome, totalExpenses } = calculateTotals(transactions);
  return {
    incomeCount: transactions.filter((t) => t.type === "income").length,
    expenseCount: transactions.filter((t) => t.type === "expense").length,
    /** Share of income already spent, or null when there is no income yet. */
    spentPercentOfIncome: totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : null,
  };
}

export function expensesByCategory(transactions: Transaction[]) {
  const map = new Map<string, number>();
  for (const t of transactions) {
    if (t.type !== "expense") continue;
    map.set(t.category, (map.get(t.category) ?? 0) + toCents(t.amount));
  }
  return [...map.entries()]
    .map(([category, cents]) => ({ category, amount: fromCents(cents) }))
    .sort((a, b) => b.amount - a.amount);
}

export function sortNewestFirst(transactions: Transaction[]) {
  return [...transactions].sort((a, b) =>
    a.date === b.date ? b.createdAt - a.createdAt : a.date < b.date ? 1 : -1,
  );
}

export function addTransaction(state: FinanceState, tx: Transaction): FinanceState {
  if (!(tx.amount > 0)) throw new Error("Amount must be greater than zero");
  return { ...state, transactions: [...state.transactions, tx] };
}

export function removeTransaction(state: FinanceState, id: string): FinanceState {
  return { ...state, transactions: state.transactions.filter((t) => t.id !== id) };
}

export function setMonthlyBudget(state: FinanceState, amount: number): FinanceState {
  if (!(amount >= 0) || !Number.isFinite(amount)) throw new Error("Budget cannot be negative");
  return { ...state, monthlyBudget: fromCents(toCents(amount)) };
}

/** Accepts whatever was in storage and keeps only valid, non-negative data. */
export function sanitizeState(input: unknown): FinanceState {
  if (!input || typeof input !== "object") return EMPTY_STATE;
  const raw = input as Partial<FinanceState>;
  const transactions = Array.isArray(raw.transactions)
    ? raw.transactions.filter(
        (t): t is Transaction =>
          !!t &&
          typeof t.id === "string" &&
          (t.type === "income" || t.type === "expense") &&
          typeof t.amount === "number" &&
          t.amount > 0 &&
          typeof t.date === "string" &&
          typeof t.category === "string",
      )
        .map((t) => ({
          ...t,
          note: typeof t.note === "string" ? t.note : "",
          createdAt: typeof t.createdAt === "number" ? t.createdAt : 0,
        }))
    : [];
  const monthlyBudget =
    typeof raw.monthlyBudget === "number" && raw.monthlyBudget > 0 ? raw.monthlyBudget : 0;
  return { transactions, monthlyBudget };
}

const euro = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" });

export function formatEuro(value: number) {
  return euro.format(value);
}
