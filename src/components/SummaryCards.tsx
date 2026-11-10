import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowDownLeft, ArrowUpRight, PiggyBank, Wallet } from "lucide-react";
import {
  budgetLevel,
  budgetSummary,
  calculateTotals,
  formatEuro,
  summaryStats,
} from "@/lib/finance";
import { useFinance } from "@/lib/finance-store";
import { BudgetProgressBar, levelBadgeClass } from "@/components/BudgetProgressBar";
import { cn } from "@/lib/utils";

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

function SummaryCard({
  label,
  icon,
  children,
  footer,
  featured = false,
}: {
  label: string;
  icon: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  featured?: boolean;
}) {
  return (
    <article
      className={cn(
        "relative flex flex-col overflow-hidden rounded-2xl border p-5 shadow-card transition-shadow hover:shadow-hero/30",
        featured ? "border-primary/25 bg-soft-gradient" : "border-border bg-card",
      )}
    >
      <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-hero-gradient opacity-80" />
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-xl",
            featured ? "bg-hero-gradient text-primary-foreground shadow-hero" : "bg-secondary text-primary",
          )}
        >
          {icon}
        </span>
      </div>
      <div className="mt-3 flex-1">{children}</div>
      {footer && (
        <div className="mt-4 border-t border-border/70 pt-3 text-xs text-muted-foreground">{footer}</div>
      )}
    </article>
  );
}

const valueClass = "font-display text-[1.75rem] font-semibold leading-tight tabular";

export function SummaryCards() {
  const { transactions, monthlyBudget } = useFinance();
  const { totalIncome, totalExpenses, balance } = calculateTotals(transactions);
  const stats = summaryStats(transactions);
  const budget = budgetSummary(monthlyBudget, totalExpenses);
  const level = budgetLevel(budget);
  const pct = Math.round(budget.percentUsed);

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        label="Remaining balance"
        icon={<Wallet className="h-4 w-4" />}
        featured
        footer="Total income − total expenses"
      >
        <p className={cn(valueClass, balance < 0 ? "text-expense" : "text-secondary-foreground")}>
          {formatEuro(balance)}
        </p>
      </SummaryCard>

      <SummaryCard
        label="Total income"
        icon={<ArrowDownLeft className="h-4 w-4" />}
        footer={stats.incomeCount === 1 ? "1 income entry" : `${stats.incomeCount} income entries`}
      >
        <p className={cn(valueClass, "text-foreground")}>{formatEuro(totalIncome)}</p>
      </SummaryCard>

      <SummaryCard
        label="Total expenses"
        icon={<ArrowUpRight className="h-4 w-4" />}
        footer={
          <span className="flex flex-wrap items-center justify-between gap-2">
            <span>{plural(stats.expenseCount, "expense")}</span>
            {stats.spentPercentOfIncome !== null && (
              <span className="rounded-full bg-secondary px-2 py-0.5 font-medium text-secondary-foreground tabular">
                {Math.round(stats.spentPercentOfIncome)}% of income
              </span>
            )}
          </span>
        }
      >
        <p className={cn(valueClass, "text-foreground")}>{formatEuro(totalExpenses)}</p>
      </SummaryCard>

      <SummaryCard label="Budget used" icon={<PiggyBank className="h-4 w-4" />}>
        {budget.hasBudget ? (
          <>
            <div className="flex items-baseline justify-between gap-2">
              <p className={cn(valueClass, "text-foreground")}>{pct}%</p>
              <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", levelBadgeClass[level])}>
                {level === "over" ? "Over budget" : level === "warn" ? "Almost used" : "On track"}
              </span>
            </div>
            <BudgetProgressBar percent={budget.percentUsed} level={level} className="mt-3" />
            <p className="mt-2.5 text-xs text-muted-foreground tabular">
              {formatEuro(budget.used)} of {formatEuro(budget.budget)} ·{" "}
              <span className={budget.isOver ? "font-medium text-expense" : "font-medium text-income"}>
                {budget.isOver
                  ? `${formatEuro(Math.abs(budget.remaining))} over`
                  : `${formatEuro(budget.remaining)} left`}
              </span>
            </p>
          </>
        ) : (
          <>
            <p className={cn(valueClass, "text-muted-foreground")}>—</p>
            <BudgetProgressBar percent={0} level="none" className="mt-3" />
            <Link
              to="/budget"
              className="mt-2.5 inline-block text-xs font-medium text-primary underline-offset-4 hover:underline"
            >
              Set a monthly budget
            </Link>
          </>
        )}
      </SummaryCard>
    </div>
  );
}
