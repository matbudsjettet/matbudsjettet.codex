import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { CalendarDays, ReceiptText, Wallet } from "lucide-react";
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
  const spentRatio = preference.weeklyBudgetNok > 0 ? plan.summary.weeklyTotalNok / preference.weeklyBudgetNok : 0;
  const remainingPercent = Math.max(0, Math.min(100, Math.round((1 - spentRatio) * 100)));
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
        remainingPercent={remainingPercent}
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
  remainingPercent,
  weeklyBudgetNok,
  perDayCostNok,
  storeName,
  weeklyTotalNok
}: {
  budgetDeltaNok: number;
  budgetIsOver: boolean;
  householdSize: number;
  remainingPercent: number;
  weeklyBudgetNok: number;
  perDayCostNok: number;
  storeName: string;
  weeklyTotalNok: number;
}) {
  const progressWidth = Math.max(10, Math.min(100, 100 - remainingPercent));
  const statusLabel = budgetIsOver ? "Du ligger over budsjettet" : "Du ligger under budsjettet!";
  const amountColorClass = budgetIsOver ? "text-[#eb6449]" : "text-[#2fc46e]";

  return (
    <div className="space-y-app-4">
      <Card className="overflow-hidden rounded-[30px] border-[#f1e8dc] bg-white px-4 pb-5 pt-4 shadow-[0_14px_34px_rgba(42,31,16,0.08)] sm:px-5" variant="quiet">
        <div className="grid grid-cols-[minmax(0,1fr)_128px] items-start gap-3">
          <div className="min-w-0 pt-1">
            <p className="text-[1.05rem] font-black text-text-primary">Du har</p>
            <p className={cn("mt-3 text-[4rem] font-black leading-[0.95] tracking-tight", amountColorClass)}>
              <AnimatedNumber className={amountColorClass} pulse={false} value={budgetDeltaNok} /> kr
            </p>
            <p className="mt-3 text-[1.15rem] font-bold text-text-secondary">igjen av matbudsjettet</p>
          </div>
          <BudgetIllustration />
        </div>

        <div className="mt-4 inline-flex items-center rounded-full bg-[#e7f7ea] px-3 py-2 text-[0.95rem] font-black text-[#2cad61]">
          <span aria-hidden="true" className="mr-2 text-base leading-none">
            {budgetIsOver ? "!" : "🎉"}
          </span>
          {statusLabel}
        </div>

        <div className="mt-5 flex items-center gap-3">
          <div className="h-4 flex-1 overflow-hidden rounded-full bg-[#f2efe8]">
            <div
              className="h-full rounded-full"
              style={{
                width: `${progressWidth}%`,
                background: "linear-gradient(90deg, #2fc46e 0%, #7cd54c 28%, #ffcf2b 60%, #ff982f 100%)"
              }}
            />
          </div>
          <span className="text-[1.05rem] font-black text-[#2fc46e]">{remainingPercent} %</span>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 text-[0.98rem] font-semibold text-text-tertiary">
          <p>Du har brukt {formatCompactNok(weeklyTotalNok)} av {formatCompactNok(weeklyBudgetNok)}</p>
          <p className="shrink-0 text-right">
            {householdSize} {householdSize === 1 ? "person" : "personer"} · {storeName}
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        <StatCard icon={<Wallet size={18} strokeWidth={2.2} />} iconClassName="bg-[#e5f7ea] text-[#28b765]" label="Budsjett" value={formatCompactNok(weeklyBudgetNok)} />
        <StatCard
          icon={<ReceiptText size={18} strokeWidth={2.2} />}
          iconClassName="bg-[#e8f3ff] text-[#2891ff]"
          label="Brukt så langt"
          value={formatCompactNok(weeklyTotalNok)}
        />
        <StatCard
          icon={<CalendarDays size={18} strokeWidth={2.2} />}
          iconClassName="bg-[#fff0df] text-[#ff9f2f]"
          label="Per dag"
          value={formatCompactNok(perDayCostNok)}
        />
      </div>
    </div>
  );
}

function StatCard({
  icon,
  iconClassName,
  label,
  value
}: {
  icon: ReactNode;
  iconClassName: string;
  label: string;
  value: string;
}) {
  return (
    <Card className="rounded-[24px] border-[#f1e8dc] bg-white p-4 shadow-[0_12px_28px_rgba(42,31,16,0.07)]" variant="quiet">
      <div className={cn("grid h-12 w-12 place-items-center rounded-full", iconClassName)}>{icon}</div>
      <p className="mt-6 text-[0.92rem] font-bold leading-snug text-text-secondary">{label}</p>
      <p className="mt-2 text-[1.35rem] font-black leading-tight text-text-primary">{value}</p>
    </Card>
  );
}

function BudgetIllustration() {
  return (
    <div className="relative flex h-[152px] w-full items-center justify-center self-center">
      <div className="absolute inset-x-1 bottom-4 top-5 rounded-full bg-[radial-gradient(circle_at_30%_40%,rgba(225,247,233,0.95),rgba(225,247,233,0.78)_58%,rgba(225,247,233,0)_76%)]" />
      <div className="absolute -right-1 top-6 h-20 w-20 rounded-full bg-[radial-gradient(circle,rgba(255,230,195,0.85),rgba(255,230,195,0.08)_72%)]" />
      <span className="absolute left-3 top-4 text-xs text-[#2fc46e]">✦</span>
      <span className="absolute right-6 top-1 text-sm text-[#2fc46e]">✦</span>
      <span className="absolute right-4 top-12 text-xs text-[#2fc46e]">✦</span>
      <div className="relative h-[92px] w-[116px] rounded-b-[999px] rounded-t-[48px] bg-[linear-gradient(180deg,#fff6e5_0%,#f6e4c1_70%,#e0bb87_100%)] shadow-[inset_0_-10px_18px_rgba(189,139,78,0.18),0_18px_24px_rgba(178,140,90,0.24)]">
        <div className="absolute left-2 top-[-34px] text-[2.8rem]">🥦</div>
        <div className="absolute left-[36px] top-[-24px] text-[2.6rem]">🫑</div>
        <div className="absolute right-[8px] top-[-20px] text-[2.4rem]">🥒</div>
      </div>
      <div className="absolute bottom-3 h-3 w-24 rounded-full bg-[#eae3d8]" />
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
