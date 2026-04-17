import { X, Share2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatCompactNok } from "@/lib/utils/format";
import type { BudgetPreference, WeeklyPlan } from "@/types/domain";

export function ShareSummarySheet({ onClose, plan, preference }: { onClose: () => void; plan: WeeklyPlan; preference: BudgetPreference }) {
  const savings = Math.max(0, preference.weeklyBudgetNok - plan.summary.weeklyTotalNok);

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-black/40" onClick={onClose}>
      <div className="mt-auto rounded-t-3xl bg-background p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]" onClick={e => e.stopPropagation()}>
        <div className="flex justify-center mb-4">
          <div className="h-1 w-10 rounded-full bg-border" />
        </div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[1.1rem] font-black text-text-primary">Del ukeplanen</h2>
          <button className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface" onClick={onClose} type="button">
            <X size={17} strokeWidth={2} className="text-text-secondary" />
          </button>
        </div>

        <div className="rounded-2xl bg-[#1A3225] text-white p-5 mb-5">
          <p className="text-[0.78rem] text-white/60">Uke {new Date().getFullYear()}</p>
          <p className="mt-2 text-[1.35rem] font-black">Ukeplan · {plan.meals.length} middager</p>
          <p className="mt-1 text-[0.875rem] text-white/70">{formatCompactNok(plan.summary.weeklyTotalNok)} · Spart {formatCompactNok(savings)}</p>
        </div>

        <Button className="w-full gap-2" type="button">
          <Share2 size={17} />
          Del ukeplan
        </Button>
      </div>
    </div>
  );
}
