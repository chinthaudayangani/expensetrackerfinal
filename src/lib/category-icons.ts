import {
  Briefcase,
  Bus,
  Gift,
  GraduationCap,
  HeartPulse,
  Home,
  Laptop,
  MoreHorizontal,
  Receipt,
  ShoppingBag,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import type { TransactionType } from "./finance";

const INCOME_ICONS: Record<string, LucideIcon> = {
  Salary: Briefcase,
  Freelance: Laptop,
  Gift: Gift,
  Other: MoreHorizontal,
};

const EXPENSE_ICONS: Record<string, LucideIcon> = {
  Housing: Home,
  Food: UtensilsCrossed,
  Transport: Bus,
  Bills: Receipt,
  Shopping: ShoppingBag,
  Health: HeartPulse,
  Study: GraduationCap,
  Other: MoreHorizontal,
};

export function categoryIcon(type: TransactionType, category: string): LucideIcon {
  const map = type === "income" ? INCOME_ICONS : EXPENSE_ICONS;
  return map[category] ?? MoreHorizontal;
}
