import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type StatusBadgeProps = {
  children: ReactNode;
  status: "underBudget" | "overBudget" | "premium";
};

const statuses = {
  underBudget: "border-saving-border bg-saving-bg text-saving",
  overBudget: "border-danger-border bg-danger-bg text-danger",
  premium: "border-premium-border bg-premium-bg text-premium"
};

export function StatusBadge({ children, status }: StatusBadgeProps) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-caption", statuses[status])}>
      {children}
    </span>
  );
}
