import type { ComponentType } from "react";
import { motion } from "framer-motion";
import { tabMotion } from "@/lib/design/animations";
import { cn } from "@/lib/utils/cn";

type TabItem = {
  activeColor?: string;
  label: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  active?: boolean;
  onClick?: () => void;
};

type TabsProps = {
  items: TabItem[];
};

export function Tabs({ items }: TabsProps) {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {items.map((item) => (
        <motion.button
          className={cn(
            "flex min-h-[60px] flex-col items-center justify-center rounded-xl px-1 text-caption font-semibold tracking-tight transition-[transform,opacity,background-color,border-color,color] duration-200",
            item.active
              ? "border border-white/70 text-text-primary shadow-sm"
              : "text-text-tertiary active:text-text-secondary"
          )}
          key={item.label}
          onClick={item.onClick}
          style={
            item.active
              ? {
                  background: "rgba(255,255,255,0.75)",
                  backdropFilter: "blur(12px)",
                  color: item.activeColor
                }
              : undefined
          }
          type="button"
          {...tabMotion}
        >
          <item.icon size={19} strokeWidth={2.4} />
          <span className="mt-1">{item.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
