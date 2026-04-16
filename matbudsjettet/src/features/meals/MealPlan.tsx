python3 << 'PYEOF'
import os

def write(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write(content)
    print(f"wrote {path}")

MEALPLAN = r'''import { Clock3, Heart, RotateCcw, ThumbsDown, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { pageTransition, sectionVariants } from "@/lib/design/animations";
import { formatCompactNok } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { PlannedMeal, UserMealPreferences } from "@/types/domain";
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
const weekdays = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];

function getWeekNumber() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const w = new Date(d.getFullYear(), 0, 4);
  return 1 + Math.round(((d.getTime() - w.getTime()) / 86400000 - 3 + ((w.getDay() + 6) % 7)) / 7);
}

function getWeekRange() {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d: Date) => d.toLocaleDateString("nb-NO", { day: "numeric", month: "short" });
  return `${fmt(monday)} – ${fmt(sunday)}`;
}

type Props = {
  mealPreferences: UserMealPreferences;
  meals: PlannedMeal[];
  onOpenRecipe: (meal: PlannedMeal) => void;
  onSwapMeal: (meal: PlannedMeal) => void;
  onToggleDislikedMeal: (mealId: string) => void;
  onToggleFavoriteMeal: (mealId: string) => void;
  onToggleRepeatCheapMeal: (mealId: string) => void;
};

export function MealPlan({ mealPreferences, meals, onOpenRecipe, onSwapMeal, onToggleDislikedMeal, onToggleFavoriteMeal, onToggleRepeatCheapMeal }: Props) {
  const weekNumber = getWeekNumber();
  const weekRange = getWeekRange();
  const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

  return (
    <motion.div animate="animate" className="space-y-4" initial="initial" transition={pageTransition} variants={sectionVariants}>
      {/* Week header */}
      <div className="rounded-2xl bg-surface border border-border shadow-card px-4 py-3.5 flex items-center justify-between">
        <div>
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.1em] text-text-tertiary">Uke {weekNumber}</p>
          <p className="mt-0.5 text-[0.88rem] font-bold text-text-primary">{weekRange}</p>
        </div>
        <div className="text-[0.78rem] font-semibold text-text-tertiary">
          {meals.length} middager
        </div>
      </div>

      {/* Meal list */}
      <div className="rounded-2xl bg-surface border border-border shadow-card overflow-hidden">
        {meals.map((meal, index) => {
          const img = mealImages[index % mealImages.length];
          const day = weekdays[index] ?? `Dag ${index + 1}`;
          const isFavorite = mealPreferences.favoriteMealIds.includes(meal.id);
          const isToday = index === todayIndex;

          return (
            <div
              key={meal.id}
              className={cn(
                "group relative",
                index > 0 ? "border-t border-border-subtle" : "",
                isToday ? "bg-[#F2F9F5]" : ""
              )}
            >
              <button
                className="flex w-full items-center gap-3.5 px-4 py-3.5 text-left transition-colors hover:bg-bg-elevated active:bg-bg-elevated"
                onClick={() => onSwapMeal(meal)}
                type="button"
              >
                {/* Thumbnail */}
                <div className="h-[52px] w-[52px] shrink-0 overflow-hidden rounded-xl bg-surface-soft">
                  <img alt={meal.name} className="h-full w-full object-cover" src={img} />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[0.72rem] font-semibold text-text-tertiary">{day}</p>
                    {isToday && <span className="rounded-md bg-brand-light text-brand text-[0.62rem] font-bold px-1.5 py-0.5">I dag</span>}
                  </div>
                  <p className="mt-0.5 text-[0.9rem] font-bold text-text-primary leading-snug line-clamp-1">{meal.name}</p>
                  <div className="mt-1 flex items-center gap-3 text-[0.72rem] text-text-tertiary">
                    <span className="flex items-center gap-1"><Clock3 size={11} />{meal.prepTimeMinutes} min</span>
                    <span>{formatCompactNok(meal.totalPriceNok)}</span>
                  </div>
                </div>

                <ChevronRight size={16} strokeWidth={2} className="text-text-tertiary shrink-0" />
              </button>

              {/* Quick actions */}
              <div className="flex gap-2 px-4 pb-3 -mt-1">
                <QuickAction
                  active={isFavorite}
                  icon={<Heart size={13} strokeWidth={2} />}
                  label="Favoritt"
                  onClick={() => onToggleFavoriteMeal(meal.id)}
                />
                <QuickAction
                  active={false}
                  icon={<RotateCcw size={13} strokeWidth={2} />}
                  label="Gjenta"
                  onClick={() => onToggleRepeatCheapMeal(meal.id)}
                />
                <QuickAction
                  active={mealPreferences.dislikedMealIds.includes(meal.id)}
                  icon={<ThumbsDown size={13} strokeWidth={2} />}
                  label="Ikke ofte"
                  onClick={() => onToggleDislikedMeal(meal.id)}
                />
                <button
                  className="ml-auto text-[0.72rem] font-semibold text-text-tertiary underline-offset-2 hover:underline"
                  onClick={() => onOpenRecipe(meal)}
                  type="button"
                >
                  Se oppskrift
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function QuickAction({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      className={cn(
        "flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[0.7rem] font-semibold transition-all",
        active ? "bg-saving-bg text-saving" : "bg-surface-soft text-text-tertiary hover:text-text-secondary"
      )}
      onClick={onClick}
      type="button"
    >
      {icon}{label}
    </button>
  );
}
'''

write("/home/claude/app/src/features/meals/MealPlan.tsx", MEALPLAN)
print("MealPlan written")
PYEOF