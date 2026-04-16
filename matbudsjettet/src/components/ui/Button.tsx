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
    "border border-text-primary bg-text-primary text-white shadow-app hover:-translate-y-px hover:opacity-95 active:translate-y-0",
  secondary: "border border-border bg-surface text-text-primary shadow-app hover:border-border-strong hover:bg-bg-elevated hover:opacity-95",
  premium: "border border-premium/30 bg-text-primary text-white shadow-app hover:-translate-y-px hover:opacity-95 active:translate-y-0"
};

export function Button({ children, className, variant = "primary", ...props }: ButtonProps) {
  return (
    <motion.button
      className={cn(
        "inline-flex min-h-[54px] items-center justify-center rounded-lg px-app-5 py-[15px] text-base font-bold leading-6 tracking-tight transition-[transform,background-color,border-color,opacity,color] duration-200 will-change-transform disabled:pointer-events-none disabled:opacity-50",
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
