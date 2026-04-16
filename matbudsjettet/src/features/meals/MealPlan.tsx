import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/cn";
import type { PlannedMeal } from "@/types/domain";

type MealPlanProps = {
  meals: PlannedMeal[];
  onOpenRecipe: (meal: PlannedMeal) => void;
};

export function MealPlan({ meals, onOpenRecipe }: MealPlanProps) {
  return (
    <Section eyebrow="Middager" title="Denne uken">
      <motion.div
        className="flex gap-4 overflow-x-auto pb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {meals.map((meal, index) => (
          <button
            key={meal.id}
            onClick={() => onOpenRecipe(meal)}
            className="min-w-[220px] rounded-2xl bg-white shadow-sm overflow-hidden text-left"
          >
            {/* IMAGE */}
            <div className="h-[150px] w-full overflow-hidden">
              <img
                src={`/assets/meals/meal-${index + 1}.png`}
                className="h-full w-full object-cover"
              />
            </div>

            {/* CONTENT */}
            <div className="p-3">
              <p className="text-xs text-gray-400">{meal.weekday}</p>

              <h3 className="text-base font-semibold text-gray-900 mt-1">
                {meal.name}
              </h3>

              <div className="flex gap-2 mt-2 flex-wrap">
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
          </button>
        ))}
      </motion.div>
    </Section>
  );
}