import { cn } from "@/lib/utils/cn";

export function SegmentedControl({ items, value, onChange }: {
  items: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex rounded-[14px] bg-surface-soft p-1 gap-1">
      {items.map((item) => (
        <button
          className={cn("flex-1 rounded-[11px] px-3 py-2 text-[0.82rem] font-bold tracking-tight transition-all duration-200", item.value === value ? "bg-white text-text-primary shadow-card" : "text-text-tertiary")}
          key={item.value}
          onClick={() => onChange(item.value)}
          type="button"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
