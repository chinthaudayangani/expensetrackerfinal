import { Link } from "@tanstack/react-router";
import { AlertTriangle, PiggyBank } from "lucide-react";
import { budgetSummary, calculateTotals, formatEuro } from "@/lib/finance";
import { useFinance } from "@/lib/finance-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function BudgetSummary({ showLink = true }: { showLink?: boolean }) {
  const { transactions, monthlyBudget } = useFinance();
  const { totalExpenses } = calculateTotals(transactions);
  const s = budgetSummary(monthlyBudget, totalExpenses);

  if (!s.hasBudget) {
    return (
      <div className="flex flex-col items-start gap-3 p-5 sm:p-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
          <PiggyBank className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-semibold">Monthly budget</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Set a spending limit to see how much you have left.
          </p>
        </div>
        {showLink && (
          <Button asChild size="sm">
            <Link to="/budget">Set a budget</Link>
          </Button>
        )}
      </div>
    );
  }

  const pct = Math.round(s.percentUsed);
  const level = s.isOver ? "over" : s.percentUsed >= 80 ? "warn" : "ok";

  return (
    <div className="p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Monthly budget</h2>
          <p className="text-sm text-muted-foreground tabular">{formatEuro(s.budget)} limit</p>
        </div>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-semibold tabular",
            level === "ok" && "bg-income-soft text-income",
            level === "warn" && "bg-warning-soft text-warning",
            level === "over" && "bg-expense-soft text-expense",
          )}
        >
          {pct}% used
        </span>
      </div>

      <div
        className="mt-5 h-3 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.min(pct, 100)}
        aria-label="Budget used"
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            level === "ok" && "bg-hero-gradient",
            level === "warn" && "bg-warning",
            level === "over" && "bg-expense",
          )}
          style={{ width: `${Math.min(s.percentUsed, 100)}%` }}
        />
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-muted/70 p-3">
          <dt className="text-xs font-medium text-muted-foreground">Used</dt>
          <dd className="mt-0.5 font-display text-lg font-semibold tabular">{formatEuro(s.used)}</dd>
        </div>
        <div className="rounded-xl bg-muted/70 p-3">
          <dt className="text-xs font-medium text-muted-foreground">Remaining</dt>
          <dd
            className={cn(
              "mt-0.5 font-display text-lg font-semibold tabular",
              s.isOver ? "text-expense" : "text-income",
            )}
          >
            {formatEuro(s.remaining)}
          </dd>
        </div>
      </dl>

      {s.isOver && (
        <p className="mt-4 flex items-center gap-2 rounded-xl bg-expense-soft px-3 py-2 text-sm text-expense">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          You are {formatEuro(Math.abs(s.remaining))} over your budget.
        </p>
      )}

      {showLink && (
        <Button asChild variant="link" className="mt-2 h-auto px-0">
          <Link to="/budget">Change budget</Link>
        </Button>
      )}
    </div>
  );
}
