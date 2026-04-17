import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type CardVariant = "default" | "surface" | "saving" | "premium" | "quiet" | "muted";

const variantClasses: Record<CardVariant, string> = {
  default: "bg-surface border border-border shadow-card",
  surface: "bg-bg-elevated border border-border-subtle",
  saving: "bg-brand-light border border-saving-border",
  premium: "bg-premium-bg border border-premium-border",
  quiet: "bg-surface border border-border-subtle",
  muted: "bg-surface-soft border border-border-subtle",
};

export function Card({ children, className, variant = "default", onClick }: {
  children: ReactNode; className?: string; variant?: CardVariant; onClick?: () => void;
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      className={cn("rounded-2xl", variantClasses[variant], onClick && "w-full text-left transition-[background-color,transform] duration-200 active:scale-[0.99]", className)}
      onClick={onClick}
    >
      {children}
    </Tag>
  );
}
