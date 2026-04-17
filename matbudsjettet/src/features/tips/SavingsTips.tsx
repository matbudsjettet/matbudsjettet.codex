import { AnimatePresence, motion } from "framer-motion";
import { TrendingDown, ShoppingCart, Leaf, Repeat2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { pageTransition, sectionVariants } from "@/lib/design/animations";
import { formatCompactNok } from "@/lib/utils/format";
import type { SavingsTip, SavingsTipsReport } from "@/types/domain";

const kindIcon = {
  "meal-swap": TrendingDown,
  pantry: Leaf,
  frozen: Leaf,
  store: ShoppingCart,
  leftovers: Repeat2,
};

const kindColor = {
  "meal-swap": { bg: "bg-saving-bg", text: "text-saving" },
  pantry: { bg: "bg-[#EBF5EF]", text: "text-[#2D7D4F]" },
  frozen: { bg: "bg-[#EBF5EF]", text: "text-[#2D7D4F]" },
  store: { bg: "bg-[#EEF3FB]", text: "text-[#1D5BA8]" },
  leftovers: { bg: "bg-[#FEF3E8]", text: "text-[#B25D0D]" },
};

type Props = {
  onCompleteTip: (id: string) => void;
  onDismissTip: (id: string) => void;
  report: SavingsTipsReport;
};

export function SavingsTips({ onCompleteTip, onDismissTip, report }: Props) {
  return (
    <motion.div animate="animate" className="space-y-4" initial="initial" transition={pageTransition} variants={sectionVariants}>

      {/* Savings hero */}
      <div className="rounded-2xl overflow-hidden bg-[#1A3225] text-white relative">
        <div className="px-5 pt-5.5 pb-5">
          <p className="text-[0.78rem] font-semibold text-white/60">Denne uken</p>
          <p className="mt-1.5 text-[0.875rem] font-medium text-white/80">Du kan spare ytterligere</p>
          <p className="mt-1 text-[2.8rem] font-black tracking-tight leading-none">
            {formatCompactNok(report.totalSavingsPotentialNok)}
          </p>
          <p className="mt-1 text-[0.875rem] text-white/70">ved å følge tipsene under</p>

          <div className="mt-3.5 inline-flex items-center gap-2 rounded-2xl bg-white/10 px-3.5 py-2 text-[0.78rem] font-semibold text-white/80">
            🌱 Så bra! Du er allerede på rett vei.
          </div>
        </div>
        {/* Decorative coin jar illustration */}
        <div className="absolute right-4 top-4 text-4xl opacity-40 select-none">💰</div>
      </div>

      {/* Priority tips */}
      {report.primaryTips.length > 0 ? (
        <section className="space-y-2.5">
          <div>
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.1em] text-text-tertiary">Det viktigste</p>
            <h3 className="mt-0.5 text-[1.05rem] font-black text-text-primary">Ukens tips</h3>
          </div>
          <AnimatePresence mode="popLayout">
            {report.primaryTips.map(tip => (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                initial={{ opacity: 0, y: 8 }}
                key={tip.id}
                transition={pageTransition}
              >
                <PriorityTipCard tip={tip} onComplete={onCompleteTip} onDismiss={onDismissTip} />
              </motion.div>
            ))}
          </AnimatePresence>
        </section>
      ) : (
        <div className="rounded-2xl bg-saving-bg border border-saving-border p-4.5 text-center">
          <div className="text-2xl mb-2">👏</div>
          <p className="text-[0.9rem] font-bold text-text-primary">Du gjør allerede smarte valg!</p>
          <p className="mt-1 text-[0.8rem] text-text-secondary">Ingen forbedringer akkurat nå.</p>
        </div>
      )}

      {/* Secondary tips */}
      {report.secondaryTips.length > 0 && (
        <section className="space-y-2.5">
          <p className="text-[0.875rem] font-bold text-text-secondary">Flere forslag</p>
          <div className="rounded-2xl bg-surface border border-border shadow-card overflow-hidden">
            {report.secondaryTips.map((tip, i) => (
              <SmallTipRow key={tip.id} tip={tip} last={i === report.secondaryTips.length - 1} />
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
}

function PriorityTipCard({ tip, onComplete, onDismiss }: { tip: SavingsTip; onComplete: (id: string) => void; onDismiss: (id: string) => void }) {
  const Icon = kindIcon[tip.kind];
  const color = kindColor[tip.kind];

  return (
    <div className="rounded-2xl bg-surface border border-border shadow-card p-4">
      <div className="flex items-start gap-3">
        <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${color.bg}`}>
          <Icon size={20} className={color.text} strokeWidth={2} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[0.72rem] font-semibold text-text-tertiary">{getActionLabel(tip)}</p>
              <h4 className="mt-0.5 text-[0.95rem] font-bold text-text-primary leading-snug">{tip.title}</h4>
            </div>
            <span className="shrink-0 rounded-xl bg-saving-bg text-saving text-[0.72rem] font-bold px-2.5 py-1.5">
              {formatCompactNok(tip.estimatedSavingsNok)}
            </span>
          </div>
          <p className="mt-1.5 text-[0.82rem] text-text-secondary leading-relaxed">{tip.body}</p>
          <div className="mt-3 flex gap-2">
            <Button onClick={() => onComplete(tip.id)} size="sm" type="button" variant="primary">
              Gjort det ✓
            </Button>
            <Button onClick={() => onDismiss(tip.id)} size="sm" type="button" variant="ghost">
              Ikke nå
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SmallTipRow({ tip, last }: { tip: SavingsTip; last: boolean }) {
  const Icon = kindIcon[tip.kind];
  const color = kindColor[tip.kind];

  return (
    <div className={`flex items-center gap-3 px-4 py-3 ${!last ? "border-b border-border-subtle" : ""}`}>
      <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${color.bg}`}>
        <Icon size={16} className={color.text} strokeWidth={2} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[0.875rem] font-bold text-text-primary leading-snug">{tip.title}</p>
        <p className="mt-0.5 text-[0.75rem] text-text-tertiary line-clamp-1">{tip.body}</p>
      </div>
      <span className="shrink-0 text-[0.82rem] font-bold text-brand">{formatCompactNok(tip.estimatedSavingsNok)}</span>
    </div>
  );
}

function getActionLabel(tip: SavingsTip) {
  if (tip.kind === "meal-swap") return "Bytt middag";
  if (tip.kind === "pantry" || tip.kind === "leftovers") return "Bruk det du har";
  if (tip.kind === "store") return "Juster butikkvalg";
  return "Smart grep";
}
