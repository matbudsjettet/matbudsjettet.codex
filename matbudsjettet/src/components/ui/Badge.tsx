import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

type BadgeTone = "saving" | "warm" | "premium" | "neutral" | "brand" | "danger";

const toneClasses: Record<BadgeTone, string> = {
  saving: "bg-saving-bg text-saving border border-saving-border",
  warm: "bg-[#FFF4EC] text-[#B45309] border border-[#FBDBB8]",
  premium: "bg-premium-bg text-premium border border-premium-border",
  neutral: "bg-surface-soft text-text-secondary border border-border-subtle",
  brand: "bg-brand-light text-brand border border-saving-border",
  danger: "bg-danger-bg text-danger border border-[rgba(192,57,43,0.20)]",
};

export function Badge({ children, tone = "neutral", className }: { children: ReactNode; tone?: BadgeTone; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-lg px-2.5 py-1 text-[0.72rem] font-bold tracking-[0.01em]", toneClasses[tone], className)}>
      {children}
    </span>
  );
}
