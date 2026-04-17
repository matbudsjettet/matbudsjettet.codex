import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { WeeklyRoutineState } from "@/types/domain";
import { formatCompactNok } from "@/lib/utils/format";

type Props = { onRefreshWeek: () => void; routine: WeeklyRoutineState; };

export function WeeklyRoutinePanel({ onRefreshWeek, routine }: Props) {
  const hasHistory = routine.weeklyHistory.length > 0;
  const lastWeekSavings = hasHistory ? routine.weeklyHistory[0]?.pantrySavingsNok ?? 0 : 0;

  return (
    <div className="rounded-2xl bg-surface border border-border shadow-card overflow-hidden">
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.1em] text-text-tertiary">Rutine</p>
            <h3 className="mt-0.5 text-[1.05rem] font-black text-text-primary">Ukentlig oppsett</h3>
          </div>
          {hasHistory && lastWeekSavings > 0 && (
            <span className="rounded-xl bg-saving-bg text-saving text-[0.75rem] font-bold px-3 py-1.5">
              Spart {formatCompactNok(lastWeekSavings)}
            </span>
          )}
        </div>
        <p className="mt-2 text-[0.82rem] text-text-secondary">
          {hasHistory
            ? `${routine.weeklyHistory.length} uker planlagt med Matbudsjett`
            : "Generer en ny ukeplan basert på dine preferanser"}
        </p>
      </div>
      <div className="border-t border-border-subtle px-5 py-4">
        <Button
          className="w-full gap-2"
          onClick={onRefreshWeek}
          type="button"
          variant="secondary"
        >
          <RotateCcw size={16} strokeWidth={2} />
          Generer ny ukeplan
        </Button>
      </div>
    </div>
  );
}
