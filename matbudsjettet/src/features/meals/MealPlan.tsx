import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import mealImage1 from "../../../assets/meals/meal-1.png";
import mealImage2 from "../../../assets/meals/meal-2.png";
import mealImage3 from "../../../assets/meals/meal-3.png";
import mealImage4 from "../../../assets/meals/meal-4.png";
import mealImage5 from "../../../assets/meals/meal-5.png";
import mealImage6 from "../../../assets/meals/meal-6.png";
import mealImage7 from "../../../assets/meals/meal-7.png";
import mealImage8 from "../../../assets/meals/meal-8.png";
import mealImage9 from "../../../assets/meals/meal-9.png";
import mealImage10 from "../../../assets/meals/meal-10.png";
import type { PlannedMeal } from "@/types/domain";

const mealImages = [
  mealImage1,
  mealImage2,
  mealImage3,
  mealImage4,
  mealImage5,
  mealImage6,
  mealImage7,
  mealImage8,
  mealImage9,
  mealImage10
];

type MealPlanProps = {
  meals: PlannedMeal[];
  onOpenRecipe: (meal: PlannedMeal) => void;
};

export function MealPlan({ meals, onOpenRecipe }: MealPlanProps) {
  return (
    <Section eyebrow="Middager" title="Denne uken">
      <motion.div
        animate={{ opacity: 1 }}
        className="flex gap-4 overflow-x-auto pb-2"
        initial={{ opacity: 0 }}
      >
        {meals.map((meal, index) => (
          <button
            className="min-w-[220px] overflow-hidden rounded-2xl bg-white text-left shadow-sm"
            key={meal.id}
            onClick={() => onOpenRecipe(meal)}
            type="button"
          >
            <div className="h-[150px] w-full overflow-hidden">
              <img
                alt={meal.name}
                className="h-full w-full object-cover"
                src={mealImages[index % mealImages.length]}
              />
            </div>

            <div className="p-3">
              <p className="text-xs text-gray-400">{meal.weekday}</p>

              <h3 className="mt-1 text-base font-semibold text-gray-900">
                {meal.name}
              </h3>

              <div className="mt-2 flex flex-wrap gap-2">
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
