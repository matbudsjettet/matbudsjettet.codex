import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { CalendarDays, ChevronRight, Heart, ReceiptText, TrendingUp, Wallet } from "lucide-react";
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
import veggieBowl from "../../../assets/veggie-bowl.png";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ingredients } from "@/lib/data/ingredients";
import { sectionVariants, pageTransition } from "@/lib/design/animations";
import { formatCompactNok } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { BudgetPreference, PlannedMeal, WeeklyPlan } from "@/types/domain";
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
  const savedSharePercent = preference.weeklyBudgetNok > 0 ? Math.max(0, Math.round((budgetDeltaNok / preference.weeklyBudgetNok) * 100)) : 0;
  const store = stores.find((item) => item.id === preference.preferredStore);

  return (
    <motion.section animate="animate" className="relative space-y-7" initial="initial" transition={pageTransition} variants={sectionVariants}>
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

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-[1.05rem] font-black tracking-tight text-text-primary">Denne uka 🍽️</h3>
          <button
            className="inline-flex items-center gap-1 rounded-full bg-[#f4f0e8] px-3.5 py-2 text-[0.8rem] font-semibold text-text-secondary transition hover:bg-[#efe9df]"
            onClick={() => onAction("meals")}
            type="button"
          >
            Se hele ukeplanen
            <ChevronRight size={15} strokeWidth={2.4} />
          </button>
        </div>

        <div className="relative -mx-app-5 overflow-x-auto px-app-5 pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex snap-x snap-proximity gap-2.5 pr-10">
            {plan.meals.map((meal, index) => (
              <MealRailCard key={meal.id} imageSrc={getMealPhoto(index)} meal={meal} weekdayLabel={getWeekdayLabel(index)} />
            ))}
          </div>
        </div>
      </section>

      <CelebrationBanner budgetDeltaNok={budgetDeltaNok} savedSharePercent={savedSharePercent} />

      <div className="mt-2 grid grid-cols-4 gap-app-2 rounded-[22px] bg-bg-elevated p-1.5">
        <QuickActionButton onClick={() => onAction("meals")}>Ukeplan</QuickActionButton>
        <QuickActionButton onClick={() => onAction("shopping")}>Handleliste</QuickActionButton>
        <QuickActionButton onClick={() => onAction("tips")}>Spartips</QuickActionButton>
        <QuickActionButton onClick={() => onAction("swap")}>Bytt rett</QuickActionButton>
      </div>
    </motion.section>
  );
}

