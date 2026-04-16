import { Clock3, Minus, Plus } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { getMealImage } from "@/lib/design/mealImages";
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
    <div className="space-y-5">
      <Card className="overflow-hidden p-0" variant="surface">
        <div className="relative h-[14rem] overflow-hidden bg-[#5d4e3c]">
          <img alt={meal.name} className="h-full w-full object-cover" src={getMealImage(meal.id)} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <Badge tone={meal.mealTag === "Budsjett" ? "saving" : meal.mealTag === "Premium" ? "neutral" : "warm"}>
                {meal.mealTag}
              </Badge>
              <span className="rounded-full bg-white/15 px-2.5 py-1 text-[0.72rem] font-semibold text-white backdrop-blur-sm">
                {meal.weekday}
              </span>
            </div>
            <h2 className="text-[1.7rem] font-black leading-tight text-white">{meal.name}</h2>
            <p className="mt-2 max-w-[18rem] text-[0.92rem] leading-relaxed text-white/84">{meal.savingsNote}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 p-4">
          <div className="rounded-[1rem] bg-[#faf7f1] p-3">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-text-tertiary">Pris</p>
            <p className="mt-1 font-black text-text-primary">{formatCompactNok(meal.totalPriceNok)}</p>
          </div>
          <div className="rounded-[1rem] bg-[#faf7f1] p-3">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-text-tertiary">Tid</p>
            <p className="mt-1 font-black text-text-primary">{meal.prepTimeMinutes} min</p>
          </div>
          <div className="rounded-[1rem] bg-[#faf7f1] p-3">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-text-tertiary">Per porsjon</p>
            <p className="mt-1 font-black text-text-primary">{formatNok(meal.costPerServingNok)}</p>
          </div>
          <div className="rounded-[1rem] bg-[#faf7f1] p-3">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-text-tertiary">Planmodus</p>
            <p className="mt-1 font-black text-text-primary">{meal.baseCostReference}</p>
          </div>
        </div>
      </Card>

      <Section eyebrow="Bytt rett" title="Gode alternativer">
        <div className="space-y-3">
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
    <Card className="overflow-hidden p-0" variant="default">
      <div className="grid grid-cols-[92px_minmax(0,1fr)] items-stretch gap-0">
        <div className="overflow-hidden bg-[#efe8dd]">
          <img alt={alternative.meal.name} className="h-full w-full object-cover" src={getMealImage(alternative.meal.id)} />
        </div>
        <div className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[0.74rem] font-semibold uppercase tracking-[0.08em] text-text-tertiary">{alternative.title}</p>
              <h3 className="mt-1 text-[1.05rem] font-bold leading-snug text-text-primary">{alternative.meal.name}</h3>
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
          <div className="flex flex-wrap items-center gap-2 text-body-sm font-bold text-text-secondary">
            <span>{formatCompactNok(alternative.meal.totalPriceNok)}</span>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.72rem] font-semibold",
                isSaving ? "bg-saving-bg text-saving" : "",
                isIncrease ? "bg-[#f8ede7] text-[#c96943]" : "",
                !isSaving && !isIncrease ? "bg-[#efebe4] text-text-secondary" : ""
              )}
            >
              {isSaving ? <Minus size={13} /> : isIncrease ? <Plus size={13} /> : null}
              {alternative.priceDifferenceNok === 0 ? "Samme pris" : <AnimatedNumber pulse={isSaving} value={Math.abs(alternative.priceDifferenceNok)} />}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock3 size={15} />
              {alternative.meal.prepTimeMinutes} min
            </span>
          </div>
          <Button className="w-full" onClick={onSelect} type="button" variant="secondary">
            Velg denne
          </Button>
          {isSaving ? <p className="text-[0.78rem] font-semibold text-saving">Spar {formatCompactNok(Math.abs(alternative.priceDifferenceNok))}</p> : null}
        </div>
      </div>
    </Card>
  );
}
