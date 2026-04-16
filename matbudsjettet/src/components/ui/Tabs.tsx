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
    <div className="grid grid-cols-5 items-end gap-1">
      {items.map((item, index) => (
        <motion.button
          className={cn(
            item.center
              ? "relative -mt-4 mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#34c86a] text-white shadow-[0_12px_24px_rgba(52,200,106,0.35)] transition-[transform,opacity,background-color,color] duration-200"
              : "relative flex min-h-[49px] flex-col items-center justify-center rounded-[11px] px-1 pb-1 text-[0.68rem] font-semibold leading-none tracking-tight text-[#8c867d] transition-[transform,opacity,color] duration-200 active:text-text-secondary"
          )}
          key={`${item.label}-${index}`}
          onClick={item.onClick}
          style={
            item.center
              ? {
                  background: "#34c86a"
                }
              : item.active
                ? {
                    color: item.activeColor
                  }
              : undefined
          }
          type="button"
          {...tabMotion}
        >
          <item.icon size={item.center ? 24 : 18} strokeWidth={item.center ? 2.6 : 2.25} />
          {item.center ? null : <span className="mt-1">{item.label}</span>}
          {!item.center && item.active ? (
            <span
              aria-hidden="true"
              className="absolute inset-x-3 bottom-0 h-[2.5px] rounded-full"
              style={{ background: item.activeColor ?? "#34c86a" }}
            />
          ) : null}
        </motion.button>
      ))}
    </div>
  );
}
