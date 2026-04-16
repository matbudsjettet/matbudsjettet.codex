import { Clock3, Minus, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";
import { formatCompactNok } from "@/lib/utils/format";
import type { GeneratedMeal, MealSwapAlternative } from "@/types/domain";

type MealSwapSheetProps = {
  alternatives: MealSwapAlternative[];
  currentMeal: GeneratedMeal | null;
  onClose: () => void;
  onSelect: (alternative: MealSwapAlternative) => void;
};

export function MealSwapSheet({ alternatives, currentMeal, onClose, onSelect }: MealSwapSheetProps) {
  if (!currentMeal) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end bg-text-primary/30 px-app-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto w-full max-w-md rounded-lg border border-border bg-surface p-app-4 shadow-app">
        <div className="flex items-start justify-between gap-app-4">
          <div>
            <p className="text-caption uppercase text-text-tertiary">Bytt rett</p>
            <h2 className="text-title text-text-primary">{currentMeal.name}</h2>
            <p className="mt-app-1 text-body-sm text-text-secondary">
              Velg en rett som passer bedre til tid, budsjett eller metthet.
            </p>
          </div>
          <button
            aria-label="Lukk"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border-subtle bg-surface text-text-secondary"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-app-4 space-y-app-3">
          {alternatives.length > 0 ? (
            alternatives.map((alternative) => (
              <SwapAlternativeCard
                alternative={alternative}
                key={alternative.kind}
                onSelect={() => onSelect(alternative)}
              />
            ))
          ) : (
            <Card className="p-app-4" variant="surface">
              <p className="font-black text-text-primary">Ingen gode bytter akkurat nå</p>
              <p className="mt-app-1 text-body-sm text-text-secondary">
                Denne retten er allerede blant de beste valgene for budsjett, tid og metthet i ukesplanen.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

type SwapAlternativeCardProps = {
  alternative: MealSwapAlternative;
  onSelect: () => void;
};

function SwapAlternativeCard({ alternative, onSelect }: SwapAlternativeCardProps) {
  const isSaving = alternative.priceDifferenceNok < 0;
  const isIncrease = alternative.priceDifferenceNok > 0;

  return (
    <Card className="p-app-4" variant="default">
      <div className="flex items-start justify-between gap-app-3">
        <div className="min-w-0">
          <p className="text-caption text-text-tertiary">{alternative.title}</p>
          <h3 className="mt-1 truncate text-headline text-text-primary">{alternative.meal.name}</h3>
        </div>
        <Badge
          tone={
            alternative.meal.mealTag === "Budsjett"
              ? "saving"
              : alternative.meal.mealTag === "Premium"
                ? "neutral"
                : "warm"
          }
        >
          {alternative.meal.mealTag}
        </Badge>
      </div>

      <div className="mt-app-3 flex flex-wrap items-center gap-app-2 text-body-sm font-bold text-text-secondary">
        <span>{formatCompactNok(alternative.meal.totalPriceNok)}</span>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-md px-2 py-1 text-caption",
            isSaving ? "bg-saving-bg text-saving" : "",
            isIncrease ? "bg-danger-bg text-danger" : "",
            !isSaving && !isIncrease ? "bg-neutral-200 text-text-secondary" : ""
          )}
        >
          {isSaving ? <Minus size={13} /> : isIncrease ? <Plus size={13} /> : null}
          {alternative.priceDifferenceNok === 0
            ? "Samme pris"
            : formatCompactNok(Math.abs(alternative.priceDifferenceNok))}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock3 size={15} />
          {alternative.meal.prepTimeMinutes} min
        </span>
      </div>

      <Button className="mt-app-3 w-full" onClick={onSelect} type="button" variant="secondary">
        Velg denne
      </Button>
    </Card>
  );
}
