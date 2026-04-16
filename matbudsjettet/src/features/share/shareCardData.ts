import { formatCompactNok } from "@/lib/utils/format";
import type { BudgetPreference, PlanMode, PlannedMeal, WeeklyPlan } from "@/types/domain";

export type ShareCardData = {
  budgetLine: string;
  featuredMeal: PlannedMeal;
  headline: string;
  householdLabel: string;
  modeLabel: string;
  planMode: PlanMode;
  shareText: string;
  weeklyTotalLabel: string;
};

const planModeLabels = {
  "save-most": "Spareuke",
  balanced: "Balansert uke",
  protein: "Proteinrik uke",
  family: "Familievennlig uke",
  quick: "Rask uke",
  extra: "Litt ekstra"
} satisfies Record<PlanMode, string>;

export const getPlanModeLabel = (planMode: PlanMode) => planModeLabels[planMode];

const getFeaturedMeal = (meals: PlannedMeal[]) =>
  [...meals].sort((a, b) => {
    const tagScore = Number(b.categorySignals.protein) - Number(a.categorySignals.protein);
    const premiumScore = Number(b.categorySignals.premium) - Number(a.categorySignals.premium);
    return tagScore || premiumScore || b.totalPriceNok - a.totalPriceNok;
  })[0] ?? meals[0];

export const createShareCardData = (plan: WeeklyPlan, preference: BudgetPreference): ShareCardData => {
  const difference = plan.summary.budgetComparison.differenceNok;
  const isOverBudget = difference < 0;
  const absoluteDifference = Math.abs(difference);
  const modeLabel = getPlanModeLabel(preference.planMode);
  const householdLabel = preference.householdSize === 1 ? "1 person" : `${preference.householdSize} personer`;
  const weeklyTotalLabel = formatCompactNok(plan.summary.weeklyTotalNok);
  const featuredMeal = getFeaturedMeal(plan.meals);
  const budgetLine = isOverBudget
    ? `${formatCompactNok(absoluteDifference)} over budsjett`
    : `${formatCompactNok(absoluteDifference)} under budsjett`;
  const headline = isOverBudget
    ? `${modeLabel} for ${householdLabel}: ${weeklyTotalLabel}`
    : `${modeLabel} for ${householdLabel}: ${weeklyTotalLabel}`;
  const shareText = isOverBudget
    ? `Denne uken lander ukeplanen min på ${weeklyTotalLabel}, ${formatCompactNok(absoluteDifference)} over budsjett.`
    : `Denne uken holder jeg meg ${formatCompactNok(absoluteDifference)} under budsjett med Matbudsjettet.`;

  return {
    budgetLine,
    featuredMeal,
    headline,
    householdLabel,
    modeLabel,
    planMode: preference.planMode,
    shareText,
    weeklyTotalLabel
  };
};
