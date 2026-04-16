import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type BadgeProps = {
  children: ReactNode;
  tone?: "neutral" | "saving" | "premium" | "warm";
};

const tones = {
  neutral: "border border-[#e8e0d6] bg-white text-text-secondary",
  saving: "bg-[#e8f7ee] text-[#239d5a]",
  premium: "border border-[#ddd9ff] bg-[#f2efff] text-[#7263ef]",
  warm: "border border-[#f0e4d5] bg-[#fff7ef] text-[#a86a25]"
};

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[0.7rem] font-semibold", tones[tone])}>
      {children}
    </span>
  );
}
