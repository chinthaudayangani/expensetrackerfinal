import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-[1.6rem] font-semibold leading-tight text-foreground sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">{actions}</div>}
    </div>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-border bg-card shadow-card ${className}`}>
      {children}
    </section>
  );
}
