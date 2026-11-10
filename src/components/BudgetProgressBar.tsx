import type { BudgetLevel } from "@/lib/finance";
import { cn } from "@/lib/utils";

export function BudgetProgressBar({
  percent,
  level,
  className,
}: {
  percent: number;
  level: BudgetLevel;
  className?: string;
}) {
  const width = Math.max(0, Math.min(percent, 100));
  return (
    <div
      className={cn("h-2.5 w-full overflow-hidden rounded-full bg-muted", className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(width)}
      aria-label="Budget used"
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-700 ease-out",
          (level === "ok" || level === "none") && "bg-hero-gradient",
          level === "warn" && "bg-warning",
          level === "over" && "bg-expense",
        )}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

export const levelBadgeClass: Record<BudgetLevel, string> = {
  none: "bg-muted text-muted-foreground",
  ok: "bg-income-soft text-income",
  warn: "bg-warning-soft text-warning",
  over: "bg-expense-soft text-expense",
};
