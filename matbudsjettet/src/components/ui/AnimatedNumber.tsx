import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { formatCompactNok } from "@/lib/utils/format";

type AnimatedNumberProps = {
  className?: string;
  formatter?: (value: number) => string;
  from?: number;
  prefix?: string;
  pulse?: boolean;
  suffix?: string;
  value: number;
};

const defaultFormatter = (value: number) => formatCompactNok(value);
const durationMs = 650;

export function AnimatedNumber({
  className,
  formatter = defaultFormatter,
  from = 0,
  prefix = "",
  pulse = true,
  suffix = "",
  value
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(from);
  const controls = useAnimationControls();
  const frameRef = useRef<number | null>(null);
  const previousValueRef = useRef(from);
  const safeValue = Number.isFinite(value) ? value : 0;
  const formattedValue = useMemo(
    () => `${prefix}${formatter(Math.round(displayValue))}${suffix}`,
    [displayValue, formatter, prefix, suffix]
  );

  useEffect(() => {
    const startValue = previousValueRef.current;
    const targetValue = safeValue;
    const startedAt = performance.now();

    if (frameRef.current) {
      window.cancelAnimationFrame(frameRef.current);
    }

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / durationMs);
      const eased = 1 - (1 - progress) ** 3;
      const nextValue = startValue + (targetValue - startValue) * eased;

      setDisplayValue(nextValue);

      if (progress < 1) {
        frameRef.current = window.requestAnimationFrame(tick);
        return;
      }

      previousValueRef.current = targetValue;
      setDisplayValue(targetValue);

      if (pulse) {
        void controls.start({
          color: ["#44D07B", "#7AF0A5", "#44D07B"],
          scale: [1, 1.05, 1],
          transition: { duration: 0.34, ease: "easeOut" }
        });
      }
    };

    frameRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [controls, pulse, safeValue]);

  return (
    <motion.span animate={controls} className={cn("inline-block tabular-nums", className)}>
      {formattedValue}
    </motion.span>
  );
}
