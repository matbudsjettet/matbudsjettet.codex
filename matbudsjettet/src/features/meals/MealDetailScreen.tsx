import { Clock3, Minus, Plus } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/utils/cn";
import { formatCompactNok, formatNok } from "@/lib/utils/format";
import type { MealSwapAlternative, PlannedMeal } from "@/types/domain";

type MealDetailScreenProps = {
  alternatives: MealSwapAlternative[];
  meal: PlannedMeal;
  onSelectAlternative: (alternative: MealSwapAlternative) => void;
};

export function MealDetailScreen({ alternatives, meal, onSelectAlternative }: MealDetailScreenProps) {
  return (
    <div className="space-y-app-6">
      <Card className="p-app-4" variant="surface">
        <div className="flex items-start justify-between gap-app-3">
          <div>
            <p className="text-body-sm font-black text-text-secondary">{meal.weekday}</p>
            <h2 className="mt-1 text-title text-text-primary">{meal.name}</h2>
          </div>
          <Badge tone={meal.mealTag === "Budsjett" ? "saving" : meal.mealTag === "Premium" ? "neutral" : "warm"}>
            {meal.mealTag}
          </Badge>
        </div>
        <div className="mt-app-4 grid grid-cols-2 gap-app-3 text-body-sm">
          <div>
            <p className="font-semibold text-text-tertiary">Pris</p>
            <p className="font-black text-text-primary">{formatCompactNok(meal.totalPriceNok)}</p>
          </div>
          <div>
            <p className="font-semibold text-text-tertiary">Tid</p>
            <p className="font-black text-text-primary">{meal.prepTimeMinutes} min</p>
          </div>
          <div>
            <p className="font-semibold text-text-tertiary">Per porsjon</p>
            <p className="font-black text-text-primary">{formatNok(meal.costPerServingNok)}</p>
          </div>
          <div>
            <p className="font-semibold text-text-tertiary">Basis</p>
            <p className="font-black text-text-primary">{meal.baseCostReference}</p>
          </div>
        </div>
        <p className="mt-app-4 text-body-sm text-text-secondary">{meal.savingsNote}</p>
      </Card>

      <Section eyebrow="Bytt rett" title="Gode alternativer">
        <div className="space-y-app-3">
          {alternatives.length > 0 ? (
            alternatives.map((alternative) => (
              <AlternativeCard
                alternative={alternative}
                key={alternative.kind}
                onSelect={() => onSelectAlternative(alternative)}
              />
            ))
          ) : (
            <Card className="p-app-4" variant="surface">
              <p className="font-black text-text-primary">Ingen tydelige bytter akkurat nå</p>
              <p className="mt-app-1 text-body-sm text-text-secondary">
                Denne retten passer allerede godt med budsjett, tid og ukens sammensetning.
              </p>
            </Card>
          )}
        </div>
      </Section>
    </div>
  );
}

function AlternativeCard({ alternative, onSelect }: { alternative: MealSwapAlternative; onSelect: () => void }) {
  const isSaving = alternative.priceDifferenceNok < 0;
  const isIncrease = alternative.priceDifferenceNok > 0;

  return (
    <Card className="p-app-4" variant="default">
      <div className="flex items-start justify-between gap-app-3">
        <div>
          <p className="text-caption text-text-tertiary">{alternative.title}</p>
          <h3 className="mt-1 text-headline text-text-primary">{alternative.meal.name}</h3>
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
          {alternative.priceDifferenceNok === 0 ? (
            "Samme pris"
          ) : (
            <AnimatedNumber pulse={isSaving} value={Math.abs(alternative.priceDifferenceNok)} />
          )}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock3 size={15} />
          {alternative.meal.prepTimeMinutes} min
        </span>
      </div>
      <Button className="mt-app-3 w-full" onClick={onSelect} type="button" variant="secondary">
        Velg denne
      </Button>
      {isSaving ? (
        <p className="mt-app-2 text-center text-caption text-saving">
          Spar {formatCompactNok(Math.abs(alternative.priceDifferenceNok))}
        </p>
      ) : null}
    </Card>
  );
}
