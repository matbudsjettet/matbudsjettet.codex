import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { buttonTap } from "@/lib/design/animations";
import { cn } from "@/lib/utils/cn";

type ButtonProps = HTMLMotionProps<"button"> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "premium";
};

const variants = {
  primary:
    "border border-[#225f40] bg-[#236f49] text-white shadow-[0_10px_22px_rgba(35,111,73,0.2)] hover:-translate-y-px hover:brightness-[1.02] active:translate-y-0",
  secondary:
    "border border-[#e8e2d9] bg-white text-text-primary shadow-[0_8px_20px_rgba(31,23,12,0.05)] hover:bg-[#fbfaf7] hover:opacity-95",
  premium: "border border-[#dfe3db] bg-[#2f342f] text-white shadow-[0_10px_22px_rgba(24,26,24,0.18)] hover:-translate-y-px hover:opacity-95 active:translate-y-0"
};

export function Button({ children, className, variant = "primary", ...props }: ButtonProps) {
  return (
    <motion.button
      className={cn(
        "inline-flex min-h-[48px] items-center justify-center rounded-[0.95rem] px-app-5 py-[12px] text-[0.92rem] font-bold leading-6 tracking-tight transition-[transform,background-color,border-color,opacity,color,filter] duration-200 will-change-transform disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className
      )}
      {...buttonTap}
      {...props}
    >
      {children}
    </motion.button>
  );
}
