import { useSyncExternalStore } from "react";
import {
  EMPTY_STATE,
  addTransaction as addTx,
  removeTransaction as removeTx,
  sanitizeState,
  setMonthlyBudget,
  type FinanceState,
  type TransactionType,
} from "./finance";

const STORAGE_KEY = "personal-expense-tracker:v1";

let state: FinanceState | null = null;
const listeners = new Set<() => void>();

function load(): FinanceState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? sanitizeState(JSON.parse(raw)) : EMPTY_STATE;
  } catch {
    return EMPTY_STATE;
  }
}

function getSnapshot(): FinanceState {
  if (state === null) state = load();
  return state;
}

function getServerSnapshot(): FinanceState {
  return EMPTY_STATE;
}

function emit() {
  for (const l of listeners) l();
}

function commit(next: FinanceState) {
  state = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage full or blocked: keep working in memory.
  }
  emit();
}

function onStorage(e: StorageEvent) {
  if (e.key === STORAGE_KEY) {
    state = load();
    emit();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

/** Reads the saved transactions and budget. Re-renders whenever they change. */
export function useFinance(): FinanceState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function addTransaction(input: {
  type: TransactionType;
  amount: number;
  date: string;
  category: string;
  note: string;
}) {
  commit(
    addTx(getSnapshot(), {
      ...input,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    }),
  );
}

export function deleteTransaction(id: string) {
  commit(removeTx(getSnapshot(), id));
}

export function saveMonthlyBudget(amount: number) {
  commit(setMonthlyBudget(getSnapshot(), amount));
}
