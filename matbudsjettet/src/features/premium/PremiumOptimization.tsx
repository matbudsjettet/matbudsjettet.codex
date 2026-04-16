import { Check, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { pageTransition, sectionVariants } from "@/lib/design/animations";
import { createPremiumOptimizationPreview } from "@/lib/engines/premiumOptimizationEngine";
import { formatCompactNok } from "@/lib/utils/format";
import type { BudgetPreference, WeeklyPlan } from "@/types/domain";

type PremiumOptimizationProps = {
  locked?: boolean;
  onOpenPaywall: () => void;
  plan: WeeklyPlan;
  preference: BudgetPreference;
};

export function PremiumOptimization({ locked = true, onOpenPaywall, plan, preference }: PremiumOptimizationProps) {
  const preview = createPremiumOptimizationPreview(plan, preference, locked);
  const currentStrategy = preview.strategies.find((strategy) => strategy.id === "practical");
  const optimizedStrategy = preview.strategies.find((strategy) => strategy.id === "max-savings");
  const originalTotalNok = currentStrategy?.estimatedTotalNok ?? plan.summary.weeklyTotalNok;
  const optimizedTotalNok = optimizedStrategy?.estimatedTotalNok ?? Math.max(0, originalTotalNok - preview.estimatedExtraSavingsNok);
  const estimatedSavingsNok = Math.max(0, originalTotalNok - optimizedTotalNok);

  return (
    <Section eyebrow="Pro" title="Optimaliser handelen din">
      <motion.div
        animate="animate"
        className="space-y-app-6"
        initial="initial"
        transition={pageTransition}
        variants={sectionVariants}
      >
        <div className="overflow-hidden rounded-[28px] border border-border bg-surface p-app-6 shadow-app">
          <div className="flex items-start justify-between gap-app-4">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-app-2 rounded-full border border-premium-border bg-premium-bg px-app-3 py-app-2 text-caption text-premium">
                <Crown size={14} strokeWidth={2.5} />
                <span>Matbudsjettet Pro</span>
              </div>
              <h3 className="mt-app-5 text-[2rem] font-black leading-9 tracking-tight text-text-primary">
                Spar mer med smartere handlevalg.
              </h3>
              <p className="mt-app-3 max-w-[17rem] text-body text-text-secondary">
                Finn billigste kombinasjon og få forslag som kutter kostnader automatisk.
              </p>
            </div>
          </div>

          <div className="mt-app-6 rounded-2xl bg-bg-elevated p-app-4">
            <div className="grid grid-cols-3 gap-app-2">
              <ComparisonValue label="Uten Pro" value={formatCompactNok(originalTotalNok)} />
              <ComparisonValue emphasized label="Med Pro" value={formatCompactNok(optimizedTotalNok)} />
              <ComparisonValue saving label="Sparer" value={formatCompactNok(estimatedSavingsNok)} />
            </div>
            <p className="mt-app-3 text-caption text-text-tertiary">
              {preview.locked ? "Estimert, ikke live prisdata." : "Beregnet fra ukeplanen din."} Sparer {formatCompactNok(estimatedSavingsNok)} denne uken.
            </p>
          </div>

          <Button className="mt-app-6 w-full" onClick={onOpenPaywall} type="button" variant="premium">
            Få tilgang til Pro
          </Button>
        </div>

        <Card className="p-app-4" variant="default">
          <h3 className="text-headline text-text-primary">Dette åpner Pro</h3>
          <div className="mt-app-3 space-y-app-2">
            {[
              "Live priser fra norske butikker",
              "Automatisk billigste handlekurv",
              "Smarte bytteforslag basert på pris",
              "Oppdatert prisnivå hver uke"
            ].map((bullet) => (
              <div className="flex items-center gap-app-2 text-body-sm font-bold text-text-secondary" key={bullet}>
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-premium-border bg-premium-bg text-premium">
                  <Check size={15} strokeWidth={3} />
                </span>
                <span>{bullet}</span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </Section>
  );
}

function ComparisonValue({
  emphasized = false,
  label,
  saving = false,
  value
}: {
  emphasized?: boolean;
  label: string;
  saving?: boolean;
  value: string;
}) {
  return (
    <div className={emphasized ? "rounded-xl bg-surface px-app-2 py-app-3 shadow-app" : "px-app-1 py-app-3"}>
      <p className="text-caption text-text-tertiary">{label}</p>
      <p className={saving ? "mt-1 text-body-sm font-black text-saving" : "mt-1 text-body-sm font-black text-text-primary"}>{value}</p>
    </div>
  );
}
