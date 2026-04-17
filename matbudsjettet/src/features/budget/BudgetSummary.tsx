import { Button } from "@/components/ui/Button";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { formatCompactNok } from "@/lib/utils/format";
import type { HouseholdSize, StoreId } from "@/types/domain";

type Props = {
  householdSize: HouseholdSize;
  onAdjustPlan: () => void;
  onHouseholdSizeChange: (size: HouseholdSize) => void;
  onSharePlan: () => void;
  onStoreChange: (store: StoreId) => void;
  onWeeklyBudgetChange: (budget: number) => void;
  selectedStore: StoreId;
  storeSavingsHintNok: number;
  weeklyBudgetNok: number;
};

const householdSizes: HouseholdSize[] = [1, 2, 3, 4, 5, 6];
const budgetPresets = [500, 1000, 1500, 2000, 2500, 3000];

export function BudgetSummary({ householdSize, onAdjustPlan, onHouseholdSizeChange, onSharePlan, onStoreChange, onWeeklyBudgetChange, selectedStore, storeSavingsHintNok, weeklyBudgetNok }: Props) {
  return (
    <div className="rounded-2xl bg-surface border border-border shadow-card p-5 space-y-5">
      <div>
        <p className="text-[0.72rem] font-bold uppercase tracking-[0.1em] text-text-tertiary">Juster</p>
        <h3 className="mt-0.5 text-[1.05rem] font-black text-text-primary">Ukeplanen din</h3>
        <p className="mt-1 text-[0.8rem] text-text-secondary">Endre butikk, budsjett eller størrelse. Alt oppdateres automatisk.</p>
      </div>

      {/* Store selector */}
      <div>
        <p className="text-[0.75rem] font-semibold text-text-tertiary mb-2">Butikk</p>
        <SegmentedControl
          items={[
            { label: "KIWI", value: "KIWI" },
            { label: "REMA", value: "REMA_1000" },
            { label: "MENY", value: "MENY" },
          ]}
          onChange={v => onStoreChange(v as StoreId)}
          value={selectedStore}
        />
        {storeSavingsHintNok > 0 && (
          <p className="mt-2 text-[0.75rem] font-semibold text-brand">
            💡 Du kan spare ca. {formatCompactNok(storeSavingsHintNok)} ved å velge KIWI
          </p>
        )}
      </div>

      {/* Budget selector */}
      <div>
        <p className="text-[0.75rem] font-semibold text-text-tertiary mb-2">Ukesbudsjett</p>
        <div className="flex flex-wrap gap-2">
          {budgetPresets.map(preset => (
            <button
              key={preset}
              className={`rounded-xl px-3.5 py-2 text-[0.82rem] font-bold transition-all ${weeklyBudgetNok === preset ? "bg-brand text-white" : "bg-surface-soft text-text-secondary border border-border-subtle"}`}
              onClick={() => onWeeklyBudgetChange(preset)}
              type="button"
            >
              {formatCompactNok(preset)}
            </button>
          ))}
        </div>
        <div className="mt-2">
          <input
            className="h-11 w-full rounded-xl border border-border bg-surface-soft px-4 text-[0.875rem] font-bold text-text-primary outline-none focus:border-brand transition-colors"
            min={350}
            onChange={e => onWeeklyBudgetChange(Number(e.target.value))}
            placeholder="Eget beløp..."
            step={50}
            type="number"
            value={weeklyBudgetNok}
          />
        </div>
      </div>

      {/* Household size */}
      <div>
        <p className="text-[0.75rem] font-semibold text-text-tertiary mb-2">Antall personer</p>
        <div className="flex gap-2">
          {householdSizes.map(size => (
            <button
              key={size}
              className={`h-11 w-11 rounded-xl text-[0.9rem] font-black transition-all ${householdSize === size ? "bg-brand text-white shadow-saving" : "bg-surface-soft text-text-secondary border border-border-subtle"}`}
              onClick={() => onHouseholdSizeChange(size)}
              type="button"
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="flex-1" onClick={onAdjustPlan} type="button">
          Se ukeplan
        </Button>
        <Button className="flex-1" onClick={onSharePlan} type="button" variant="secondary">
          Del uke
        </Button>
      </div>
    </div>
  );
}
