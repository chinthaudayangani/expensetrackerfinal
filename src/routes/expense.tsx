import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/PageHeader";
import { TransactionForm } from "@/components/TransactionForm";
import { BudgetSummary } from "@/components/BudgetSummary";

export const Route = createFileRoute("/expense")({
  head: () => ({
    meta: [
      { title: "Add Expense · Personal Expense Tracker" },
      {
        name: "description",
        content: "Log spending on housing, food, transport, bills and more, in euros.",
      },
      { property: "og:title", content: "Add Expense · Personal Expense Tracker" },
      {
        property: "og:description",
        content: "Log spending on housing, food, transport, bills and more, in euros.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ExpensePage,
});

function ExpensePage() {
  return (
    <>
      <PageHeader title="Add expense" description="Record money you spent." />
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <TransactionForm type="expense" />
        </Panel>
        <Panel className="h-fit">
          <BudgetSummary />
        </Panel>
      </div>
    </>
  );
}
