import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type BadgeProps = {
  children: ReactNode;
  tone?: "neutral" | "saving" | "premium" | "warm";
};

const tones = {
  neutral: "bg-[#f5f2ec] text-text-secondary",
  saving: "bg-[rgba(35,111,73,0.08)] text-[#236f49]",
  premium: "bg-[#f1f3ef] text-[#353a35]",
  warm: "bg-[#f7f2ea] text-[#6f614d]"
};

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-[0.32rem] text-[0.66rem] font-semibold tracking-[0.01em]", tones[tone])}>
      {children}
    </span>
  );
}
