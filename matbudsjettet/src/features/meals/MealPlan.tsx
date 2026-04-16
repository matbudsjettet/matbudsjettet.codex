import { Clock3, Heart, RotateCcw, ThumbsDown } from "lucide-react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { pageTransition, sectionVariants } from "@/lib/design/animations";
import { formatCompactNok, formatNok } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { PlannedMeal, UserMealPreferences } from "@/types/domain";

type MealPlanProps = {
  mealPreferences: UserMealPreferences;
  meals: PlannedMeal[];
  onOpenRecipe: (meal: PlannedMeal) => void;
  onToggleDislikedMeal: (mealId: string) => void;
  onToggleFavoriteMeal: (mealId: string) => void;
  onToggleRepeatCheapMeal: (mealId: string) => void;
  onSwapMeal: (meal: PlannedMeal) => void;
};

export function MealPlan({
  mealPreferences,
  meals,
  onOpenRecipe,
  onSwapMeal,
  onToggleDislikedMeal,
  onToggleFavoriteMeal,
  onToggleRepeatCheapMeal
}: MealPlanProps) {
  return (
    <Section eyebrow="Middager" title="Denne uken">
      <motion.div
        animate="animate"
        className="space-y-app-4"
        initial="initial"
        transition={pageTransition}
        variants={sectionVariants}
      >
        {meals.map((meal) => (
          <Card className={cn("border-l-4 p-app-5", getMealAccentClass(meal.mealTag))} key={meal.id} variant="surface">
            <div className="flex items-start gap-app-3">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg border border-border bg-surface text-2xl">
                {getMealIcon(meal)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-body-sm font-black text-text-secondary">{meal.weekday}</p>
                <h3 className="mt-1 text-title text-text-primary">{meal.name}</h3>
                <div className="mt-app-3 flex flex-wrap gap-app-2">
                  {getCuratedTags(meal).map((tag) => (
                    <Badge key={tag.label} tone={tag.tone}>
                      {tag.label}
                    </Badge>
                  ))}
                </div>
              </div>
              <Badge tone={meal.mealTag === "Budsjett" ? "saving" : meal.mealTag === "Premium" ? "neutral" : "warm"}>
                {meal.mealTag}
              </Badge>
            </div>

            <div className="mt-app-4 flex flex-wrap items-center gap-app-2 text-body-sm font-semibold text-text-secondary">
              <span className="inline-flex items-center gap-1">
                <Clock3 size={16} />
                {meal.prepTimeMinutes} min
              </span>
              <span>{formatCompactNok(meal.totalPriceNok)} beregnet</span>
              <span>{meal.baseCostReference}</span>
            </div>

            <div className="mt-app-4 rounded-lg border border-border bg-surface p-app-3">
              <p className="text-caption text-text-tertiary">Hvorfor denne retten?</p>
              <p className="mt-1 text-body-sm font-semibold text-text-secondary">{getMealReason(meal)}</p>
            </div>

            <p className="mt-app-3 text-body-sm text-text-secondary">{meal.savingsNote}</p>
            <p className="mt-app-2 text-caption text-text-tertiary">
              {formatNok(meal.costPerServingNok)} per porsjon · {formatDifficulty(meal.difficulty)}
            </p>
            <div className="mt-app-4 grid grid-cols-3 gap-app-2">
              <MealHabitButton
                active={mealPreferences.favoriteMealIds.includes(meal.id)}
                icon={<Heart size={15} />}
                label="Favoritt"
                onClick={() => onToggleFavoriteMeal(meal.id)}
              />
              <MealHabitButton
                active={mealPreferences.repeatCheapMealIds.includes(meal.id)}
                icon={<RotateCcw size={15} />}
                label="Gjenta billig"
                onClick={() => onToggleRepeatCheapMeal(meal.id)}
              />
              <MealHabitButton
                active={mealPreferences.dislikedMealIds.includes(meal.id)}
                icon={<ThumbsDown size={15} />}
                label="Ikke ofte"
                onClick={() => onToggleDislikedMeal(meal.id)}
              />
            </div>
            <div className="mt-app-4 grid grid-cols-2 gap-app-2">
              <Button onClick={() => onOpenRecipe(meal)} type="button" variant="secondary">
                Se oppskrift
              </Button>
              <Button onClick={() => onSwapMeal(meal)} type="button" variant="secondary">
                Bytt rett
              </Button>
            </div>
          </Card>
        ))}
      </motion.div>
    </Section>
  );
}

const formatDifficulty = (difficulty: PlannedMeal["difficulty"]) =>
  difficulty === "easy" ? "enkel" : "middels";

const getMealIcon = (meal: PlannedMeal) => {
  if (meal.categorySignals.budget) {
    return "💰";
  }

  if (meal.prepTimeMinutes <= 25) {
    return "⚡";
  }

  if (meal.categorySignals.vegetarian) {
    return "🥦";
  }

  if (meal.categorySignals.protein) {
    return "🍗";
  }

  return "🍽️";
};

const getCuratedTags = (meal: PlannedMeal) => {
  const tags: Array<{ label: string; tone: "saving" | "warm" | "premium" | "neutral" }> = [];

  if (meal.categorySignals.budget) {
    tags.push({ label: "Billig", tone: "saving" });
  }

  if (meal.categorySignals.family) {
    tags.push({ label: "Populær", tone: "warm" });
  }

  if (meal.prepTimeMinutes <= 25) {
    tags.push({ label: "Rask", tone: "premium" });
  }

  if (meal.categorySignals.leftovers || meal.categorySignals.protein) {
    tags.push({ label: "Smart valg", tone: "neutral" });
  }

  return tags.slice(0, 3);
};

const getMealReason = (meal: PlannedMeal) => {
  if (meal.categorySignals.budget && meal.categorySignals.vegetarian) {
    return "Holder prisen nede med mettende råvarer og lite svinn.";
  }

  if (meal.prepTimeMinutes <= 25) {
    return "Gir en rolig hverdagsmiddag når tiden er knapp.";
  }

  if (meal.categorySignals.protein && meal.categorySignals.leftovers) {
    return "Mye protein og rester som fungerer godt dagen etter.";
  }

  if (meal.categorySignals.premium) {
    return "Gir uken litt helgefølelse uten å velte budsjettet.";
  }

  if (meal.categorySignals.family) {
    return "Trygg familierett som deler råvarer med resten av uken.";
  }

  return "Valgt for å gi variasjon og god balanse i ukeplanen.";
};

const getMealAccentClass = (mealTag: PlannedMeal["mealTag"]) => {
  if (mealTag === "Premium") {
    return "border-l-[#8F7DFF]";
  }

  if (mealTag === "Protein") {
    return "border-l-[#FF7043]";
  }

  if (mealTag === "Vegetar") {
    return "border-l-[#43A047]";
  }

  return "border-l-[#44D07B]";
};

function MealHabitButton({
  active,
  icon,
  label,
  onClick
}: {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-1 rounded-lg border px-2 text-caption font-black transition",
        active
          ? "border-saving-border bg-saving-bg text-saving"
          : "border-border bg-surface text-text-tertiary shadow-app"
      )}
      onClick={onClick}
      type="button"
    >
      {icon}
      {label}
    </button>
  );
}
