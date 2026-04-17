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
    <div className="grid grid-cols-5 px-1 py-1.5">
      {items.map((item, index) => (
        <motion.button
          className="flex flex-col items-center justify-center gap-[3px] rounded-xl py-2 transition-colors duration-200"
          key={`${item.label}-${index}`}
          onClick={item.onClick}
          type="button"
          whileTap={{ scale: 0.92 }}
        >
          <item.icon
            className={cn("transition-colors duration-200", item.active ? "text-brand" : "text-[#A09890]")}
            size={21}
            strokeWidth={item.active ? 2.4 : 1.8}
          />
          <span className={cn("text-[0.65rem] font-semibold leading-none tracking-[0.01em] transition-colors duration-200", item.active ? "text-brand font-bold" : "text-[#A09890]")}>
            {item.label}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
