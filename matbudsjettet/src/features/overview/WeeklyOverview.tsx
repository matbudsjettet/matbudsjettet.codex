import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
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

import type { BudgetPreference, WeeklyPlan } from "@/types/domain";
import { formatCompactNok } from "@/lib/utils/format";

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

export function WeeklyOverview({
  plan,
  preference,
  onAction
}: {
  plan: WeeklyPlan;
  preference: BudgetPreference;
  onAction: (action: "meals" | "shopping" | "tips" | "swap") => void;
}) {
  const spent = plan.summary.weeklyTotalNok;
  const budget = preference.weeklyBudgetNok;
  const remaining = Math.max(0, budget - spent);
  const percent = Math.round((remaining / budget) * 100);

  return (
    <motion.div className="space-y-6">

      {/* HEADER */}
      <div className="px-1">
        <h1 className="text-[1.6rem] font-black">Hei, Andreas 👋</h1>
        <p className="text-[0.9rem] text-gray-500">
          Du sparer bra denne uka
        </p>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white rounded-3xl p-5 shadow-sm">
        <p className="text-sm text-gray-500">Du har</p>

        <h2 className="text-4xl font-black text-green-600 mt-1">
          {remaining} kr
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          igjen av matbudsjettet
        </p>

        <div className="mt-4 bg-gray-100 h-3 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 via-yellow-400 to-orange-400"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>{formatCompactNok(spent)} brukt</span>
          <span>{percent}% igjen</span>
        </div>
      </div>

      {/* MEALS */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-lg">Denne uka</h3>

          <button
            onClick={() => onAction("meals")}
            className="text-sm text-gray-500 flex items-center gap-1"
          >
            Se hele
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2">
          {plan.meals.map((meal, i) => (
            <div
              key={meal.id}
              className="min-w-[140px] bg-white rounded-2xl overflow-hidden shadow-sm"
            >
              <img
                src={mealImages[i % mealImages.length]}
                className="w-full h-[120px] object-cover"
              />

              <div className="p-2">
                <p className="text-sm font-semibold line-clamp-2">
                  {meal.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SUCCESS */}
      <div className="bg-green-50 rounded-2xl p-4 flex justify-between items-center">
        <div>
          <p className="font-bold text-sm">Flott jobba! 🎉</p>
          <p className="text-xs text-gray-500">
            Du har spart {remaining} kr
          </p>
        </div>

        <div className="text-2xl">🌱</div>
      </div>

    </motion.div>
  );
}
