import type {
  BudgetPreference,
  PremiumImprovement,
  PremiumOptimizationPreview,
  PremiumStrategy,
  WeeklyPlan
} from "@/types/domain";
import { getStoreMultiplier, roundNok } from "./pricingEngine";

const lowPriceStore = "KIWI";
const roundEstimateNok = (amount: number) => Math.max(10, Math.round(amount / 10) * 10);

const getMovableBasketTotal = (plan: WeeklyPlan) =>
  plan.shoppingList.groups
    .flatMap((group) => group.items)
    .filter((item) => ["Tørrvarer", "Frukt og grønt", "Sauser og krydder"].includes(item.group))
    .filter((item) => !item.alreadyHave)
    .reduce((total, item) => total + item.estimatedPriceNok, 0);

const getEstimatedSplitSavings = (plan: WeeklyPlan, preference: BudgetPreference) => {
  const currentMultiplier = getStoreMultiplier(preference.preferredStore);
  const lowPriceMultiplier = getStoreMultiplier(lowPriceStore);
  const movableTotal = getMovableBasketTotal(plan);

  if (currentMultiplier > lowPriceMultiplier) {
    return roundEstimateNok(movableTotal * (1 - lowPriceMultiplier / currentMultiplier));
  }

  return roundEstimateNok(Math.max(25, plan.summary.weeklyTotalNok * 0.035));
};

const createPremiumMealImprovement = (plan: WeeklyPlan): PremiumImprovement | null => {
  const premiumMeal = plan.meals.find((meal) => meal.categorySignals.premium);

  if (!premiumMeal) {
    return null;
  }

  return {
    id: "premium-meal-swap",
    title: "Bytteforslag på dyr fiskemiddag",
    body: `${premiumMeal.name} kan vurderes mot en rimeligere fiskerett når Pro finner gode alternativer.`,
    estimatedSavingsNok: roundEstimateNok(Math.min(95, premiumMeal.totalPriceNok * 0.22))
  };
};

const createPantryImprovement = (plan: WeeklyPlan): PremiumImprovement | null => {
  const pantryItems = plan.shoppingList.groups
    .flatMap((group) => group.items)
    .filter((item) => ["Tørrvarer", "Sauser og krydder"].includes(item.group))
    .filter((item) => !item.alreadyHave);

  if (pantryItems.length === 0) {
    return null;
  }

  const total = pantryItems.reduce((sum, item) => sum + item.estimatedPriceNok, 0);

  return {
    id: "own-brand-mix",
    title: "Egne merkevarer på basisvarer",
    body: `${pantryItems.slice(0, 2).map((item) => item.name.toLowerCase()).join(" og ")} er gode kandidater for billigere alternativer.`,
    estimatedSavingsNok: roundEstimateNok(Math.max(18, total * 0.12))
  };
};

const createStoreImprovement = (plan: WeeklyPlan, preference: BudgetPreference): PremiumImprovement => {
  const estimatedSavingsNok = getEstimatedSplitSavings(plan, preference);

  return {
    id: "store-route",
    title: "Butikkvalg for varer som tåler flytting",
    body:
      preference.preferredStore === lowPriceStore
        ? "Du handler allerede i en lavprisprofil. Pro kan likevel følge ukesnivå og varsle når enkelte varer bør flyttes."
        : "Pro kan foreslå hvilke basisvarer som er verdt å flytte til lavprisbutikk når det faktisk lønner seg.",
    estimatedSavingsNok
  };
};

export const createPremiumOptimizationPreview = (
  plan: WeeklyPlan,
  preference: BudgetPreference,
  locked = true
): PremiumOptimizationPreview => {
  const splitSavings = getEstimatedSplitSavings(plan, preference);
  const smartSwapSavings = roundEstimateNok(Math.max(20, plan.summary.premiumOptimizationPreviewNok * 0.35));
  const estimatedExtraSavingsNok = roundEstimateNok(Math.min(plan.summary.weeklyTotalNok * 0.12, splitSavings + smartSwapSavings));
  const maxSavingsTotal = Math.max(0, plan.summary.weeklyTotalNok - estimatedExtraSavingsNok);

  const strategies: PremiumStrategy[] = [
    {
      id: "practical",
      title: "Praktisk valg",
      description: "Handle alt i én butikk",
      benefits: ["enklere", "raskere", "fortsatt gode priser"],
      estimatedTotalNok: plan.summary.weeklyTotalNok,
      estimatedSavingsNok: 0
    },
    {
      id: "max-savings",
      title: "Maks sparing",
      description: "Del opp handelen for lavest pris",
      benefits: ["lavest mulig totalpris", "kan kreve flere butikker"],
      estimatedTotalNok: roundNok(maxSavingsTotal),
      estimatedSavingsNok: estimatedExtraSavingsNok
    }
  ];

  const improvements = [
    createPremiumMealImprovement(plan),
    createPantryImprovement(plan),
    createStoreImprovement(plan, preference)
  ].filter((improvement): improvement is PremiumImprovement => improvement !== null);

  return {
    locked,
    estimatedExtraSavingsNok,
    strategies,
    improvements
  };
};
