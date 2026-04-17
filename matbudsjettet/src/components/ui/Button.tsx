import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { buttonTap } from "@/lib/design/animations";
import { cn } from "@/lib/utils/cn";

type ButtonProps = HTMLMotionProps<"button"> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "premium" | "ghost";
  size?: "sm" | "md" | "lg";
};

const variants = {
  primary: "bg-brand text-white border border-brand active:bg-brand-strong",
  secondary: "bg-surface text-text-primary border border-border hover:border-border-strong hover:bg-bg-elevated",
  premium: "bg-[#1A3225] text-white border border-[#1A3225]",
  ghost: "bg-transparent text-text-secondary border border-transparent hover:bg-surface-soft",
};

const sizes = {
  sm: "min-h-[40px] px-4 py-2 text-[0.875rem] font-semibold rounded-xl",
  md: "min-h-[52px] px-5 py-[14px] text-[0.9375rem] font-bold rounded-2xl",
  lg: "min-h-[56px] px-5 py-[16px] text-[1rem] font-bold rounded-2xl",
};

export function Button({ children, className, variant = "primary", size = "md", ...props }: ButtonProps) {
  return (
    <motion.button
      className={cn("inline-flex items-center justify-center tracking-[-0.01em] transition-all duration-200 will-change-transform disabled:pointer-events-none disabled:opacity-50", variants[variant], sizes[size], className)}
      {...buttonTap}
      {...props}
    >
      {children}
    </motion.button>
  );
}
