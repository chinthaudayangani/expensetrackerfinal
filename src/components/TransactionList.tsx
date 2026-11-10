import { format, parseISO } from "date-fns";
import { Trash2 } from "lucide-react";
import { formatEuro, type Transaction } from "@/lib/finance";
import { categoryIcon } from "@/lib/category-icons";
import { deleteTransaction } from "@/lib/finance-store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function formatDate(date: string) {
  try {
    return format(parseISO(date), "d MMM yyyy");
  } catch {
    return date;
  }
}

export function TransactionList({
  transactions,
  allowDelete = true,
}: {
  transactions: Transaction[];
  allowDelete?: boolean;
}) {
  return (
    <ul className="space-y-2 p-2 sm:p-3">
      {transactions.map((t) => {
        const Icon = categoryIcon(t.type, t.category);
        const isIncome = t.type === "income";
        return (
          <li
            key={t.id}
            className={cn(
              "relative flex items-center gap-3 overflow-hidden rounded-xl border py-3 pl-5 pr-3 animate-rise sm:pr-4",
              isIncome
                ? "border-income/20 bg-income-soft/50"
                : "border-expense/20 bg-expense-soft/50",
            )}
          >
            <span
              aria-hidden
              className={cn("absolute inset-y-0 left-0 w-1.5", isIncome ? "bg-income" : "bg-expense")}
            />

            <span
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-card shadow-card",
                isIncome ? "text-income" : "text-expense",
              )}
            >
              <Icon className="h-5 w-5" />
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <p className="font-medium text-foreground">{t.category}</p>
                <span
                  className={cn(
                    "rounded-full bg-card px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
                    isIncome ? "text-income" : "text-expense",
                  )}
                >
                  {isIncome ? "Income" : "Expense"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{formatDate(t.date)}</p>
              {t.note && <p className="mt-0.5 truncate text-sm text-muted-foreground">{t.note}</p>}
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <span
                className={cn(
                  "rounded-lg bg-card px-2.5 py-1 font-display text-sm font-semibold tabular shadow-card sm:text-base",
                  isIncome ? "text-income" : "text-expense",
                )}
              >
                {isIncome ? "+" : "−"}
                {formatEuro(t.amount)}
              </span>
              {allowDelete && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-transparent bg-card text-muted-foreground shadow-card hover:border-expense/40 hover:bg-expense-soft hover:text-expense"
                      aria-label={`Delete ${t.category} ${formatEuro(t.amount)}`}
                    >
                      <Trash2 />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this transaction?</AlertDialogTitle>
                      <AlertDialogDescription>
                        {isIncome ? "Income" : "Expense"} of {formatEuro(t.amount)} ({t.category}) on{" "}
                        {formatDate(t.date)} will be removed and your totals will update.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep it</AlertDialogCancel>
                      <AlertDialogAction
                        className={buttonVariants({ variant: "destructive" })}
                        onClick={() => {
                          deleteTransaction(t.id);
                          toast.success("Transaction deleted");
                        }}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
