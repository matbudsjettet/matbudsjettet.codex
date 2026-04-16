import type { ComponentType } from "react";
import { motion } from "framer-motion";
import { tabMotion } from "@/lib/design/animations";
import { cn } from "@/lib/utils/cn";

type TabItem = {
  activeColor?: string;
  center?: boolean;
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
    <div className="grid grid-cols-5 items-center gap-1.5 px-2 py-2.5">
      {items.map((item, index) => (
        <motion.button
          className={cn(
            item.center
              ? "relative -mt-4 mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#34c86a] text-white shadow-[0_12px_24px_rgba(52,200,106,0.35)] transition-[transform,opacity,background-color,color] duration-200"
              : cn(
                  "relative flex min-h-[58px] flex-col items-center justify-center rounded-[16px] px-1.5 py-1 text-[0.68rem] font-semibold leading-none tracking-tight transition-[transform,opacity,color,background-color,filter] duration-200",
                  item.active
                    ? "bg-[rgba(255,255,255,0.34)] text-[#216d46] shadow-[0_8px_18px_rgba(37,29,18,0.06)]"
                    : "text-[#7d766c] hover:bg-[rgba(255,255,255,0.2)] active:text-[#5c554b]"
                )
          )}
          key={`${item.label}-${index}`}
          onClick={item.onClick}
          style={
            item.center
              ? {
                  background: "#34c86a"
                }
              : item.active
                ? { color: item.activeColor }
              : undefined
          }
          type="button"
          {...tabMotion}
        >
          <item.icon size={item.center ? 24 : 18} strokeWidth={item.center ? 2.6 : item.active ? 2.6 : 2.15} />
          {item.center ? null : <span className="mt-1.5">{item.label}</span>}
          {!item.center && item.active ? (
            <span
              aria-hidden="true"
              className="absolute inset-x-4 bottom-1.5 h-[2.5px] rounded-full"
              style={{ background: item.activeColor ?? "#2b8a58" }}
            />
          ) : null}
        </motion.button>
      ))}
    </div>
  );
}
