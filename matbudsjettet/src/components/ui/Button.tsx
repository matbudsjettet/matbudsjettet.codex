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
    "border border-[#1f8f55] bg-[#26b567] text-white shadow-[0_10px_24px_rgba(38,181,103,0.24)] hover:-translate-y-px hover:brightness-[1.02] active:translate-y-0",
  secondary:
    "border border-[#e9e1d7] bg-white text-text-primary shadow-[0_8px_20px_rgba(31,23,12,0.06)] hover:bg-[#fbf9f5] hover:opacity-95",
  premium: "border border-premium/30 bg-text-primary text-white shadow-app hover:-translate-y-px hover:opacity-95 active:translate-y-0"
};

export function Button({ children, className, variant = "primary", ...props }: ButtonProps) {
  return (
    <motion.button
      className={cn(
        "inline-flex min-h-[50px] items-center justify-center rounded-xl px-app-5 py-[13px] text-[0.95rem] font-bold leading-6 tracking-tight transition-[transform,background-color,border-color,opacity,color,filter] duration-200 will-change-transform disabled:pointer-events-none disabled:opacity-50",
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
