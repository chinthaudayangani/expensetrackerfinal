import { calculateTotals, formatEuro } from "@/lib/finance";
import { useFinance } from "@/lib/finance-store";
import { cn } from "@/lib/utils";

/** Small side card on the add-income / add-expense pages showing live totals. */
export function QuickTotals() {
  const { transactions } = useFinance();
  const { totalIncome, totalExpenses, balance } = calculateTotals(transactions);
  const rows = [
    { label: "Total income", value: totalIncome, tone: "text-income" },
    { label: "Total expenses", value: totalExpenses, tone: "text-expense" },
    { label: "Remaining balance", value: balance, tone: balance < 0 ? "text-expense" : "text-foreground" },
  ];
  return (
    <div className="p-5 sm:p-6">
      <h2 className="text-base font-semibold">Your totals</h2>
      <dl className="mt-4 space-y-3">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between gap-3">
            <dt className="text-sm text-muted-foreground">{r.label}</dt>
            <dd className={cn("font-display font-semibold tabular", r.tone)}>{formatEuro(r.value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
