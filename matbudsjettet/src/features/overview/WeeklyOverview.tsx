import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { CalendarDays, ChevronRight, Heart, ReceiptText, Wallet } from "lucide-react";
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
  const store = stores.find((item) => item.id === preference.preferredStore);

  return (
    <motion.section animate="animate" className="relative space-y-9" initial="initial" transition={pageTransition} variants={sectionVariants}>
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
          <div className="flex snap-x snap-proximity gap-3 pr-8">
            {plan.meals.map((meal, index) => (
              <MealRailCard key={meal.id} meal={meal} weekdayLabel={getWeekdayLabel(index)} />
            ))}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-4 gap-app-2 rounded-[22px] bg-bg-elevated p-1.5">
        <QuickActionButton onClick={() => onAction("meals")}>Ukeplan</QuickActionButton>
        <QuickActionButton onClick={() => onAction("shopping")}>Handleliste</QuickActionButton>
        <QuickActionButton onClick={() => onAction("tips")}>Spartips</QuickActionButton>
        <QuickActionButton onClick={() => onAction("swap")}>Bytt rett</QuickActionButton>
      </div>
    </motion.section>
  );
}

function MealRailCard({ meal, weekdayLabel }: { meal: PlannedMeal; weekdayLabel: string }) {
  return (
    <Card className="w-[6.95rem] shrink-0 snap-start overflow-hidden rounded-[20px] border-0 bg-white p-0 shadow-[0_10px_24px_rgba(42,31,16,0.065)]" variant="quiet">
      <div className="relative aspect-[0.9] overflow-hidden bg-[#f6f0e6]">
        <img
          alt={meal.name}
          className="h-full w-full scale-[1.03] object-cover brightness-[0.98] saturate-[0.92] contrast-[0.96]"
          loading="lazy"
          src={getMealPhoto(meal)}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,247,236,0.06),rgba(244,221,188,0.12))]" />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-2.5">
          <span className="rounded-full bg-[#ff9d2f] px-2 py-1 text-[0.66rem] font-black text-white shadow-[0_7px_14px_rgba(255,157,47,0.28)]">
            {weekdayLabel}
          </span>
          <button
            aria-label={`Lagre ${meal.name} som favoritt`}
            className="grid h-7 w-7 place-items-center rounded-full bg-white/92 text-[#9a9488] shadow-[0_7px_16px_rgba(42,31,16,0.12)] backdrop-blur-sm"
            type="button"
          >
            <Heart size={13} strokeWidth={2.2} />
          </button>
        </div>
      </div>

      <div className="px-2.5 pb-2.5 pt-2.5">
        <h4 className="line-clamp-2 text-[0.86rem] font-black leading-[1.2] text-text-primary">{meal.name}</h4>
        <p className="mt-1 line-clamp-2 text-[0.74rem] font-medium leading-[1.25] text-[#7c766d]">{getMealSubtitle(meal)}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
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
    <div className="space-y-3.5">
      <Card className="overflow-hidden rounded-[28px] border-0 bg-white px-5 pb-5 pt-5 shadow-[0_12px_30px_rgba(42,31,16,0.055)] sm:px-6" variant="quiet">
        <div className="grid grid-cols-[minmax(0,1fr)_118px] items-start gap-5">
          <div className="min-w-0 pt-0.5">
            <p className="text-[0.84rem] font-black text-text-primary">Du har</p>
            <p className={cn("mt-3.5 whitespace-nowrap text-[2.55rem] font-black leading-[0.98] tracking-tight", amountColorClass)}>
              <AnimatedNumber className={amountColorClass} formatter={formatPlainNumber} pulse={false} value={budgetDeltaNok} /> kr
            </p>
            <p className="mt-3.5 max-w-[11rem] text-[0.9rem] font-medium leading-[1.3] text-[#7d776e]">igjen av matbudsjettet</p>
          </div>
          <BudgetIllustration />
        </div>

        <div className="mt-5 inline-flex items-center rounded-full bg-[#e7f7ea] px-3 py-1.5 text-[0.78rem] font-bold text-[#2cad61]">
          <span aria-hidden="true" className="mr-1.5 text-[0.86rem] leading-none">
            {budgetIsOver ? "!" : "🎉"}
          </span>
          {statusLabel}
        </div>

        <div className="mt-5 flex items-center gap-2.5">
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

        <div className="mt-3.5 flex items-center justify-between gap-3 text-[0.76rem] font-medium text-[#8b857b]">
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
    <div className="relative flex h-[148px] w-full items-start justify-end self-start pr-1 pt-1">
      <img
        alt=""
        className="relative z-[1]"
        height={140}
        src={veggieBowl}
        style={{
          alignSelf: "flex-start",
          height: 140,
          marginLeft: 12,
          marginTop: -2,
          objectFit: "contain",
          width: 140
        }}
        width={140}
      />
    </div>
  );
}

function QuickActionButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      className="min-h-[42px] rounded-[16px] px-app-2 text-[0.7rem] font-black text-text-secondary transition-[background-color,color,opacity] duration-200 hover:bg-surface hover:text-text-primary hover:opacity-95"
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

const weekdayLabels = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];

const mealPhotoFallbacks: Record<string, string> = {
  "pasta-med-tomatsaus": "https://images.pexels.com/photos/5317184/pexels-photo-5317184.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "kylling-med-ris-og-gronnsaker": "https://images.pexels.com/photos/15978566/pexels-photo-15978566.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "laksefilet-med-poteter": "https://images.pexels.com/photos/20844827/pexels-photo-20844827.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "torsk-med-gulrot-og-potet": "https://images.pexels.com/photos/19615790/pexels-photo-19615790.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "tomatsuppe-med-egg": "https://images.pexels.com/photos/14774700/pexels-photo-14774700.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "chili-sin-carne": "https://images.pexels.com/photos/15881322/pexels-photo-15881322.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "fiskekaker-med-rakost": "https://images.pexels.com/photos/19615790/pexels-photo-19615790.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "taco-fredag": "https://images.pexels.com/photos/6399991/pexels-photo-6399991.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "pytt-i-panne": "https://images.pexels.com/photos/27331092/pexels-photo-27331092.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "ovnsbakt-laks": "https://images.pexels.com/photos/20844827/pexels-photo-20844827.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "omelett-med-gronnsaker": "https://images.pexels.com/photos/27331092/pexels-photo-27331092.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "spaghetti-bolognese": "https://images.pexels.com/photos/21906876/pexels-photo-21906876.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "linsesuppe-med-brod": "https://images.pexels.com/photos/14774700/pexels-photo-14774700.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "kyllingwraps-med-spro-kal": "https://images.pexels.com/photos/23106702/pexels-photo-23106702.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "kyllingform-med-potet-og-gulrot": "https://images.pexels.com/photos/10277949/pexels-photo-10277949.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "pastafrittata-med-brokkoli": "https://images.pexels.com/photos/10934498/pexels-photo-10934498.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "potetsuppe-med-brod": "https://images.pexels.com/photos/5794/pexels-photo-5794.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "egg-og-brod-med-rakost": "https://images.pexels.com/photos/12662757/pexels-photo-12662757.jpeg?auto=compress&cs=tinysrgb&w=1200",
  default: "https://images.pexels.com/photos/5317184/pexels-photo-5317184.jpeg?auto=compress&cs=tinysrgb&w=1200"
};

const ingredientNameById = new Map(ingredients.map((ingredient) => [ingredient.id, ingredient.name]));

const getWeekdayLabel = (index: number) => weekdayLabels[index] ?? `Dag ${index + 1}`;

const getMealPhoto = (meal: PlannedMeal) => mealPhotoFallbacks[meal.id] ?? mealPhotoFallbacks.default;

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
