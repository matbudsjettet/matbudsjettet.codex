import { motion } from "framer-motion";
import { ChevronRight, Clock3, Flame, TrendingDown, Leaf } from "lucide-react";
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
import { pageTransition, sectionVariants } from "@/lib/design/animations";
import { formatCompactNok } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { BudgetPreference, PlannedMeal, WeeklyPlan } from "@/types/domain";

const plan_per_day = (weeklyNok: number) => Math.round(weeklyNok / 7);

const mealImages = [mealImage1, mealImage2, mealImage3, mealImage4, mealImage5, mealImage6, mealImage7, mealImage8, mealImage9, mealImage10];
const weekdays = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];

type Props = {
  onAction: (action: "meals" | "shopping" | "tips" | "swap") => void;
  plan: WeeklyPlan;
  preference: BudgetPreference;
};

export function WeeklyOverview({ onAction, plan, preference }: Props) {
  const { budgetComparison } = plan.summary;
  const budgetIsOver = budgetComparison.status === "over";
  const spentNok = plan.summary.weeklyTotalNok;
  const budgetNok = preference.weeklyBudgetNok;
  const savedNok = Math.max(0, budgetNok - spentNok);
  const progressPct = Math.min(100, Math.round((spentNok / budgetNok) * 100));
  const remainingPct = 100 - progressPct;
  const todayMeal = plan.meals[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1] ?? plan.meals[0];

  return (
    <motion.div
      animate="animate"
      className="space-y-5"
      initial="initial"
      transition={pageTransition}
      variants={sectionVariants}
    >
      {/* Greeting */}
      <div>
        <h2 className="text-[1.45rem] font-black tracking-tight text-text-primary">God kveld! 👋</h2>
        <p className="mt-0.5 text-[0.875rem] font-medium text-text-tertiary">Her er planen for uken din</p>
      </div>

      {/* Budget card */}
      <BudgetHeroCard
        budgetIsOver={budgetIsOver}
        budgetNok={budgetNok}
        progressPct={progressPct}
        remainingPct={remainingPct}
        savedNok={savedNok}
        spentNok={spentNok}
      />

      {/* Meal rail */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.1em] text-text-tertiary">Denne uken</p>
            <h3 className="mt-0.5 text-[1.05rem] font-black tracking-tight text-text-primary">
              {plan.meals.length} av 7 middager planlagt
            </h3>
          </div>
          <button
            className="flex items-center gap-1 rounded-full bg-surface-soft px-3.5 py-2 text-[0.78rem] font-bold text-text-secondary transition-colors hover:bg-surface-soft active:opacity-80"
            onClick={() => onAction("meals")}
            type="button"
          >
            Se ukeplan <ChevronRight size={14} strokeWidth={2.5} />
          </button>
        </div>

        {/* Horizontal scroll */}
        <div className="-mx-5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-3 pr-10">
            {plan.meals.map((meal, i) => (
              <MealRailCard
                key={meal.id}
                meal={meal}
                index={i}
                onClick={() => onAction("meals")}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Today feature card */}
      {todayMeal && (
        <TodayMealCard meal={todayMeal} index={plan.meals.indexOf(todayMeal)} onClick={() => onAction("meals")} />
      )}

      {/* Achievement card */}
      <AchievementCard savedNok={savedNok} budgetIsOver={budgetIsOver} onTips={() => onAction("tips")} />
    </motion.div>
  );
}

function BudgetHeroCard({ budgetIsOver, budgetNok, progressPct, remainingPct, savedNok, spentNok }: {
  budgetIsOver: boolean; budgetNok: number; progressPct: number; remainingPct: number; savedNok: number; spentNok: number;
}) {
  return (
    <div className="rounded-2xl bg-surface border border-border shadow-card overflow-hidden">
      <div className="px-5 pt-5 pb-4">
        <p className="text-[0.78rem] font-semibold text-text-tertiary">Ditt budsjett</p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className={cn("text-[2.2rem] font-black tracking-tight leading-none", budgetIsOver ? "text-danger" : "text-text-primary")}>
            {formatCompactNok(budgetIsOver ? spentNok : savedNok)}
          </span>
          <span className="text-[0.9rem] font-medium text-text-tertiary">
            {budgetIsOver ? "brukt av" : "igjen av"} {formatCompactNok(budgetNok)}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-3.5 h-2 rounded-full bg-surface-soft overflow-hidden">
          <motion.div
            animate={{ width: `${progressPct}%` }}
            className={cn("h-full rounded-full", budgetIsOver ? "bg-danger" : "bg-brand")}
            initial={{ width: "0%" }}
            transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
          />
        </div>
        <div className="mt-1.5 flex justify-between">
          <span className="text-[0.72rem] font-semibold text-text-tertiary">{formatCompactNok(spentNok)} brukt</span>
          <span className={cn("text-[0.72rem] font-bold", budgetIsOver ? "text-danger" : "text-brand")}>
            {remainingPct}% igjen
          </span>
        </div>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-3 border-t border-border-subtle">
        {[
          { label: "Per dag", value: formatCompactNok(plan_per_day(spentNok)) },
          { label: "Varer igjen", value: "—" },
          { label: "Spart", value: formatCompactNok(savedNok) },
        ].map((stat, i) => (
          <div key={stat.label} className={cn("py-3 px-4 text-center", i > 0 ? "border-l border-border-subtle" : "")}>
            <p className="text-[0.68rem] font-semibold text-text-tertiary">{stat.label}</p>
            <p className={cn("mt-0.5 text-[0.88rem] font-black text-text-primary", stat.label === "Spart" && !budgetIsOver ? "text-brand" : "")}>{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


function MealRailCard({ meal, index, onClick }: { meal: PlannedMeal; index: number; onClick: () => void }) {
  const img = mealImages[index % mealImages.length];
  const day = weekdays[index] ?? `Dag ${index + 1}`;

  return (
    <button
      className="w-[128px] shrink-0 overflow-hidden rounded-2xl bg-white shadow-card text-left transition-transform duration-150 active:scale-95"
      onClick={onClick}
      type="button"
    >
      {/* Image */}
      <div className="relative h-[112px] overflow-hidden bg-surface-soft">
        <img alt={meal.name} className="h-full w-full object-cover" src={img} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {/* Day pill */}
        <div className="absolute left-2 top-2">
          <span className="rounded-lg bg-black/50 px-2 py-1 text-[0.62rem] font-bold text-white backdrop-blur-sm">
            {day}
          </span>
        </div>
        {/* Time pill */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1">
          <Clock3 size={10} className="text-white/90" />
          <span className="text-[0.62rem] font-semibold text-white/90">{meal.prepTimeMinutes} min</span>
        </div>
      </div>
      {/* Text */}
      <div className="px-2.5 py-2.5">
        <p className="line-clamp-2 text-[0.78rem] font-bold leading-snug text-text-primary">{meal.name}</p>
        {meal.categorySignals.budget && (
          <div className="mt-1.5 flex items-center gap-1">
            <TrendingDown size={10} className="text-brand" />
            <span className="text-[0.65rem] font-semibold text-brand">Billig</span>
          </div>
        )}
      </div>
    </button>
  );
}

function TodayMealCard({ meal, index, onClick }: { meal: PlannedMeal; index: number; onClick: () => void }) {
  const img = mealImages[index % mealImages.length];

  return (
    <button
      className="w-full overflow-hidden rounded-2xl bg-white shadow-card text-left transition-transform duration-150 active:scale-[0.99]"
      onClick={onClick}
      type="button"
    >
      <div className="relative h-[180px] overflow-hidden bg-surface-soft">
        <img alt={meal.name} className="h-full w-full object-cover" src={img} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute left-3 top-3">
          <span className="rounded-xl bg-black/40 px-3 py-1.5 text-[0.72rem] font-bold text-white backdrop-blur-sm">
            Dagens middag
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            <p className="text-[1.05rem] font-black text-white leading-snug">{meal.name}</p>
            <div className="mt-1 flex items-center gap-3">
              <span className="flex items-center gap-1 text-[0.72rem] text-white/90">
                <Clock3 size={12} />{meal.prepTimeMinutes} min
              </span>
              {meal.categorySignals.vegetarian && (
                <span className="flex items-center gap-1 text-[0.72rem] text-white/90">
                  <Leaf size={12} /> Vegetar
                </span>
              )}
              {meal.categorySignals.protein && (
                <span className="flex items-center gap-1 text-[0.72rem] text-white/90">
                  <Flame size={12} /> Protein
                </span>
              )}
            </div>
          </div>
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/90">
            <ChevronRight size={16} className="text-text-primary" strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </button>
  );
}

function AchievementCard({ savedNok, budgetIsOver, onTips }: { savedNok: number; budgetIsOver: boolean; onTips: () => void }) {
  if (budgetIsOver) {
    return (
      <button
        className="w-full rounded-2xl bg-[#FFF4EC] border border-[#FBDBB8] p-4 text-left transition-opacity active:opacity-80"
        onClick={onTips}
        type="button"
      >
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#FEE3CC] text-[#B45309] text-xl">⚠️</div>
          <div className="flex-1 min-w-0">
            <p className="text-[0.88rem] font-black text-text-primary">Over budsjettet denne uken</p>
            <p className="mt-0.5 text-[0.78rem] text-text-secondary">Se spartips for å komme tilbake på sporet</p>
          </div>
          <ChevronRight size={16} className="text-text-tertiary shrink-0" />
        </div>
      </button>
    );
  }

  return (
    <button
      className="w-full rounded-2xl bg-[#EBF5EF] border border-saving-border p-4 text-left transition-opacity active:opacity-80"
      onClick={onTips}
      type="button"
    >
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-xl shadow-sm">🌱</div>
        <div className="flex-1 min-w-0">
          <p className="text-[0.88rem] font-black text-text-primary">Du sparer godt!</p>
          <p className="mt-0.5 text-[0.78rem] text-text-secondary">
            Du har spart {formatCompactNok(savedNok)} så langt denne uken
          </p>
        </div>
        <ChevronRight size={16} className="text-brand shrink-0" />
      </div>
    </button>
  );
}
