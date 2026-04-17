import { Crown, Lock, TrendingDown } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { formatCompactNok } from "@/lib/utils/format";
import { createPremiumOptimizationPreview } from "@/lib/engines/premiumOptimizationEngine";
import type { BudgetPreference, WeeklyPlan } from "@/types/domain";

type Props = { locked: boolean; onOpenPaywall: () => void; plan: WeeklyPlan; preference: BudgetPreference };

export function PremiumOptimization({ locked, onOpenPaywall, plan, preference }: Props) {
  const preview = useMemo(() => createPremiumOptimizationPreview(plan, preference, locked), [locked, plan, preference]);

  return (
    <div className="space-y-5">
      {/* Pro hero */}
      <div className="rounded-2xl bg-[#1A3225] text-white p-6">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Crown size={18} className="text-[#D4A017]" />
              <span className="text-[0.78rem] font-bold text-[#D4A017]">PRO</span>
            </div>
            <h2 className="text-[1.4rem] font-black leading-snug">Optimaliser ukeplanen din</h2>
            <p className="mt-1 text-[0.82rem] text-white/70">
              Spar ytterligere {formatCompactNok(preview.estimatedExtraSavingsNok)} med smarte bytter
            </p>
          </div>
          {locked && <Lock size={20} className="text-white/40 shrink-0" />}
        </div>

        {locked ? (
          <Button className="w-full bg-[#D4A017] text-white border-[#D4A017]" onClick={onOpenPaywall} size="lg" type="button">
            Lås opp Pro
          </Button>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {preview.strategies.map(s => (
              <div key={s.id} className="rounded-xl bg-white/10 p-3">
                <p className="text-[0.78rem] font-bold text-white">{s.title}</p>
                <p className="mt-1 text-[1.1rem] font-black text-white">{formatCompactNok(s.estimatedSavingsNok)}</p>
                <p className="text-[0.68rem] text-white/60">spart</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Improvements list */}
      {!locked && preview.improvements.map(imp => (
        <div key={imp.id} className="rounded-2xl bg-surface border border-border shadow-card p-4">
          <div className="flex items-start gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-saving-bg">
              <TrendingDown size={16} className="text-saving" />
            </div>
            <div className="flex-1">
              <p className="text-[0.875rem] font-bold text-text-primary">{imp.title}</p>
              <p className="mt-0.5 text-[0.78rem] text-text-secondary">{imp.body}</p>
            </div>
            <span className="shrink-0 text-[0.82rem] font-bold text-brand">{formatCompactNok(imp.estimatedSavingsNok)}</span>
          </div>
        </div>
      ))}

      {locked && (
        <div className="rounded-2xl bg-surface border border-border shadow-card p-5 text-center">
          <p className="text-[0.875rem] font-semibold text-text-secondary">
            Lås opp for å se alle forbedringsforslag og spare {formatCompactNok(preview.estimatedExtraSavingsNok)} ekstra denne uken.
          </p>
        </div>
      )}
    </div>
  );
}
