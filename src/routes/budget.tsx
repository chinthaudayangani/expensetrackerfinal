import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { formatEuro, parseAmount } from "@/lib/finance";
import { saveMonthlyBudget, useFinance } from "@/lib/finance-store";
import { PageHeader, Panel } from "@/components/PageHeader";
import { BudgetSummary } from "@/components/BudgetSummary";
import { cleanAmountInput } from "@/components/TransactionForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/budget")({
  head: () => ({
    meta: [
      { title: "Monthly Budget · Personal Expense Tracker" },
      {
        name: "description",
        content: "Set a monthly spending limit and see how much of it you have used.",
      },
      { property: "og:title", content: "Monthly Budget · Personal Expense Tracker" },
      {
        property: "og:description",
        content: "Set a monthly spending limit and see how much of it you have used.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BudgetPage,
});

function BudgetPage() {
  const { monthlyBudget } = useFinance();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = parseAmount(value);
    if (parsed === null) {
      setError("Enter a budget above €0, for example 800.");
      return;
    }
    setError("");
    saveMonthlyBudget(parsed);
    setValue("");
    toast.success(`Monthly budget set to ${formatEuro(parsed)}`);
  }

  return (
    <>
      <PageHeader title="Monthly budget" description="Set a spending limit for the month." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel className="h-fit">
          <form onSubmit={handleSubmit} noValidate className="space-y-5 p-5 sm:p-6">
            <div>
              <h2 className="text-lg font-semibold">
                {monthlyBudget > 0 ? "Change your budget" : "Set your budget"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {monthlyBudget > 0
                  ? `Current limit: ${formatEuro(monthlyBudget)}`
                  : "How much do you want to spend at most each month?"}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Monthly spending limit</Label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center font-display text-lg font-semibold text-muted-foreground">
                  €
                </span>
                <Input
                  id="budget"
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder={monthlyBudget > 0 ? monthlyBudget.toFixed(2) : "0.00"}
                  value={value}
                  onChange={(e) => setValue(cleanAmountInput(e.target.value))}
                  aria-invalid={!!error}
                  className="h-12 pl-8 font-display text-lg font-semibold tabular"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="submit" size="lg" className="h-12">
                Save budget
              </Button>
              {monthlyBudget > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  className="h-12 text-muted-foreground"
                  onClick={() => {
                    saveMonthlyBudget(0);
                    toast.success("Budget removed");
                  }}
                >
                  Remove budget
                </Button>
              )}
            </div>
          </form>
        </Panel>

        <Panel className="h-fit">
          <BudgetSummary showLink={false} />
        </Panel>
      </div>
    </>
  );
}
