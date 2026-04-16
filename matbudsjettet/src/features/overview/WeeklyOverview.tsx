import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Card } from "@/components/ui/Card";
import { sectionVariants, pageTransition } from "@/lib/design/animations";
import { formatCompactNok } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { BudgetPreference, WeeklyPlan } from "@/types/domain";
import { stores } from "@/lib/data/stores";

type WeeklyOverviewProps = {
  onAction: (action: "meals" | "shopping" | "tips" | "swap") => void;
  plan: WeeklyPlan;
  preference: BudgetPreference;
};

export function WeeklyOverview({ onAction, plan, preference }: WeeklyOverviewProps) {
  const { budgetComparison } = plan.summary;
  const budgetIsOver = budgetComparison.status === "over";
  const budgetDeltaNok = Math.abs(budgetComparison.differenceNok);
  const store = stores.find((item) => item.id === preference.preferredStore);

  return (
    <motion.section
      animate="animate"
      className="relative space-y-app-10"
      initial="initial"
      transition={pageTransition}
      variants={sectionVariants}
    >
      <WeeklyHeroCard
        budgetDeltaNok={budgetDeltaNok}
        budgetIsOver={budgetIsOver}
        householdSize={preference.householdSize}
        weeklyBudgetNok={preference.weeklyBudgetNok}
        perDayCostNok={plan.summary.perDayCostNok}
        storeName={store?.name ?? preference.preferredStore}
        weeklyTotalNok={plan.summary.weeklyTotalNok}
      />

      <Card className="p-app-5" variant="surface">
        <h3 className="text-headline text-text-primary">Dette spiser dere denne uka</h3>
        <p className="mt-app-2 text-body-sm text-text-secondary">En enkel og rimelig ukeplan for familien.</p>
        <ul className="mt-app-5 space-y-app-2">
          {plan.meals.map((meal) => (
            <li className="flex items-center gap-app-3 rounded-xl bg-bg-elevated px-app-4 py-app-3 text-body-sm font-semibold text-text-primary" key={meal.id}>
              <span className="text-base leading-none">{getMealIndicator(meal.mealTag)}</span>
              <span>{meal.name}</span>
            </li>
          ))}
        </ul>
      </Card>

      <div className="grid grid-cols-4 gap-app-2 rounded-[22px] bg-bg-elevated p-1.5">
        <QuickActionButton onClick={() => onAction("meals")}>Ukeplan</QuickActionButton>
        <QuickActionButton onClick={() => onAction("shopping")}>Handleliste</QuickActionButton>
        <QuickActionButton onClick={() => onAction("tips")}>Spartips</QuickActionButton>
        <QuickActionButton onClick={() => onAction("swap")}>Bytt rett</QuickActionButton>
      </div>
    </motion.section>
  );
}

function WeeklyHeroCard({
  budgetDeltaNok,
  budgetIsOver,
  householdSize,
  weeklyBudgetNok,
  perDayCostNok,
  storeName,
  weeklyTotalNok
}: {
  budgetDeltaNok: number;
  budgetIsOver: boolean;
  householdSize: number;
  weeklyBudgetNok: number;
  perDayCostNok: number;
  storeName: string;
  weeklyTotalNok: number;
}) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/15 bg-[linear-gradient(135deg,#0B1020_0%,#111A33_55%,#0A1730_100%)] p-app-6 text-white shadow-app">
      <div className="relative">
        <p className="text-caption uppercase tracking-[0.08em] text-white/65">Denne uken</p>
        <p className="mt-app-4 text-body-sm font-semibold text-white/72">
          {budgetIsOver ? "Planen ligger over valgt budsjett" : "Under budsjett denne uken"}
        </p>
        <p className={cn("mt-app-1 text-[2.7rem] font-black leading-none tracking-tight", budgetIsOver ? "text-danger" : "text-saving")}>
          <AnimatedNumber className={budgetIsOver ? "text-danger" : "text-saving"} pulse={false} value={budgetDeltaNok} />
        </p>
        <p className="mt-app-2 text-body-sm text-white/72">
          Planlagt: {formatCompactNok(weeklyTotalNok)} av {formatCompactNok(weeklyBudgetNok)} budsjett
        </p>

        <div className="mt-app-6 rounded-2xl border border-white/15 bg-white/[0.06] p-app-5">
          <div className="grid grid-cols-2 gap-x-app-4 gap-y-app-5">
            <div>
              <p className="text-caption text-white/65">Vanlig budsjett</p>
              <p className="mt-app-1 text-headline text-white">{formatCompactNok(weeklyBudgetNok)}</p>
            </div>
            <div>
              <p className="text-caption text-white/65">Planlagt</p>
              <p className="mt-app-1 text-headline text-white">{formatCompactNok(weeklyTotalNok)}</p>
            </div>
          </div>

          <div className="mt-app-5 flex items-center justify-between gap-app-4 border-t border-white/10 pt-app-4">
            <div>
              <p className="text-caption text-white/65">Per dag</p>
              <p className="mt-app-1 text-body-sm font-black text-white">{formatCompactNok(perDayCostNok)}</p>
            </div>
            <p className="text-right text-caption text-white/65">
              {householdSize} {householdSize === 1 ? "person" : "personer"} · {storeName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickActionButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      className="min-h-[46px] rounded-[18px] px-app-2 text-caption font-black text-text-secondary transition-[background-color,color,opacity] duration-200 hover:bg-surface hover:text-text-primary hover:opacity-95"
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

const getMealIndicator = (mealTag: WeeklyPlan["meals"][number]["mealTag"]) => {
  if (mealTag === "Premium") {
    return "🐟";
  }

  if (mealTag === "Protein") {
    return "🍗";
  }

  if (mealTag === "Vegetar") {
    return "🥦";
  }

  return "🥘";
};
