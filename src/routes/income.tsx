import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/PageHeader";
import { TransactionForm } from "@/components/TransactionForm";
import { QuickTotals } from "@/components/QuickTotals";

export const Route = createFileRoute("/income")({
  head: () => ({
    meta: [
      { title: "Add Income · Personal Expense Tracker" },
      { name: "description", content: "Record salary, freelance work, gifts and other income in euros." },
      { property: "og:title", content: "Add Income · Personal Expense Tracker" },
      {
        property: "og:description",
        content: "Record salary, freelance work, gifts and other income in euros.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IncomePage,
});

function IncomePage() {
  return (
    <>
      <PageHeader title="Add income" description="Record money you received." />
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <TransactionForm type="income" />
        </Panel>
        <Panel className="h-fit">
          <QuickTotals />
        </Panel>
      </div>
    </>
  );
}
