import React from "react";
import { Clock3, Users, ChefHat, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { formatCompactNok } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import { ingredients } from "@/lib/data/ingredients";
import type { MealSwapAlternative, PlannedMeal } from "@/types/domain";
import mealImage1 from "../../../assets/:assets:meals:/:assets:meals:meal-1.png";
import mealImage2 from "../../../assets/:assets:meals:/:assets:meals:meal-2.png";
import mealImage3 from "../../../assets/:assets:meals:/:assets:meals:meal-3.png";
import mealImage4 from "../../../assets/:assets:meals:/:assets:meals:meal-4.png";
import mealImage5 from "../../../assets/:assets:meals:/:assets:meals:meal-5.png";
import mealImage6 from "../../../assets/:assets:meals:/:assets:meals:meal-6.png";
import mealImage7 from "../../../assets/:assets:meals:/:assets:meals:meal-7.png";
import mealImage8 from "../../../assets/:assets:meals:/:assets:meals:meal-8.png";
import mealImage9 from "../../../assets/:assets:meals:/:assets:meals:meal-9.png";
import mealImage10 from "../../../assets/:assets:meals:/:assets:meals:meal-10.png";

const mealImages = [mealImage1, mealImage2, mealImage3, mealImage4, mealImage5, mealImage6, mealImage7, mealImage8, mealImage9, mealImage10];
const ingredientMap = new Map(ingredients.map(i => [i.id, i]));

type Props = {
  alternatives: MealSwapAlternative[];
  meal: PlannedMeal;
  onSelectAlternative: (alt: MealSwapAlternative) => void;
};

export function MealDetailScreen({ alternatives, meal, onSelectAlternative }: Props) {
  const [tab, setTab] = useState<"ingredients" | "steps" | "swap">("ingredients");
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());
  const imgIndex = Math.abs(meal.id.charCodeAt(0) + meal.id.charCodeAt(1)) % 10;
  const img = mealImages[imgIndex];

  const toggleIngredient = (id: string) => {
    setCheckedIngredients(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="-mx-5 -mt-4">
      {/* Hero image */}
      <div className="relative h-[260px] overflow-hidden bg-surface-soft">
        <img alt={meal.name} className="h-full w-full object-cover" src={img} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />
      </div>

      {/* Content */}
      <div className="px-5 pt-5 space-y-5">
        {/* Title block */}
        <div>
          <p className="text-[0.75rem] font-semibold text-text-tertiary">{meal.weekday ?? "Denne uken"}</p>
          <h1 className="mt-1 text-[1.5rem] font-black tracking-tight text-text-primary leading-snug">{meal.name}</h1>
          <p className="mt-1 text-[0.875rem] text-text-secondary">{meal.savingsNote}</p>
        </div>

        {/* Pill row */}
        <div className="flex flex-wrap gap-2">
          <InfoPill icon={<Clock3 size={13} />} label={`${meal.prepTimeMinutes} min`} />
          <InfoPill icon={<ChefHat size={13} />} label={meal.difficulty === "easy" ? "Enkel" : "Middels"} />
          <InfoPill icon={<Users size={13} />} label={`${meal.servings} porsjoner`} />
          <InfoPill icon={null} label={formatCompactNok(meal.totalPriceNok)} accent />
        </div>

        {/* Tabs */}
        <SegmentedControl
          items={[
            { label: "Ingredienser", value: "ingredients" },
            { label: "Fremgangsmåte", value: "steps" },
            { label: `Bytt (${alternatives.length})`, value: "swap" },
          ]}
          onChange={v => setTab(v as typeof tab)}
          value={tab}
        />

        {/* Tab content */}
        {tab === "ingredients" && (
          <div className="space-y-1 pb-4">
            {meal.ingredients.map(ri => {
              const ing = ingredientMap.get(ri.ingredientId);
              if (!ing) return null;
              const checked = checkedIngredients.has(ri.ingredientId);
              return (
                <button
                  key={ri.ingredientId}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-bg-elevated active:bg-bg-elevated"
                  onClick={() => toggleIngredient(ri.ingredientId)}
                  type="button"
                >
                  <span className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-all", checked ? "border-brand bg-brand" : "border-border")}>
                    {checked && <Check size={12} strokeWidth={3} className="text-white" />}
                  </span>
                  <span className={cn("flex-1 text-[0.875rem] font-medium text-text-primary", checked ? "line-through text-text-tertiary" : "")}>
                    {ing.name}
                  </span>
                  <span className="text-[0.8rem] font-semibold text-text-tertiary">
                    {ri.quantity} {ing.unit}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {tab === "steps" && (
          <div className="space-y-3 pb-4">
            {meal.instructions.map((step, i) => (
              <div key={i} className="flex gap-3">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand text-white text-[0.72rem] font-black">
                  {i + 1}
                </div>
                <p className="flex-1 text-[0.875rem] text-text-secondary leading-relaxed pt-0.5">{step}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "swap" && (
          <div className="space-y-3 pb-4">
            {alternatives.length === 0 ? (
              <div className="rounded-2xl bg-bg-elevated border border-border-subtle p-5 text-center">
                <p className="text-[0.875rem] font-bold text-text-primary">Ingen bytter akkurat nå</p>
                <p className="mt-1 text-[0.8rem] text-text-secondary">Denne retten passer godt for uken.</p>
              </div>
            ) : alternatives.map(alt => (
              <SwapCard alt={alt} key={alt.kind} onSelect={() => onSelectAlternative(alt)} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="pb-4">
          <Button className="w-full" onClick={() => setTab("swap")} type="button">
            Bytt måltid
          </Button>
        </div>
      </div>
    </div>
  );
}

function InfoPill({ icon, label, accent }: { icon: React.ReactNode; label: string; accent?: boolean }) {
  return (
    <div className={cn(
      "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[0.78rem] font-semibold",
      accent ? "bg-saving-bg text-saving" : "bg-surface-soft text-text-secondary"
    )}>
      {icon}{label}
    </div>
  );
}

function SwapCard({ alt, onSelect }: { alt: MealSwapAlternative; onSelect: () => void }) {
  const isCheaper = alt.priceDifferenceNok < 0;
  const imgIndex = Math.abs(alt.meal.id.charCodeAt(0) + alt.meal.id.charCodeAt(1)) % 10;
  return (
    <div className="rounded-2xl bg-surface border border-border shadow-card overflow-hidden">
      <div className="h-[100px] overflow-hidden bg-surface-soft">
        <img alt={alt.meal.name} className="h-full w-full object-cover" src={mealImages[imgIndex]} />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[0.72rem] font-semibold text-text-tertiary">{alt.title}</p>
            <p className="mt-0.5 text-[0.95rem] font-bold text-text-primary">{alt.meal.name}</p>
          </div>
          {isCheaper && (
            <span className="shrink-0 rounded-xl bg-saving-bg text-saving text-[0.72rem] font-bold px-2.5 py-1">
              Spar {formatCompactNok(Math.abs(alt.priceDifferenceNok))}
            </span>
          )}
        </div>
        <div className="mt-2 flex items-center gap-3 text-[0.78rem] text-text-tertiary">
          <span className="flex items-center gap-1"><Clock3 size={12} />{alt.meal.prepTimeMinutes} min</span>
          <span>{formatCompactNok(alt.meal.totalPriceNok)}</span>
        </div>
        <Button className="mt-3 w-full" onClick={onSelect} size="sm" type="button">
          Velg denne
        </Button>
      </div>
    </div>
  );
}
