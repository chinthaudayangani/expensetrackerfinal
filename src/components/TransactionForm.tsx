import { useEffect, useState, type FormEvent } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  EXPENSE_CATEGORIES,
  INCOME_SOURCES,
  formatEuro,
  isValidDate,
  parseAmount,
  type TransactionType,
} from "@/lib/finance";
import { categoryIcon } from "@/lib/category-icons";
import { addTransaction } from "@/lib/finance-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Errors = Partial<Record<"amount" | "date" | "category", string>>;

/** Keeps only digits and one decimal separator, so a minus sign can never be typed. */
export function cleanAmountInput(value: string) {
  const stripped = value.replace(/[^0-9.,]/g, "");
  const firstSep = stripped.search(/[.,]/);
  if (firstSep === -1) return stripped;
  return stripped.slice(0, firstSep + 1) + stripped.slice(firstSep + 1).replace(/[.,]/g, "");
}

export function TransactionForm({ type }: { type: TransactionType }) {
  const isIncome = type === "income";
  const options = isIncome ? INCOME_SOURCES : EXPENSE_CATEGORIES;
  const groupLabel = isIncome ? "Source" : "Category";

  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    setDate(format(new Date(), "yyyy-MM-dd"));
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = parseAmount(amount);
    const next: Errors = {};
    if (parsed === null) next.amount = "Enter an amount above €0, for example 12.50.";
    if (!isValidDate(date)) next.date = "Please choose a date.";
    if (!category) next.category = `Please choose a ${groupLabel.toLowerCase()}.`;
    setErrors(next);
    if (parsed === null || Object.keys(next).length > 0) return;

    addTransaction({ type, amount: parsed, date, category, note: note.trim() });
    toast.success(`${isIncome ? "Income" : "Expense"} of ${formatEuro(parsed)} added`);
    setAmount("");
    setNote("");
    setCategory("");
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6 p-5 sm:p-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center font-display text-lg font-semibold text-muted-foreground">
              €
            </span>
            <Input
              id="amount"
              inputMode="decimal"
              autoComplete="off"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(cleanAmountInput(e.target.value))}
              aria-invalid={!!errors.amount}
              aria-describedby={errors.amount ? "amount-error" : undefined}
              className="h-12 pl-8 font-display text-lg font-semibold tabular"
            />
          </div>
          {errors.amount && (
            <p id="amount-error" className="text-sm text-destructive">
              {errors.amount}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            aria-invalid={!!errors.date}
            className="h-12"
          />
          {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
        </div>
      </div>

      <fieldset className="space-y-2">
        <legend className="mb-2 text-sm font-medium leading-none">{groupLabel}</legend>
        <div
          role="radiogroup"
          aria-label={groupLabel}
          className={cn(
            "grid gap-2",
            isIncome ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2 sm:grid-cols-4",
          )}
        >
          {options.map((opt) => {
            const Icon = categoryIcon(type, opt);
            const selected = category === opt;
            return (
              <button
                key={opt}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setCategory(opt)}
                className={cn(
                  "flex items-center gap-2 rounded-xl border px-3 py-3 text-left text-sm font-medium transition-all",
                  selected
                    ? "border-primary bg-secondary text-secondary-foreground ring-1 ring-primary"
                    : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted",
                )}
              >
                <Icon className={cn("h-4 w-4", selected ? "text-primary" : "text-muted-foreground")} />
                {opt}
              </button>
            );
          })}
        </div>
        {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
      </fieldset>

      <div className="space-y-2">
        <Label htmlFor="note">
          {isIncome ? "Note" : "Description / note"}{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="note"
          rows={2}
          maxLength={200}
          placeholder={isIncome ? "e.g. November salary" : "e.g. Weekly groceries"}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <Button type="submit" size="lg" className="h-12 w-full text-base sm:w-auto">
        {isIncome ? "Add income" : "Add expense"}
      </Button>
    </form>
  );
}
