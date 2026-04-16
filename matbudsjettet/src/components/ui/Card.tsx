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
  default: "border-[#ebe5dc] bg-surface shadow-[0_12px_26px_rgba(33,25,16,0.05)]",
  surface: "border-[#ebe5dc] bg-surface shadow-[0_12px_26px_rgba(33,25,16,0.05)]",
  saving: "border-[rgba(35,111,73,0.12)] bg-[rgba(35,111,73,0.08)] text-text-primary shadow-[0_12px_26px_rgba(35,111,73,0.08)]",
  premium: "border-[#e0e4dc] bg-[#f5f6f2] p-app-5 shadow-[0_12px_26px_rgba(24,26,24,0.08)]",
  quiet: "border-border bg-transparent shadow-none"
};

export function Card({ children, className, variant = "default" }: CardProps) {
  return (
    <motion.div
      className={cn("rounded-[1.3rem] border p-app-4 will-change-transform", variants[variant], className)}
      {...cardMotion}
    >
      {children}
    </motion.div>
  );
}
