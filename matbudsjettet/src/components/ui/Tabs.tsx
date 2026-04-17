import type { ComponentType } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

type TabItem = {
  label: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  active?: boolean;
  onClick?: () => void;
};

export function Tabs({ items }: { items: TabItem[] }) {
  return (
    <div className="grid grid-cols-5 gap-1 px-2 py-2.5">
      {items.map((item, index) => (
        <motion.button
          className={cn(
            "flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-[18px] px-1.5 py-2.5 transition-[background-color,color,transform,opacity] duration-200",
            item.active
              ? "bg-white/55 text-brand shadow-[0_8px_18px_rgba(20,20,18,0.05)]"
              : "text-[#91897f] hover:bg-white/28 active:bg-white/34"
          )}
          key={`${item.label}-${index}`}
          onClick={item.onClick}
          type="button"
          whileTap={{ scale: 0.94 }}
        >
          <item.icon
            className={cn("transition-colors duration-200", item.active ? "text-brand" : "text-[#91897f]")}
            size={20}
            strokeWidth={item.active ? 2.35 : 1.95}
          />
          <span className={cn("text-[0.66rem] font-semibold leading-none tracking-[0.01em] transition-colors duration-200", item.active ? "text-brand" : "text-[#91897f]")}>
            {item.label}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
