import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  calculateTotals,
  countByType,
  formatEuro,
  sortNewestFirst,
  type TransactionType,
} from "@/lib/finance";
import { useFinance } from "@/lib/finance-store";
import { PageHeader, Panel } from "@/components/PageHeader";
import { HistoryTotals } from "@/components/HistoryTotals";
import { TransactionList } from "@/components/TransactionList";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Transaction History · Personal Expense Tracker" },
      {
        name: "description",
        content: "Browse your income and expenses by colour, and delete any transaction.",
      },
      { property: "og:title", content: "Transaction History · Personal Expense Tracker" },
      {
        property: "og:description",
        content: "Browse your income and expenses by colour, and delete any transaction.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HistoryPage,
});

type Filter = "all" | TransactionType;

function HistoryPage() {
  const { transactions } = useFinance();
  const [filter, setFilter] = useState<Filter>("all");
  const counts = countByType(transactions);
  const visible = sortNewestFirst(
    filter === "all" ? transactions : transactions.filter((t) => t.type === filter),
  );
  const shown = calculateTotals(visible);

  const filters: { value: Filter; label: string; count: number }[] = [
    { value: "all", label: "All", count: counts.all },
    { value: "income", label: "Income", count: counts.income },
    { value: "expense", label: "Expenses", count: counts.expense },
  ];

  return (
    <>
      <PageHeader
        title="History"
        description="Green rows are money in, red rows are money out. Delete any row and the totals above update straight away."
      />

      <HistoryTotals />

      <div className="mt-5 mb-4 flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Filter transactions" className="inline-flex rounded-full bg-muted p-1">
          {filters.map((f) => (
            <button
              key={f.value}
              role="tab"
              aria-selected={filter === f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors sm:px-4",
                filter === f.value
                  ? "bg-card text-foreground shadow-card"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f.label}
              <span className="ml-1.5 tabular text-xs opacity-70">{f.count}</span>
            </button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground tabular">
          Showing {visible.length} of {transactions.length} ·{" "}
          <span className="font-medium text-income">{formatEuro(shown.totalIncome)} in</span> ·{" "}
          <span className="font-medium text-expense">{formatEuro(shown.totalExpenses)} out</span>
        </p>
      </div>

      <Panel>
        {visible.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
            <p className="font-medium">
              {transactions.length === 0
                ? "No transactions yet"
                : filter === "income"
                  ? "No income yet"
                  : "No expenses yet"}
            </p>
            <p className="max-w-xs text-sm text-muted-foreground">
              {transactions.length === 0
                ? "Anything you add will show up here, newest first."
                : "Try the All tab, or add one below."}
            </p>
            <div className="mt-2 flex gap-2">
              {transactions.length === 0 ? (
                <>
                  <Button asChild size="sm">
                    <Link to="/income">Add income</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/expense">Add expense</Link>
                  </Button>
                </>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setFilter("all")}>
                  Show all
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="py-1">
            <TransactionList transactions={visible} />
          </div>
        )}
      </Panel>
    </>
  );
}
