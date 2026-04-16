import { AnimatePresence, motion } from "framer-motion";
import { BadgePercent, Leaf, ShoppingBasket, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { pageTransition, sectionVariants } from "@/lib/design/animations";
import { formatCompactNok } from "@/lib/utils/format";
import type { SavingsTip, SavingsTipsReport } from "@/types/domain";

type SavingsTipsProps = {
  onCompleteTip: (tipId: string) => void;
  onDismissTip: (tipId: string) => void;
  report: SavingsTipsReport;
};

const iconByKind = {
  "meal-swap": Sparkles,
  pantry: BadgePercent,
  frozen: Leaf,
  store: ShoppingBasket,
  leftovers: Leaf
} satisfies Record<SavingsTip["kind"], typeof Sparkles>;

export function SavingsTips({ onCompleteTip, onDismissTip, report }: SavingsTipsProps) {
  return (
    <motion.div
      animate="animate"
      className="space-y-app-6"
      initial="initial"
      transition={pageTransition}
      variants={sectionVariants}
    >
      <div>
        <p className="text-body text-text-secondary">Denne uken</p>
      </div>

      <div className="space-y-app-6">
        <Card className="p-app-5" variant="saving">
          <div className="flex items-end justify-between gap-app-4">
            <div>
              <h3 className="text-title">Du kan spare ytterligere {formatCompactNok(report.totalSavingsPotentialNok)}</h3>
              <p className="mt-app-2 text-body-sm">Ved å følge tipsene under kan du kutte enda mer</p>
            </div>
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-surface text-saving">
              <Sparkles size={22} />
            </div>
          </div>
        </Card>

        {report.primaryTips.length > 0 ? (
          <div className="space-y-app-4">
            <h3 className="text-headline text-text-primary">Det viktigste først</h3>
            <AnimatePresence mode="popLayout">
              <div className="space-y-app-3">
                {report.primaryTips.map((tip) => (
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    initial={{ opacity: 0, y: 8 }}
                    key={tip.id}
                    transition={pageTransition}
                  >
                    <PriorityTipCard onCompleteTip={onCompleteTip} onDismissTip={onDismissTip} tip={tip} />
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              initial={{ opacity: 0, y: 8 }}
              transition={pageTransition}
            >
              <Card className="p-app-4 text-center" variant="surface">
                <h3 className="text-headline text-text-primary">Du gjør allerede smarte valg 👏</h3>
                <p className="mt-app-2 text-body-sm text-text-secondary">Ingen flere forbedringer akkurat nå</p>
              </Card>
            </motion.div>
          </AnimatePresence>
        )}

        {report.secondaryTips.length > 0 ? (
          <div className="space-y-app-3">
            <h3 className="text-body-sm font-black text-text-secondary">Flere forslag</h3>
            <AnimatePresence mode="popLayout">
              <div className="space-y-app-2">
                {report.secondaryTips.map((tip) => (
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    initial={{ opacity: 0, y: 8 }}
                    key={tip.id}
                    transition={pageTransition}
                  >
                    <SmallTipRow tip={tip} />
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}

function PriorityTipCard({
  onCompleteTip,
  onDismissTip,
  tip
}: {
  onCompleteTip: (tipId: string) => void;
  onDismissTip: (tipId: string) => void;
  tip: SavingsTip;
}) {
  const Icon = iconByKind[tip.kind];

  return (
    <Card className="p-app-5" variant="surface">
      <div className="flex items-start gap-app-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-saving-bg text-saving">
          <Icon size={19} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-app-3">
            <div>
              <p className="text-caption text-text-tertiary">{getActionLabel(tip)}</p>
              <h4 className="text-headline text-text-primary">{tip.title}</h4>
            </div>
            <span className="shrink-0 rounded-md bg-saving-bg px-2 py-1 text-caption text-saving">
              {formatCompactNok(tip.estimatedSavingsNok)}
            </span>
          </div>
          <p className="mt-app-2 text-body-sm text-text-secondary">{tip.body}</p>
          <div className="mt-app-4 flex gap-app-2">
            <Button className="min-h-11 px-app-4 py-app-2 text-body-sm" onClick={() => onCompleteTip(tip.id)} type="button" variant="secondary">
              Gjort det ✓
            </Button>
            <Button className="min-h-11 px-app-4 py-app-2 text-body-sm" onClick={() => onDismissTip(tip.id)} type="button" variant="secondary">
              Ikke nå
            </Button>
          </div>
          <p className="mt-app-2 text-caption text-text-tertiary">Huk av når du har gjort endringen</p>
        </div>
      </div>
    </Card>
  );
}

function SmallTipRow({ tip }: { tip: SavingsTip }) {
  return (
    <Card className="p-app-4" variant="default">
      <div className="flex items-start justify-between gap-app-3">
        <div>
          <p className="text-body-sm font-black text-text-primary">{tip.title}</p>
          <p className="mt-1 text-caption text-text-secondary">{tip.body}</p>
        </div>
        <span className="shrink-0 text-body-sm font-black text-saving">{formatCompactNok(tip.estimatedSavingsNok)}</span>
      </div>
    </Card>
  );
}

const getActionLabel = (tip: SavingsTip) => {
  if (tip.kind === "meal-swap") {
    return "Bytt middag";
  }

  if (tip.kind === "pantry" || tip.kind === "leftovers") {
    return "Bruk det du har";
  }

  if (tip.kind === "store") {
    return "Juster butikkvalg";
  }

  return "Gjør et smart bytte";
};
