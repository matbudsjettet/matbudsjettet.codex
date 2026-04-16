import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type BadgeProps = {
  children: ReactNode;
  tone?: "neutral" | "saving" | "premium" | "warm";
};

const tones = {
  neutral: "border border-border bg-surface text-text-secondary",
  saving: "bg-saving-bg text-saving",
  premium: "border border-premium-border bg-premium-bg text-premium",
  warm: "bg-surface text-text-secondary border border-border"
};

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-caption", tones[tone])}>
      {children}
    </span>
  );
}
