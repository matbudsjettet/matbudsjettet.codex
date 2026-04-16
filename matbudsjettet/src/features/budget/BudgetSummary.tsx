import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { stores } from "@/lib/data/stores";
import { formatCompactNok } from "@/lib/utils/format";
import type { HouseholdSize, StoreId } from "@/types/domain";

type BudgetSummaryProps = {
  householdSize: HouseholdSize;
  onAdjustPlan: () => void;
  onHouseholdSizeChange: (householdSize: HouseholdSize) => void;
  onSharePlan: () => void;
  onStoreChange: (store: StoreId) => void;
  onWeeklyBudgetChange: (budget: number) => void;
  selectedStore: StoreId;
  storeSavingsHintNok: number;
  weeklyBudgetNok: number;
};

const householdSizes: HouseholdSize[] = [1, 2, 3, 4, 5, 6];

export function BudgetSummary({
  householdSize,
  onAdjustPlan,
  onHouseholdSizeChange,
  onSharePlan,
  onStoreChange,
  onWeeklyBudgetChange,
  selectedStore,
  storeSavingsHintNok,
  weeklyBudgetNok
}: BudgetSummaryProps) {
  const currentStore = stores.find((store) => store.id === selectedStore)?.name;

  return (
    <Card className="space-y-app-5 p-app-5" variant="default">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-headline text-text-primary">Juster ukeplanen</p>
          <p className="mt-app-2 text-body-sm text-text-secondary">
            Endre butikk, budsjett eller antall personer. Resten oppdateres automatisk.
          </p>
        </div>
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-bg-elevated text-text-secondary">
          <SlidersHorizontal size={20} strokeWidth={2.25} />
        </div>
      </div>

      <SegmentedControl
        items={[
          { label: "KIWI", value: "KIWI" },
          { label: "REMA", value: "REMA_1000" },
          { label: "MENY", value: "MENY" }
        ]}
        onChange={(value) => onStoreChange(value as StoreId)}
        value={selectedStore}
      />
      {storeSavingsHintNok > 0 ? (
        <p className="text-caption text-saving">Du kan spare ca. {formatCompactNok(storeSavingsHintNok)} ved å velge KIWI.</p>
      ) : null}

      <div className="grid grid-cols-[1fr_auto] gap-app-3">
        <label className="space-y-1">
          <span className="text-caption text-text-tertiary">Ukesbudsjett</span>
          <input
            className="h-11 w-full rounded-lg border border-border bg-surface px-app-3 text-body-sm font-bold text-text-primary outline-none focus:border-border-strong"
            min={350}
            onChange={(event) => onWeeklyBudgetChange(Number(event.target.value))}
            step={50}
            type="number"
            value={weeklyBudgetNok}
          />
        </label>
        <label className="space-y-1">
          <span className="text-caption text-text-tertiary">Personer</span>
          <select
            className="h-11 rounded-lg border border-border bg-surface px-app-3 text-body-sm font-bold text-text-primary outline-none focus:border-border-strong"
            onChange={(event) => onHouseholdSizeChange(Number(event.target.value) as HouseholdSize)}
            value={householdSize}
          >
            {householdSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="rounded-2xl bg-bg-elevated p-app-4 text-body-sm">
        <p className="font-black text-text-primary">Akkurat nå handler du mest hos {currentStore}.</p>
        <p className="mt-app-1 text-text-secondary">
          Prisene i planen regnes automatisk ut for {householdSize} {householdSize === 1 ? "person" : "personer"}.
        </p>
      </div>

      <div className="mt-app-6 flex gap-app-2">
        <Button className="flex-1" onClick={onAdjustPlan} type="button">
          Se ukeplan
        </Button>
        <Button className="flex-1" onClick={onSharePlan} type="button" variant="secondary">
          Del uke
        </Button>
      </div>
    </Card>
  );
}
