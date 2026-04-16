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
    <motion.section animate="animate" className="relative space-y-11" initial="initial" transition={pageTransition} variants={sectionVariants}>
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
    <div className="space-y-4">
      <Card className="overflow-hidden rounded-[30px] border-0 bg-white px-5 pb-6 pt-6 shadow-[0_16px_40px_rgba(42,31,16,0.08)] sm:px-6" variant="quiet">
        <div className="grid grid-cols-[minmax(0,1fr)_132px] items-start gap-5">
          <div className="min-w-0 pt-1">
            <p className="text-[1.05rem] font-black text-text-primary">Du har</p>
            <p className={cn("mt-4 whitespace-nowrap text-[4rem] font-black leading-[0.95] tracking-tight", amountColorClass)}>
              <AnimatedNumber className={amountColorClass} pulse={false} value={budgetDeltaNok} /> kr
            </p>
            <p className="mt-4 text-[1.15rem] font-bold text-text-secondary">igjen av matbudsjettet</p>
          </div>
          <BudgetIllustration />
        </div>

        <div className="mt-6 inline-flex items-center rounded-full bg-[#e7f7ea] px-3.5 py-2 text-[0.95rem] font-black text-[#2cad61]">
          <span aria-hidden="true" className="mr-2 text-base leading-none">
            {budgetIsOver ? "!" : "🎉"}
          </span>
          {statusLabel}
        </div>

        <div className="mt-6 flex items-center gap-3">
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

        <div className="mt-4 flex items-center justify-between gap-3 text-[0.98rem] font-semibold text-text-tertiary">
          <p>Du har brukt {formatCompactNok(weeklyTotalNok)} av {formatCompactNok(weeklyBudgetNok)}</p>
          <p className="shrink-0 text-right">
            {householdSize} {householdSize === 1 ? "person" : "personer"} · {storeName}
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-3.5">
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
    <Card className="rounded-[24px] border-[#f3ecdf] bg-white px-4 pb-4 pt-[1.05rem] shadow-[0_12px_28px_rgba(42,31,16,0.07)]" variant="quiet">
      <div className={cn("grid h-12 w-12 place-items-center rounded-full", iconClassName)}>{icon}</div>
      <p className="mt-5 text-[0.92rem] font-bold leading-snug text-text-secondary">{label}</p>
      <p className="mt-2.5 whitespace-nowrap text-[1.35rem] font-black leading-tight text-text-primary">{value}</p>
    </Card>
  );
}

function BudgetIllustration() {
  return (
    <div className="relative flex h-[160px] w-full items-center justify-center self-center">
      <div className="absolute inset-x-0 bottom-2 top-3 rounded-full bg-[radial-gradient(circle_at_40%_38%,rgba(227,246,233,0.9),rgba(227,246,233,0.58)_55%,rgba(227,246,233,0)_74%)]" />
      <div className="absolute right-1 top-5 h-20 w-20 rounded-full bg-[radial-gradient(circle,rgba(255,232,205,0.8),rgba(255,232,205,0.06)_72%)]" />
      <span className="absolute left-4 top-8 h-2 w-2 rounded-full bg-[#39c96f]" />
      <span className="absolute right-6 top-4 h-2.5 w-2.5 rounded-full bg-[#39c96f]" />
      <span className="absolute right-3 top-[4.3rem] h-2 w-2 rounded-full bg-[#39c96f]" />
      <div className="relative h-[96px] w-[118px] rounded-b-[999px] rounded-t-[42px] bg-[linear-gradient(180deg,#fff9ef_0%,#f7e6c6_68%,#deb57e_100%)] shadow-[inset_0_-8px_18px_rgba(188,140,80,0.18),0_18px_28px_rgba(194,155,103,0.24)]">
        <div className="absolute left-1 top-[-18px] h-[54px] w-[36px] rounded-[999px_999px_16px_16px] bg-[linear-gradient(180deg,#43b451_0%,#1f8433_100%)] rotate-[-16deg] shadow-[inset_0_-6px_8px_rgba(0,0,0,0.12)]" />
        <div className="absolute left-[14px] top-[-32px] h-[62px] w-[42px] rounded-[999px_999px_20px_20px] bg-[linear-gradient(180deg,#56be55_0%,#2e8d3b_100%)] rotate-[8deg] shadow-[inset_0_-8px_10px_rgba(0,0,0,0.12)]" />
        <div className="absolute left-[38px] top-[-18px] h-[50px] w-[34px] rounded-full bg-[linear-gradient(180deg,#f4513b_0%,#c73024_100%)] shadow-[inset_0_-8px_10px_rgba(0,0,0,0.12)]" />
        <div className="absolute left-[49px] top-[-25px] h-4 w-1.5 rounded-full bg-[#2e8d3b]" />
        <div className="absolute right-[10px] top-[-16px] h-[48px] w-[34px] rounded-[18px_18px_20px_20px] bg-[linear-gradient(180deg,#ffca48_0%,#f39a26_100%)] shadow-[inset_0_-8px_10px_rgba(0,0,0,0.11)]" />
        <div className="absolute right-[20px] top-[-22px] h-4 w-1.5 rounded-full bg-[#2f9a44]" />
        <div className="absolute right-0 top-[-12px] h-[58px] w-[28px] rounded-[999px_999px_20px_20px] bg-[linear-gradient(180deg,#4e9e58_0%,#2f6f38_100%)] rotate-[22deg] shadow-[inset_0_-8px_12px_rgba(0,0,0,0.14)]" />
      </div>
      <div className="absolute bottom-2 h-3 w-24 rounded-full bg-[#e8e0d4]" />
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
