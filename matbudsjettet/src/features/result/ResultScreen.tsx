import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Button } from "@/components/ui/Button";
import { pageTransition } from "@/lib/design/animations";
import { getCoffeeComparisonText } from "@/lib/utils/savingsComparison";

type Props = { onContinue: () => void; savingsNok: number; };

const reasons = ["Valgt smarte proteiner", "Bruker varer du allerede har", "Optimalt butikkvalg"];

export function ResultScreen({ onContinue, savingsNok }: Props) {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <motion.main
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-5 py-8"
        exit={{ opacity: 0, y: -10 }}
        initial={{ opacity: 0, y: 16 }}
        transition={pageTransition}
      >
        {/* Trophy */}
        <motion.div
          animate={{ scale: [0.8, 1.08, 1] }}
          className="text-[5rem] leading-none mb-6"
          transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
        >
          🏆
        </motion.div>

        <h1 className="text-[1.75rem] font-black tracking-tight text-text-primary text-center">
          Flott jobba! 🎉
        </h1>
        <p className="mt-2 text-[0.9rem] text-text-secondary text-center">Du har fullført planen for denne uken</p>

        {/* Savings amount */}
        <div className="mt-6 w-full rounded-2xl bg-saving-bg border border-saving-border p-6 text-center">
          <p className="text-[0.82rem] font-semibold text-saving mb-1">Du har spart</p>
          <p className="text-[3rem] font-black tracking-tight text-brand leading-none">
            <AnimatedNumber className="text-brand" value={savingsNok} /> kr
          </p>
          <p className="mt-2 text-[0.82rem] text-brand/70 font-medium">{getCoffeeComparisonText(savingsNok)}</p>
          <p className="mt-1 text-[0.75rem] text-text-tertiary">sammenlignet med vanlig handel</p>
        </div>

        {/* Reasons */}
        <div className="mt-4 w-full space-y-2.5">
          {reasons.map((r, i) => (
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 rounded-2xl bg-surface border border-border shadow-card px-4 py-3.5"
              initial={{ opacity: 0, x: 20 }}
              key={r}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.24 }}
            >
              <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-saving-bg">
                <Check size={14} strokeWidth={3} className="text-saving" />
              </div>
              <p className="text-[0.875rem] font-semibold text-text-primary">{r}</p>
            </motion.div>
          ))}
        </div>

        <Button className="mt-8 w-full justify-center" onClick={onContinue} size="lg" type="button">
          Se ukeplan →
        </Button>
      </motion.main>
    </div>
  );
}