function MealRailCard({ imageSrc, meal, weekdayLabel }: { imageSrc: string; meal: PlannedMeal; weekdayLabel: string }) {
  return (
    <Card className="w-[6.9rem] shrink-0 snap-start overflow-hidden rounded-[18px] border-0 bg-white p-0 shadow-[0_10px_22px_rgba(42,31,16,0.06)]" variant="quiet">
      <div className="relative h-[6.85rem] overflow-hidden bg-[#f6f0e6]">
        <img
          alt={meal.name}
          className="h-full w-full object-cover object-center brightness-[0.98] saturate-[0.96] contrast-[0.96]"
          loading="lazy"
          src={imageSrc}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,248,239,0.06),rgba(230,192,145,0.12))]" />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-2">
          <span className="rounded-full bg-[#ff9d2f] px-2 py-[0.28rem] text-[0.62rem] font-black text-white shadow-[0_6px_12px_rgba(255,157,47,0.24)]">
            {weekdayLabel}
          </span>
          <button
            aria-label={`Lagre ${meal.name} som favoritt`}
            className="grid h-6.5 w-6.5 place-items-center rounded-full bg-white/92 text-[#9a9488] shadow-[0_6px_14px_rgba(42,31,16,0.11)] backdrop-blur-sm"
            type="button"
          >
            <Heart size={12} strokeWidth={2.2} />
          </button>
        </div>
      </div>

      <div className="px-2.5 pb-2.5 pt-2">
        <h4 className="line-clamp-2 text-[0.84rem] font-black leading-[1.16] text-text-primary">{meal.name}</h4>
        <p className="mt-1 line-clamp-1 text-[0.72rem] font-medium leading-[1.2] text-[#7c766d]">{getMealSubtitle(meal)}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {getMealRailTags(meal).map((tag) => (
            <Badge key={tag.label} tone={tag.tone}>
              {tag.label}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
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
  const formatPlainNumber = (value: number) => value.toLocaleString("nb-NO", { maximumFractionDigits: 0 });

  return (
    <div className="space-y-3">
      <Card className="overflow-hidden rounded-[28px] border-0 bg-white px-5 pb-4.5 pt-4.5 shadow-[0_12px_30px_rgba(42,31,16,0.055)] sm:px-6" variant="quiet">
        <div className="grid grid-cols-[minmax(0,1fr)_132px] items-start gap-4">
          <div className="min-w-0 pt-0.5">
            <p className="text-[0.84rem] font-black text-text-primary">Du har</p>
            <p className={cn("mt-2.5 whitespace-nowrap text-[2.6rem] font-black leading-[0.98] tracking-tight", amountColorClass)}>
              <AnimatedNumber className={amountColorClass} formatter={formatPlainNumber} pulse={false} value={budgetDeltaNok} /> kr
            </p>
            <p className="mt-2.5 max-w-[11rem] text-[0.9rem] font-medium leading-[1.3] text-[#7d776e]">igjen av matbudsjettet</p>
          </div>
          <BudgetIllustration />
        </div>

        <div className="mt-4 inline-flex items-center rounded-full bg-[#e7f7ea] px-3 py-1.5 text-[0.78rem] font-bold text-[#2cad61]">
          <span aria-hidden="true" className="mr-1.5 text-[0.86rem] leading-none">
            {budgetIsOver ? "!" : "🎉"}
          </span>
          {statusLabel}
        </div>

        <div className="mt-4.5 flex items-center gap-2.5">
          <div className="h-3.5 flex-1 overflow-hidden rounded-full bg-[#f2efe8]">
            <div
              className="h-full rounded-full"
              style={{
                width: `${progressWidth}%`,
                background: "linear-gradient(90deg, #2fc46e 0%, #7cd54c 28%, #ffcf2b 60%, #ff982f 100%)"
              }}
            />
          </div>
          <span className="min-w-[2.9rem] text-right text-[0.88rem] font-black leading-none text-[#2fc46e]">{remainingPercent} %</span>
        </div>

        <div className="mt-2.5 flex items-center justify-between gap-3 text-[0.74rem] font-medium text-[#8b857b]">
          <p>Du har brukt {formatCompactNok(weeklyTotalNok)} av {formatCompactNok(weeklyBudgetNok)}</p>
          <p className="shrink-0 text-right font-medium text-[#8b857b]">
            {householdSize} {householdSize === 1 ? "person" : "personer"} · {storeName}
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        <StatCard icon={<Wallet size={16} strokeWidth={2.2} />} iconClassName="bg-[#e5f7ea] text-[#28b765]" label="Budsjett" value={formatCompactNok(weeklyBudgetNok)} />
        <StatCard
          icon={<ReceiptText size={16} strokeWidth={2.2} />}
          iconClassName="bg-[#e8f3ff] text-[#2891ff]"
          label="Brukt så langt"
          value={formatCompactNok(weeklyTotalNok)}
        />
        <StatCard
          icon={<CalendarDays size={16} strokeWidth={2.2} />}
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
    <Card className="rounded-[22px] border-0 bg-white px-[0.95rem] pb-[1rem] pt-[1rem] shadow-[0_7px_18px_rgba(42,31,16,0.045)]" variant="quiet">
      <div className={cn("grid h-10 w-10 place-items-center rounded-full", iconClassName)}>{icon}</div>
      <p className="mt-4.5 text-[0.76rem] font-semibold leading-snug text-[#736d65]">{label}</p>
      <p className="mt-1.5 whitespace-nowrap text-[1.08rem] font-black leading-tight text-text-primary">{value}</p>
    </Card>
  );
}

function BudgetIllustration() {
  return (
    <div className="relative flex h-[126px] w-full items-start justify-end self-start pr-1 pt-1">
      <img
        alt=""
        className="relative z-[1]"
        height={128}
        src={veggieBowl}
        style={{
          alignSelf: "flex-start",
          height: 128,
          marginLeft: 8,
          marginTop: -2,
          objectFit: "contain",
          width: 128
        }}
        width={128}
      />
    </div>
  );
}

function CelebrationBanner({ budgetDeltaNok, savedSharePercent }: { budgetDeltaNok: number; savedSharePercent: number }) {
  return (
    <Card className="flex items-center gap-3 rounded-[18px] border-0 bg-[#eef6ea] px-4 py-3 shadow-none" variant="quiet">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#cff1d6] text-[#35bf69]">
        <TrendingUp size={18} strokeWidth={2.5} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[0.92rem] font-black text-text-primary">Flott jobba! 🎉</p>
        <p className="mt-1 text-[0.76rem] font-medium text-[#6f796d]">Du har spart {formatCompactNok(budgetDeltaNok)} denne uka</p>
        <p className="mt-0.5 text-[0.76rem] font-medium text-[#6f796d]">Det er {savedSharePercent} % av budsjettet!</p>
      </div>
      <PlantIllustration />
    </Card>
  );
}

function PlantIllustration() {
  return (
    <div className="relative h-[62px] w-[52px] shrink-0">
      <div className="absolute bottom-1 left-1/2 h-2.5 w-10 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(172,152,122,0.28),rgba(172,152,122,0.02)_72%)]" />
      <div className="absolute bottom-2 left-1/2 h-[22px] w-[26px] -translate-x-1/2 rounded-[8px_8px_12px_12px] bg-[linear-gradient(180deg,#d6a470_0%,#b87d47_100%)] shadow-[inset_0_-4px_6px_rgba(0,0,0,0.08)]" />
      <div className="absolute bottom-[22px] left-1/2 h-5 w-[2px] -translate-x-1/2 rounded-full bg-[#4a9a4e]" />
      <div className="absolute bottom-[30px] left-[10px] h-[20px] w-[14px] rounded-[14px_14px_4px_14px] bg-[linear-gradient(180deg,#7fd24d_0%,#4fa33f_100%)] rotate-[-24deg]" />
      <div className="absolute bottom-[34px] left-[20px] h-[24px] w-[16px] rounded-[16px_16px_4px_16px] bg-[linear-gradient(180deg,#79cf4b_0%,#48a23e_100%)] rotate-[-6deg]" />
      <div className="absolute bottom-[30px] right-[10px] h-[20px] w-[14px] rounded-[14px_14px_14px_4px] bg-[linear-gradient(180deg,#76ca4a_0%,#43973c_100%)] rotate-[20deg]" />
      <div className="absolute bottom-[38px] right-[17px] h-[18px] w-[12px] rounded-[12px_12px_12px_4px] bg-[linear-gradient(180deg,#88d857_0%,#4ba13f_100%)] rotate-[28deg]" />
    </div>
  );
}

function QuickActionButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      className="min-h-[40px] rounded-[16px] px-app-2 text-[0.68rem] font-black text-text-secondary transition-[background-color,color,opacity] duration-200 hover:bg-surface hover:text-text-primary hover:opacity-95"
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

const weekdayLabels = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];

const mealPhotoAssets = [mealImage1, mealImage2, mealImage3, mealImage4, mealImage5, mealImage6, mealImage7, mealImage8, mealImage9, mealImage10];

const ingredientNameById = new Map(ingredients.map((ingredient) => [ingredient.id, ingredient.name]));

const getWeekdayLabel = (index: number) => weekdayLabels[index] ?? `Dag ${index + 1}`;

const getMealPhoto = (index: number) => mealPhotoAssets[index % mealPhotoAssets.length];

const getMealSubtitle = (meal: PlannedMeal) => {
  const selectedNames = meal.ingredients
    .map((entry) => ingredientNameById.get(entry.ingredientId))
    .filter((value): value is string => Boolean(value))
    .filter((name) => !["Yoghurt naturell", "Hakkede tomater", "Jasminris", "Fullkornspasta"].includes(name))
    .slice(0, 2)
    .map(normalizeIngredientLabel);

  if (selectedNames.length >= 2) {
    return `med ${selectedNames[0]} og ${selectedNames[1]}`;
  }

  if (selectedNames.length === 1) {
    return `med ${selectedNames[0]}`;
  }

  return `${meal.prepTimeMinutes} min · ${meal.mealTag.toLowerCase()}`;
};

const normalizeIngredientLabel = (label: string) =>
  label
    .replace("Kyllinglårfilet", "kylling")
    .replace("Laksefilet", "laks")
    .replace("Torskefilet", "torsk")
    .replace("Gulrøtter", "gulrot")
    .replace("Poteter", "potet")
    .replace("Brokkoli", "brokkoli")
    .replace("Hodekål", "grønnsaker")
    .toLowerCase();

const getMealRailTags = (meal: PlannedMeal) => {
  const tags: Array<{ label: string; tone: "saving" | "warm" | "premium" | "neutral" }> = [];

  if (meal.categorySignals.budget) {
    tags.push({ label: "Billig", tone: "saving" });
  }

  if (meal.difficulty === "easy") {
    tags.push({ label: "Enkel", tone: "warm" });
  }

  if (meal.categorySignals.protein || meal.categorySignals.vegetarian) {
    tags.push({ label: "Sunn", tone: "saving" });
  }

  if (meal.prepTimeMinutes <= 30) {
    tags.push({ label: "Rask", tone: "premium" });
  }

  if (meal.categorySignals.family) {
    tags.push({ label: "Familie", tone: "neutral" });
  }

  return tags.slice(0, 2);
};
