import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { format, subDays } from "date-fns";
import { AlertCircle, Check } from "lucide-react";
import { toast } from "sonner";
import {
  EXPENSE_CATEGORIES,
  INCOME_SOURCES,
  formatEuro,
  isValidDate,
  validateAmount,
  type TransactionType,
} from "@/lib/finance";
import { categoryIcon } from "@/lib/category-icons";
import { addTransaction } from "@/lib/finance-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Field = "amount" | "date" | "category";
type Errors = Partial<Record<Field, string>>;

const NOTE_MAX = 200;
const QUICK_AMOUNTS = [10, 20, 50, 100];

/**
 * Keeps digits, one decimal separator and a minus sign. The minus is kept on purpose
 * so the form can tell the user that negative amounts aren't allowed.
 */
export function cleanAmountInput(value: string) {
  const negative = value.includes("-");
  const stripped = value.replace(/[^0-9.,]/g, "");
  const firstSep = stripped.search(/[.,]/);
  const single =
    firstSep === -1
      ? stripped
      : stripped.slice(0, firstSep + 1) + stripped.slice(firstSep + 1).replace(/[.,]/g, "");
  return (negative ? "-" : "") + single;
}

const today = () => format(new Date(), "yyyy-MM-dd");
const yesterday = () => format(subDays(new Date(), 1), "yyyy-MM-dd");

function FieldError({ id, children }: { id: string; children?: string }) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="flex items-center gap-1.5 text-sm font-medium text-destructive">
      <AlertCircle className="h-4 w-4 shrink-0" />
      {children}
    </p>
  );
}

function Section({ step, title, aside, children }: { step: number; title: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 font-sans text-sm font-semibold text-foreground">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[11px] font-bold text-secondary-foreground">
            {step}
          </span>
          {title}
        </h3>
        {aside}
      </div>
      {children}
    </div>
  );
}

const chipClass = (active: boolean) =>
  cn(
    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
    active
      ? "border-primary bg-secondary text-secondary-foreground"
      : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground",
  );

