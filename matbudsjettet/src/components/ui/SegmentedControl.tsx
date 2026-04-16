import { cn } from "@/lib/utils/cn";

type Segment = {
  label: string;
  value: string;
};

type SegmentedControlProps = {
  items: Segment[];
  value: string;
  onChange?: (value: string) => void;
  className?: string;
};

export function SegmentedControl({ items, value, onChange, className }: SegmentedControlProps) {
  return (
    <div className={cn("grid rounded-[20px] bg-surface-soft p-1.5", className)}>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
        {items.map((item) => {
          const active = item.value === value;

          return (
            <button
              className={cn(
                "min-h-10 rounded-[16px] px-3 text-caption font-semibold transition-[background-color,border-color,color,opacity] duration-200",
                active
                  ? "border border-border-strong bg-surface text-text-primary shadow-app"
                  : "border border-transparent text-text-tertiary active:text-text-secondary"
              )}
              key={item.value}
              onClick={() => onChange?.(item.value)}
              type="button"
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
