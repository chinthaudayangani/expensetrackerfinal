import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";
import { calculateTotals, countByType, formatEuro } from "@/lib/finance";
import { useFinance } from "@/lib/finance-store";
import { cn } from "@/lib/utils";

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

/** Income / Expenses / Balance cards shown above the transaction history list. */
export function HistoryTotals() {
  const { transactions } = useFinance();
  const { totalIncome, totalExpenses, balance } = calculateTotals(transactions);
  const counts = countByType(transactions);

  const cards = [
    {
      key: "income",
      label: "Total income",
      value: totalIncome,
      icon: <ArrowDownLeft className="h-4 w-4" />,
      foot: plural(counts.income, "entry"),
      soft: "bg-income-soft",
      text: "text-income",
      bar: "bg-income",
    },
    {
      key: "expense",
      label: "Total expenses",
      value: totalExpenses,
      icon: <ArrowUpRight className="h-4 w-4" />,
      foot: plural(counts.expense, "entry"),
      soft: "bg-expense-soft",
      text: "text-expense",
      bar: "bg-expense",
    },
    {
      key: "balance",
      label: "Remaining balance",
      value: balance,
      icon: <Wallet className="h-4 w-4" />,
      foot: "Income − expenses",
      soft: "bg-secondary",
      text: balance < 0 ? "text-expense" : "text-secondary-foreground",
      bar: "bg-hero-gradient",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {cards.map((c) => (
        <article
          key={c.key}
          className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-card"
        >
          <span aria-hidden className={cn("absolute inset-x-0 top-0 h-1", c.bar)} />
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {c.label}
            </p>
            <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg", c.soft, c.text)}>
              {c.icon}
            </span>
          </div>
          <p className={cn("mt-2 font-display text-2xl font-semibold leading-tight tabular", c.text)}>
            {formatEuro(c.value)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{c.foot}</p>
        </article>
      ))}
    </div>
  );
}
