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
      <Card className="overflow-hidden rounded-[30px] border-0 bg-white px-6 pb-7 pt-7 shadow-[0_18px_42px_rgba(42,31,16,0.07)] sm:px-7" variant="quiet">
        <div className="grid grid-cols-[minmax(0,1fr)_138px] items-start gap-7">
          <div className="min-w-0 pt-1.5">
            <p className="text-[1.05rem] font-black text-text-primary">Du har</p>
            <p className={cn("mt-5 whitespace-nowrap text-[4rem] font-black leading-[0.95] tracking-tight", amountColorClass)}>
              <AnimatedNumber className={amountColorClass} pulse={false} value={budgetDeltaNok} /> kr
            </p>
            <p className="mt-5 text-[1.15rem] font-semibold text-[#7d776e]">igjen av matbudsjettet</p>
          </div>
          <BudgetIllustration />
        </div>

        <div className="mt-7 inline-flex items-center rounded-full bg-[#e7f7ea] px-3.5 py-2 text-[0.95rem] font-black text-[#2cad61]">
          <span aria-hidden="true" className="mr-2 text-base leading-none">
            {budgetIsOver ? "!" : "🎉"}
          </span>
          {statusLabel}
        </div>

        <div className="mt-7 flex items-center gap-3">
          <div className="h-4 flex-1 overflow-hidden rounded-full bg-[#f2efe8]">
            <div
              className="h-full rounded-full"
              style={{
                width: `${progressWidth}%`,
                background: "linear-gradient(90deg, #2fc46e 0%, #7cd54c 28%, #ffcf2b 60%, #ff982f 100%)"
              }}
            />
          </div>
          <span className="min-w-[3.25rem] text-right text-[1.05rem] font-black leading-none text-[#2fc46e]">{remainingPercent} %</span>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 text-[0.98rem] font-medium text-[#8b857b]">
          <p>Du har brukt {formatCompactNok(weeklyTotalNok)} av {formatCompactNok(weeklyBudgetNok)}</p>
          <p className="shrink-0 text-right font-medium text-[#8b857b]">
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
    <Card className="rounded-[26px] border-0 bg-white px-[1.15rem] pb-[1.15rem] pt-[1.2rem] shadow-[0_10px_26px_rgba(42,31,16,0.055)]" variant="quiet">
      <div className={cn("grid h-12 w-12 place-items-center rounded-full", iconClassName)}>{icon}</div>
      <p className="mt-6 text-[0.92rem] font-semibold leading-snug text-[#736d65]">{label}</p>
      <p className="mt-2.5 whitespace-nowrap text-[1.35rem] font-black leading-tight text-text-primary">{value}</p>
    </Card>
  );
}

function BudgetIllustration() {
  return (
    <div className="relative flex h-[168px] w-full items-center justify-center self-center pr-1">
      <div className="absolute inset-x-0 bottom-0 top-2 rounded-full bg-[radial-gradient(circle_at_42%_38%,rgba(231,247,236,0.92),rgba(231,247,236,0.52)_56%,rgba(231,247,236,0)_76%)] blur-[0.5px]" />
      <div className="absolute right-2 top-6 h-[88px] w-[88px] rounded-full bg-[radial-gradient(circle,rgba(255,238,215,0.8),rgba(255,238,215,0.08)_70%)]" />
      <span className="absolute left-5 top-9 h-2 w-2 rounded-full bg-[#49cd75]/80 shadow-[0_0_10px_rgba(73,205,117,0.2)]" />
      <span className="absolute right-7 top-5 h-2.5 w-2.5 rounded-full bg-[#49cd75]/80 shadow-[0_0_10px_rgba(73,205,117,0.2)]" />
      <span className="absolute right-3 top-[4.55rem] h-2 w-2 rounded-full bg-[#49cd75]/80 shadow-[0_0_10px_rgba(73,205,117,0.2)]" />
      <div className="absolute bottom-3 h-4 w-28 rounded-full bg-[radial-gradient(circle,rgba(188,171,144,0.26),rgba(188,171,144,0.04)_72%)] blur-[2px]" />
      <div className="relative h-[98px] w-[120px] rounded-b-[999px] rounded-t-[44px] bg-[linear-gradient(180deg,#fffaf1_0%,#f6e4c4_64%,#ddb27a_100%)] shadow-[inset_0_-10px_20px_rgba(182,135,76,0.16),0_16px_24px_rgba(193,158,110,0.22)]">
        <div className="absolute inset-x-[10px] top-[9px] h-[10px] rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.7),rgba(255,255,255,0.08))]" />
        <div className="absolute left-[2px] top-[-18px] h-[54px] w-[36px] rounded-[999px_999px_18px_18px] bg-[linear-gradient(180deg,#56c85f_0%,#2e8e3d_65%,#227334_100%)] rotate-[-14deg] shadow-[inset_0_-7px_10px_rgba(0,0,0,0.11),0_6px_10px_rgba(69,151,92,0.18)] blur-[0.2px]" />
        <div className="absolute left-[16px] top-[-34px] h-[64px] w-[44px] rounded-[999px_999px_22px_22px] bg-[linear-gradient(180deg,#68cf67_0%,#38a248_58%,#2d883d_100%)] rotate-[7deg] shadow-[inset_0_-8px_12px_rgba(0,0,0,0.12),0_8px_14px_rgba(83,174,106,0.16)] blur-[0.2px]" />
        <div className="absolute left-[42px] top-[-18px] h-[50px] w-[34px] rounded-full bg-[radial-gradient(circle_at_35%_28%,#ff8a74_0%,#f4513b_42%,#c52d22_100%)] shadow-[inset_0_-8px_10px_rgba(0,0,0,0.1),0_7px_12px_rgba(215,93,75,0.18)]" />
        <div className="absolute left-[52px] top-[-25px] h-4 w-1.5 rounded-full bg-[linear-gradient(180deg,#3ca14c_0%,#247737_100%)]" />
        <div className="absolute right-[11px] top-[-15px] h-[49px] w-[34px] rounded-[18px_18px_21px_21px] bg-[radial-gradient(circle_at_35%_28%,#ffe07b_0%,#ffbc33_48%,#ed9324_100%)] shadow-[inset_0_-8px_10px_rgba(0,0,0,0.09),0_7px_12px_rgba(239,172,62,0.16)]" />
        <div className="absolute right-[21px] top-[-21px] h-4 w-1.5 rounded-full bg-[linear-gradient(180deg,#40a64f_0%,#28803a_100%)]" />
        <div className="absolute right-0 top-[-12px] h-[58px] w-[28px] rounded-[999px_999px_20px_20px] bg-[linear-gradient(180deg,#67b86f_0%,#468f4f_52%,#2f6f38_100%)] rotate-[22deg] shadow-[inset_0_-8px_12px_rgba(0,0,0,0.12),0_6px_10px_rgba(88,151,95,0.15)] blur-[0.15px]" />
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
