import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { calculateTotals, formatEuro, sortNewestFirst, type TransactionType } from "@/lib/finance";
import { useFinance } from "@/lib/finance-store";
import { PageHeader, Panel } from "@/components/PageHeader";
import { TransactionList } from "@/components/TransactionList";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Transaction History · Personal Expense Tracker" },
      {
        name: "description",
        content: "Browse and delete all of your income and expense transactions.",
      },
      { property: "og:title", content: "Transaction History · Personal Expense Tracker" },
      {
        property: "og:description",
        content: "Browse and delete all of your income and expense transactions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HistoryPage,
});

const FILTERS: { value: "all" | TransactionType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "income", label: "Income" },
  { value: "expense", label: "Expenses" },
];

function HistoryPage() {
  const { transactions } = useFinance();
  const [filter, setFilter] = useState<"all" | TransactionType>("all");
  const visible = sortNewestFirst(
    filter === "all" ? transactions : transactions.filter((t) => t.type === filter),
  );
  const { totalIncome, totalExpenses } = calculateTotals(transactions);

  return (
    <>
      <PageHeader
        title="History"
        description={`${transactions.length} transaction${transactions.length === 1 ? "" : "s"} · ${formatEuro(totalIncome)} in · ${formatEuro(totalExpenses)} out`}
      />

      <div role="tablist" aria-label="Filter transactions" className="mb-4 inline-flex rounded-full bg-muted p-1">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            role="tab"
            aria-selected={filter === f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              filter === f.value
                ? "bg-card text-foreground shadow-card"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <Panel>
        {visible.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
            <p className="font-medium">No transactions yet</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Anything you add will show up here, newest first.
            </p>
            <div className="mt-2 flex gap-2">
              <Button asChild size="sm">
                <Link to="/income">Add income</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to="/expense">Add expense</Link>
              </Button>
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
