import { Link } from "@tanstack/react-router";
import { History, LayoutDashboard, MinusCircle, PiggyBank, PlusCircle, Sprout } from "lucide-react";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/income", label: "Add Income", icon: PlusCircle, exact: false },
  { to: "/expense", label: "Add Expense", icon: MinusCircle, exact: false },
  { to: "/budget", label: "Budget", icon: PiggyBank, exact: false },
  { to: "/history", label: "History", icon: History, exact: false },
] as const;

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 md:flex-row md:items-center md:justify-between md:gap-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-hero-gradient text-primary-foreground shadow-hero">
            <Sprout className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-semibold leading-tight text-foreground">
            Expense Tracker
          </span>
        </Link>

        <nav aria-label="Main" className="-mx-4 overflow-x-auto px-4 scrollbar-none md:mx-0 md:px-0">
          <ul className="flex min-w-max items-center gap-1">
            {NAV.map(({ to, label, icon: Icon, exact }) => (
              <li key={to}>
                <Link
                  to={to}
                  activeOptions={{ exact }}
                  className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  activeProps={{
                    className: "bg-secondary text-secondary-foreground hover:bg-secondary",
                  }}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
