import { motion } from "framer-motion";
import { CheckCircle2, Coffee } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { pageTransition } from "@/lib/design/animations";
import { getCoffeeComparisonText } from "@/lib/utils/savingsComparison";

type ResultScreenProps = {
  onContinue: () => void;
  savingsNok: number;
};

const reasons = [
  "Valgt billigere proteiner",
  "Bruker varer du allerede har",
  "Optimal butikkvalg"
];

const screenVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
};

const reasonListVariants = {
  animate: {
    transition: {
      staggerChildren: 0.09
    }
  }
};

const reasonVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 }
};

export function ResultScreen({ onContinue, savingsNok }: ResultScreenProps) {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <motion.main
        animate="animate"
        className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-app-5 py-[max(1.25rem,env(safe-area-inset-top))]"
        exit="exit"
        initial="initial"
        transition={pageTransition}
        variants={screenVariants}
      >
        <Card className="w-full p-app-6 text-center shadow-app" variant="default">
          <motion.div
            animate={{ rotate: [0, -4, 4, 0], scale: [1, 1.05, 1] }}
            className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-saving-bg text-saving"
            transition={{ delay: 0.15, duration: 0.48, ease: "easeOut" }}
          >
            <CheckCircle2 size={28} strokeWidth={2.5} />
          </motion.div>

          <h1 className="mt-app-5 text-title text-text-primary">
            Du sparer <AnimatedNumber className="text-saving" value={savingsNok} /> denne uken
          </h1>
          <p className="mt-app-2 text-body font-semibold text-text-secondary">
            {getCoffeeComparisonText(savingsNok)}
          </p>

          <motion.div
            animate="animate"
            className="mt-app-6 space-y-app-3 text-left"
            initial="initial"
            variants={reasonListVariants}
          >
            {reasons.map((reason) => (
              <motion.div
                className="flex items-center gap-app-3 rounded-lg border border-border-subtle bg-surface p-app-3"
                key={reason}
                transition={{ duration: 0.26, ease: "easeOut" }}
                variants={reasonVariants}
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-saving-bg text-saving">
                  <CheckCircle2 size={17} />
                </span>
                <span className="text-body-sm font-black text-text-primary">{reason}</span>
              </motion.div>
            ))}
          </motion.div>

          <Button className="mt-app-6 w-full justify-center" onClick={onContinue} type="button">
            Se ukeplan →
          </Button>

          <div className="mt-app-4 flex items-center justify-center gap-1 text-caption text-text-tertiary">
            <Coffee size={14} />
            <span>Basert på ukeplanen din</span>
          </div>
        </Card>
      </motion.main>
    </div>
  );
}
