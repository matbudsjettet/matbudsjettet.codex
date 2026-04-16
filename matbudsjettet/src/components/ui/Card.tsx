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
  default: "border-[#ece3d8] bg-surface shadow-[0_14px_30px_rgba(33,25,16,0.06)]",
  surface: "border-[#ece3d8] bg-surface shadow-[0_14px_30px_rgba(33,25,16,0.06)]",
  saving: "border-saving-border bg-saving-bg text-text-primary shadow-app",
  premium: "border-premium-border bg-premium-bg p-app-5 shadow-app",
  quiet: "border-border bg-transparent shadow-none"
};

export function Card({ children, className, variant = "default" }: CardProps) {
  return (
    <motion.div
      className={cn("rounded-[1.4rem] border p-app-4 will-change-transform", variants[variant], className)}
      {...cardMotion}
    >
      {children}
    </motion.div>
  );
}
