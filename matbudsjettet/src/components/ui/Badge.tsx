import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type BadgeProps = {
  children: ReactNode;
  tone?: "neutral" | "saving" | "premium" | "warm";
};

const tones = {
  neutral: "border border-[#ebe5dc] bg-white text-text-secondary",
  saving: "bg-[rgba(35,111,73,0.1)] text-[#236f49]",
  premium: "border border-[#e4e6df] bg-[#f5f6f2] text-[#353a35]",
  warm: "border border-[#eee4d8] bg-[#fbf7f1] text-[#7c6a50]"
};

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[0.68rem] font-semibold tracking-[0.01em]", tones[tone])}>
      {children}
    </span>
  );
}
