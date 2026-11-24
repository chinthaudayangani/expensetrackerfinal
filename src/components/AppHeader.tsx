import { Link } from "@tanstack/react-router";
import { History, LayoutDashboard, MinusCircle, PiggyBank, PlusCircle, Sprout, Upload } from "lucide-react";

const NAV = [
  { to: "/", label: "Dashboard", short: "Home", icon: LayoutDashboard, exact: true },
  { to: "/income", label: "Add Income", short: "Income", icon: PlusCircle, exact: false },
  { to: "/expense", label: "Add Expense", short: "Expense", icon: MinusCircle, exact: false },
  { to: "/budget", label: "Budget", short: "Budget", icon: PiggyBank, exact: false },
  { to: "/history", label: "History", short: "History", icon: History, exact: false },
] as const;

export function AppHeader() {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 md:h-16 md:gap-6">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-hero-gradient text-primary-foreground shadow-hero">
              <Sprout className="h-5 w-5" />
            </span>
            <span className="truncate font-display text-lg font-semibold leading-tight text-foreground">
              Expense Tracker
            </span>
          </Link>

          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex items-center gap-1 rounded-full border border-border/70 bg-card/70 p-1 shadow-card">
              {NAV.map(({ to, label, icon: Icon, exact }) => (
                <li key={to}>
                  <Link
                    to={to}
                    activeOptions={{ exact }}
                    className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    activeProps={{
                      className: "bg-hero-gradient text-primary-foreground shadow-hero hover:bg-transparent hover:text-primary-foreground",
                    }}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Link
            to="/import"
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-secondary-foreground shadow-card transition-colors hover:bg-secondary"
            activeProps={{ className: "bg-secondary" }}
          >
            <Upload className="h-4 w-4" />
            <span>Import</span>
          </Link>
        </div>
      </header>

      {/* Phone navigation: fixed tab bar at the bottom, easy to reach with a thumb. */}
      <nav
        aria-label="Main mobile"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-card/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_-16px_var(--color-foreground)] backdrop-blur-lg md:hidden"
      >
        <ul className="mx-auto grid max-w-md grid-cols-5">
          {NAV.map(({ to, short, icon: Icon, exact }) => (
            <li key={to}>
              <Link
                to={to}
                activeOptions={{ exact }}
                className="group flex flex-col items-center gap-1 px-1 py-2 text-[11px] font-medium text-muted-foreground"
                activeProps={{ className: "text-primary", "aria-current": "page" }}
              >
                <span className="flex h-8 w-12 items-center justify-center rounded-full transition-colors group-aria-[current=page]:bg-secondary">
                  <Icon className="h-5 w-5" />
                </span>
                {short}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
