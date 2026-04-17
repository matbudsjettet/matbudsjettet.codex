import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cardMotion } from "@/lib/design/animations";
import { cn } from "@/lib/utils/cn";

type CardProps = {
  children: ReactNode;
  className?: string;
  variant?: "default" | "surface" | "saving" | "premium" | "quiet";
};

const variants = {
  default: "border-[#ece7df] bg-surface shadow-[0_8px_18px_rgba(33,25,16,0.04)]",
  surface: "border-[#ece7df] bg-surface shadow-[0_8px_18px_rgba(33,25,16,0.04)]",
  saving: "border-[rgba(35,111,73,0.1)] bg-[rgba(35,111,73,0.07)] text-text-primary shadow-[0_8px_18px_rgba(35,111,73,0.05)]",
  premium: "border-[#e4e7e0] bg-[#f5f6f2] p-app-5 shadow-[0_10px_22px_rgba(24,26,24,0.06)]",
  quiet: "border-border bg-transparent shadow-none"
};

export function Card({ children, className, variant = "default" }: CardProps) {
  return (
    <motion.div
      className={cn("rounded-[1.15rem] border p-app-4 will-change-transform", variants[variant], className)}
      {...cardMotion}
    >
      {children}
    </motion.div>
  );
}
