import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownLeft, ArrowUpRight, MinusCircle, PlusCircle, Wallet } from "lucide-react";
import {
  calculateTotals,
  expensesByCategory,
  formatEuro,
  sortNewestFirst,
} from "@/lib/finance";
import { useFinance } from "@/lib/finance-store";
import { categoryIcon } from "@/lib/category-icons";
import { PageHeader, Panel } from "@/components/PageHeader";
import { BudgetSummary } from "@/components/BudgetSummary";
import { TransactionList } from "@/components/TransactionList";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard · Personal Expense Tracker" },
      {
        name: "description",
        content: "See your total income, expenses, remaining balance and monthly budget at a glance.",
      },
      { property: "og:title", content: "Dashboard · Personal Expense Tracker" },
      {
        property: "og:description",
        content: "See your total income, expenses, remaining balance and monthly budget at a glance.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { transactions } = useFinance();
  const { totalIncome, totalExpenses, balance } = calculateTotals(transactions);
  const recent = sortNewestFirst(transactions).slice(0, 5);
  const byCategory = expensesByCategory(transactions);
  const maxCat = byCategory[0]?.amount ?? 0;

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="A quick look at your money."
        actions={
          <>
            <Button asChild>
              <Link to="/income">
                <PlusCircle /> Add income
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/expense">
                <MinusCircle /> Add expense
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl bg-hero-gradient p-5 text-primary-foreground shadow-hero sm:col-span-2 lg:col-span-1 sm:p-6">
          <Wallet className="absolute -right-4 -bottom-4 h-28 w-28 opacity-15" />
          <p className="text-sm font-medium opacity-90">Remaining balance</p>
          <p className="mt-2 font-display text-4xl font-semibold tabular">{formatEuro(balance)}</p>
          <p className="mt-2 text-xs opacity-80">Total income − total expenses</p>
        </div>

        <StatCard
          label="Total income"
          value={totalIncome}
          icon={<ArrowDownLeft className="h-5 w-5" />}
          tone="income"
        />
        <StatCard
          label="Total expenses"
          value={totalExpenses}
          icon={<ArrowUpRight className="h-5 w-5" />}
          tone="expense"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-5">
        <Panel className="lg:col-span-3">
          <BudgetSummary />
        </Panel>

        <Panel className="lg:col-span-2">
          <div className="p-5 sm:p-6">
            <h2 className="text-lg font-semibold">Spending by category</h2>
            {byCategory.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">No expenses yet.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {byCategory.slice(0, 5).map(({ category, amount }) => {
                  const Icon = categoryIcon("expense", category);
                  return (
                    <li key={category}>
                      <div className="flex items-center justify-between gap-2 text-sm">
                        <span className="flex items-center gap-2 font-medium">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          {category}
                        </span>
                        <span className="tabular text-muted-foreground">{formatEuro(amount)}</span>
                      </div>
                      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-expense/70"
                          style={{ width: `${maxCat ? (amount / maxCat) * 100 : 0}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </Panel>
      </div>

      <Panel className="mt-4">
        <div className="flex items-center justify-between gap-3 px-5 pt-5 sm:px-6">
          <h2 className="text-lg font-semibold">Recent transactions</h2>
          {transactions.length > 0 && (
            <Button asChild variant="link" className="h-auto px-0">
              <Link to="/history">View all</Link>
            </Button>
          )}
        </div>
        {recent.length === 0 ? (
          <p className="px-5 pb-6 pt-2 text-sm text-muted-foreground sm:px-6">
            Nothing here yet. Add your first income or expense to get started.
          </p>
        ) : (
          <div className="mt-2 pb-2">
            <TransactionList transactions={recent} allowDelete={false} />
          </div>
        )}
      </Panel>
    </>
  );
}

function StatCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: "income" | "expense";
}) {
  return (
    <Panel>
      <div className="flex items-start justify-between gap-3 p-5 sm:p-6">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 font-display text-3xl font-semibold tabular text-foreground">
            {formatEuro(value)}
          </p>
        </div>
        <span
          className={
            tone === "income"
              ? "flex h-10 w-10 items-center justify-center rounded-xl bg-income-soft text-income"
              : "flex h-10 w-10 items-center justify-center rounded-xl bg-expense-soft text-expense"
          }
        >
          {icon}
        </span>
      </div>
    </Panel>
  );
}
