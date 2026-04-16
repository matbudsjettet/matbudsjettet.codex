import { ChevronRight, Clock3 } from "lucide-react";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { PlannedMeal } from "@/types/domain";
import { getMealImage } from "@/lib/design/mealImages";
const weekdayLabels = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];

type MealPlanProps = {
  meals: PlannedMeal[];
  onOpenRecipe: (meal: PlannedMeal) => void;
};

export function MealPlan({ meals, onOpenRecipe }: MealPlanProps) {
  return (
    <Section
      action={
        <Button className="min-h-[42px] px-4 py-2 text-[0.82rem]" variant="secondary">
          Hele planen
        </Button>
      }
      eyebrow="Middager"
      title="Denne uken"
    >
      <motion.div
        animate={{ opacity: 1 }}
        className="space-y-2.5"
        initial={{ opacity: 0 }}
      >
        {meals.map((meal, index) => (
          <button
            className="flex w-full items-center gap-3 overflow-hidden rounded-[1.25rem] bg-white p-3 text-left shadow-[0_10px_22px_rgba(33,25,16,0.06)]"
            key={meal.id}
            onClick={() => onOpenRecipe(meal)}
            type="button"
          >
            <div className="relative h-[84px] w-[92px] shrink-0 overflow-hidden rounded-[1rem] bg-[#efe8dd]">
              <img alt={meal.name} className="h-full w-full object-cover" src={getMealImage(meal.id, index)} />
              <div className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-1 text-[0.62rem] font-semibold text-[#544d43]">
                {weekdayLabels[index] ?? meal.weekday ?? `Dag ${index + 1}`}
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="line-clamp-2 text-[0.98rem] font-bold leading-snug text-[#1d1a16]">
                {meal.name}
              </h3>
              <div className="mt-1 flex items-center gap-3 text-[0.76rem] text-[#7d7569]">
                <span className="inline-flex items-center gap-1">
                  <Clock3 size={12} strokeWidth={2.1} />
                  {meal.prepTimeMinutes} min
                </span>
                <span>{meal.totalPriceNok.toLocaleString("nb-NO")} kr</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {meal.categorySignals.budget && (
                  <Badge tone="saving">Billig</Badge>
                )}
                {meal.prepTimeMinutes <= 25 && (
                  <Badge tone="premium">Rask</Badge>
                )}
                {meal.categorySignals.family && (
                  <Badge tone="warm">Populær</Badge>
                )}
              </div>
            </div>
            <ChevronRight className="shrink-0 text-[#8a8174]" size={18} strokeWidth={2.2} />
          </button>
        ))}
      </motion.div>
    </Section>
  );
}