export function TransactionForm({ type }: { type: TransactionType }) {
  const isIncome = type === "income";
  const options = isIncome ? INCOME_SOURCES : EXPENSE_CATEGORIES;
  const groupLabel = isIncome ? "Source" : "Category";
  const noun = isIncome ? "income" : "expense";

  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [justSaved, setJustSaved] = useState(false);
  const amountRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDate(today());
  }, []);

  useEffect(() => {
    if (!justSaved) return;
    const t = setTimeout(() => setJustSaved(false), 1800);
    return () => clearTimeout(t);
  }, [justSaved]);

  const amountCheck = validateAmount(amount);

  function validate(values = { amount, date, category }): Errors {
    const next: Errors = {};
    const a = validateAmount(values.amount);
    if (!a.ok) next.amount = a.error;
    if (!isValidDate(values.date)) next.date = "Please choose a date.";
    if (!values.category) next.category = `Please choose a ${groupLabel.toLowerCase()}.`;
    return next;
  }

  /** Re-checks a field live once the user has interacted with it. */
  function update(field: Field, value: string) {
    const values = { amount, date, category, [field]: value };
    if (field === "amount") setAmount(value);
    if (field === "date") setDate(value);
    if (field === "category") setCategory(value);
    if (touched[field] || errors[field] || (field === "amount" && value.includes("-"))) {
      setErrors((prev) => ({ ...prev, [field]: validate(values)[field] }));
    }
  }

  function blur(field: Field) {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validate()[field] }));
  }

  function reset() {
    setAmount("");
    setNote("");
    setCategory("");
    setErrors({});
    setTouched({});
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    setTouched({ amount: true, date: true, category: true });
    if (!amountCheck.ok || Object.keys(next).length > 0) {
      if (next.amount) amountRef.current?.focus();
      return;
    }
    addTransaction({ type, amount: amountCheck.value, date, category, note: note.trim().slice(0, NOTE_MAX) });
    toast.success(`${isIncome ? "Income" : "Expense"} of ${formatEuro(amountCheck.value)} added`);
    reset();
    setJustSaved(true);
    amountRef.current?.focus();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="divide-y divide-border">
      {/* Amount */}
      <div className="space-y-3 p-5 sm:p-6">
        <Label htmlFor="amount" className="text-sm font-semibold">
          How much?
        </Label>
        <div
          className={cn(
            "flex items-center gap-2 rounded-2xl border bg-muted/50 px-4 transition-colors focus-within:border-primary focus-within:bg-card focus-within:ring-2 focus-within:ring-ring/20",
            errors.amount ? "border-destructive bg-card" : "border-input",
          )}
        >
          <span className="font-display text-3xl font-semibold text-muted-foreground">€</span>
          <Input
            ref={amountRef}
            id="amount"
            inputMode="decimal"
            autoComplete="off"
            placeholder="0.00"
            value={amount}
            onChange={(e) => update("amount", cleanAmountInput(e.target.value))}
            onBlur={() => blur("amount")}
            aria-invalid={!!errors.amount}
            aria-describedby={errors.amount ? "amount-error" : "amount-hint"}
            className="h-16 border-0 bg-transparent px-0 font-display text-3xl font-semibold shadow-none tabular focus-visible:ring-0"
          />
        </div>
        {errors.amount ? (
          <FieldError id="amount-error">{errors.amount}</FieldError>
        ) : (
          <p id="amount-hint" className="text-xs text-muted-foreground">
            Euros, more than €0. You can use a comma or a dot for cents.
          </p>
        )}
        <div className="flex flex-wrap gap-2" aria-label="Quick amounts">
          {QUICK_AMOUNTS.map((v) => (
            <button
              key={v}
              type="button"
              className={chipClass(amountCheck.ok && amountCheck.value === v)}
              onClick={() => {
                update("amount", String(v));
                setErrors((prev) => ({ ...prev, amount: undefined }));
              }}
            >
              €{v}
            </button>
          ))}
        </div>
      </div>

      {/* Category / source */}
      <div className="p-5 sm:p-6">
        <Section step={1} title={isIncome ? "Where is it from?" : "What was it for?"}>
          <div
            role="radiogroup"
            aria-label={groupLabel}
            aria-describedby={errors.category ? "category-error" : undefined}
            className="grid grid-cols-2 gap-2 sm:grid-cols-4"
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
                  onClick={() => {
                    update("category", opt);
                    setErrors((prev) => ({ ...prev, category: undefined }));
                  }}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-sm font-medium transition-all",
                    selected
                      ? "border-primary bg-secondary text-secondary-foreground ring-1 ring-primary"
                      : errors.category
                        ? "border-destructive/40 bg-card text-foreground hover:bg-muted"
                        : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted",
                  )}
                >
                  <Icon className={cn("h-5 w-5", selected ? "text-primary" : "text-muted-foreground")} />
                  {opt}
                </button>
              );
            })}
          </div>
          <FieldError id="category-error">{errors.category}</FieldError>
        </Section>
      </div>

      {/* Date + note */}
      <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
        <Section
          step={2}
          title="When?"
          aside={
            <div className="flex gap-1.5">
              <button type="button" className={chipClass(date === today())} onClick={() => update("date", today())}>
                Today
              </button>
              <button
                type="button"
                className={chipClass(date === yesterday())}
                onClick={() => update("date", yesterday())}
              >
                Yesterday
              </button>
            </div>
          }
        >
          <Input
            id="date"
            type="date"
            aria-label="Date"
            value={date}
            onChange={(e) => update("date", e.target.value)}
            onBlur={() => blur("date")}
            aria-invalid={!!errors.date}
            className={cn("h-11", errors.date && "border-destructive")}
          />
          <FieldError id="date-error">{errors.date}</FieldError>
        </Section>

        <Section
          step={3}
          title={isIncome ? "Note" : "Description"}
          aside={<span className="text-xs text-muted-foreground">Optional</span>}
        >
          <Textarea
            id="note"
            aria-label={isIncome ? "Note" : "Description / note"}
            rows={2}
            maxLength={NOTE_MAX}
            placeholder={isIncome ? "e.g. November salary" : "e.g. Weekly groceries"}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-11 resize-none"
          />
          <p className="text-right text-xs text-muted-foreground tabular">
            {note.length}/{NOTE_MAX}
          </p>
        </Section>
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-2 bg-muted/40 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <Button type="button" variant="ghost" className="text-muted-foreground" onClick={reset}>
          Clear form
        </Button>
        <Button type="submit" size="lg" className="h-12 min-w-48 text-base">
          {justSaved ? (
            <>
              <Check /> Saved
            </>
          ) : amountCheck.ok ? (
            `Add ${formatEuro(amountCheck.value)} ${noun}`
          ) : (
            `Add ${noun}`
          )}
        </Button>
      </div>
    </form>
  );
}
