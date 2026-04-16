import type {
  BudgetPreference,
  GeneratedMeal,
  Ingredient,
  Meal,
  MealSwapAlternative,
  MealSwapKind,
  WeeklyPlan
} from "@/types/domain";
import { getBudgetProfile } from "./mealGenerationEngine";
import { createPlanSummary, generatePricedMeal, roundNok } from "./pricingEngine";
import { buildShoppingList } from "./shoppingListEngine";

const alternativeTitles = {
  cheaper: "Billigere alternativ",
  faster: "Raskere alternativ",
  filling: "Mer mettende alternativ"
} satisfies Record<MealSwapKind, MealSwapAlternative["title"]>;

const getFillingScore = (meal: GeneratedMeal) =>
  (meal.categorySignals.protein ? 8 : 0) +
  (meal.categorySignals.leftovers ? 4 : 0) +
  (meal.tags.includes("poteter") || meal.tags.includes("ris") || meal.tags.includes("pasta") ? 3 : 0) +
  (meal.categorySignals.family ? 2 : 0);

const hasTag = (meal: GeneratedMeal | Meal, tag: string) => meal.tags.some((item) => item.toLowerCase() === tag);

const isFishMeal = (meal: GeneratedMeal | Meal) => hasTag(meal, "fisk");

const isChickenMeal = (meal: GeneratedMeal | Meal) => hasTag(meal, "kylling") || meal.id.includes("kylling");

const isRedMeatMeal = (meal: GeneratedMeal | Meal) => meal.id.includes("taco") || meal.id.includes("bolognese");

const respectsBudgetProfile = (
  meal: GeneratedMeal,
  currentMeal: GeneratedMeal,
  currentPlan: WeeklyPlan,
  preference: BudgetPreference
) => {
  const profile = getBudgetProfile(preference);
  const currentPremiumCount = currentPlan.meals.filter((item) => item.categorySignals.premium).length;
  const replacingPremium = currentMeal.categorySignals.premium;

  if (!meal.categorySignals.premium) {
    return true;
  }

  return replacingPremium || currentPremiumCount < profile.maxPremiumMeals;
};

const keepsWeeklyVariety = (meal: GeneratedMeal, currentMeal: GeneratedMeal, currentPlan: WeeklyPlan) => {
  const otherMeals = currentPlan.meals.filter((item) => item.id !== currentMeal.id);

  if (!otherMeals.some(isFishMeal) && !isFishMeal(meal)) {
    return false;
  }

  if (!otherMeals.some((item) => item.categorySignals.vegetarian) && !meal.categorySignals.vegetarian) {
    return false;
  }

  if (!otherMeals.some(isChickenMeal) && !isChickenMeal(meal)) {
    return false;
  }

  if (!otherMeals.some(isRedMeatMeal) && !isRedMeatMeal(meal)) {
    return false;
  }

  return true;
};

const respectsBudgetLevel = (meal: GeneratedMeal, currentMeal: GeneratedMeal, currentPlan: WeeklyPlan, preference: BudgetPreference) => {
  const profile = getBudgetProfile(preference);

  if (profile.level === "low") {
    return meal.totalPriceNok <= Math.max(currentMeal.totalPriceNok, currentPlan.summary.perMealAverageNok * 1.15);
  }

  if (profile.level === "mid" && meal.categorySignals.premium && !currentMeal.categorySignals.premium) {
    return meal.totalPriceNok <= currentMeal.totalPriceNok;
  }

  return true;
};

const candidateMeals = (
  allMeals: Meal[],
  currentMeal: GeneratedMeal,
  currentPlan: WeeklyPlan,
  preference: BudgetPreference
) => {
  const plannedMealIds = new Set(currentPlan.meals.map((meal) => meal.id));

  return allMeals
    .filter((meal) => meal.id !== currentMeal.id)
    .filter((meal) => !plannedMealIds.has(meal.id))
    .map((meal) => generatePricedMeal(meal, preference))
    .filter((meal) => respectsBudgetProfile(meal, currentMeal, currentPlan, preference))
    .filter((meal) => respectsBudgetLevel(meal, currentMeal, currentPlan, preference))
    .filter((meal) => keepsWeeklyVariety(meal, currentMeal, currentPlan));
};

const chooseCheaperAlternative = (candidates: GeneratedMeal[], currentMeal: GeneratedMeal) =>
  candidates
    .filter((meal) => meal.totalPriceNok < currentMeal.totalPriceNok)
    .sort((a, b) => a.totalPriceNok - b.totalPriceNok || a.prepTimeMinutes - b.prepTimeMinutes)[0];

const chooseFasterAlternative = (candidates: GeneratedMeal[], currentMeal: GeneratedMeal, usedIds: Set<string>) =>
  candidates
    .filter((meal) => !usedIds.has(meal.id))
    .filter((meal) => meal.prepTimeMinutes < currentMeal.prepTimeMinutes)
    .sort((a, b) => a.prepTimeMinutes - b.prepTimeMinutes || a.totalPriceNok - b.totalPriceNok)[0];

const chooseFillingAlternative = (candidates: GeneratedMeal[], currentMeal: GeneratedMeal, usedIds: Set<string>) =>
  candidates
    .filter((meal) => !usedIds.has(meal.id))
    .filter((meal) => getFillingScore(meal) >= getFillingScore(currentMeal))
    .sort((a, b) => getFillingScore(b) - getFillingScore(a) || a.totalPriceNok - b.totalPriceNok)[0];

const toAlternative = (
  kind: MealSwapKind,
  meal: GeneratedMeal,
  currentMeal: GeneratedMeal
): MealSwapAlternative => ({
  kind,
  title: alternativeTitles[kind],
  meal,
  priceDifferenceNok: roundNok(meal.totalPriceNok - currentMeal.totalPriceNok)
});

export const getMealSwapAlternatives = (
  currentMeal: GeneratedMeal,
  currentPlan: WeeklyPlan,
  allMeals: Meal[],
  preference: BudgetPreference
): MealSwapAlternative[] => {
  const candidates = candidateMeals(allMeals, currentMeal, currentPlan, preference);
  const usedIds = new Set<string>();
  const alternatives: MealSwapAlternative[] = [];
  const cheaper = chooseCheaperAlternative(candidates, currentMeal);

  if (cheaper) {
    usedIds.add(cheaper.id);
    alternatives.push(toAlternative("cheaper", cheaper, currentMeal));
  }

  const faster = chooseFasterAlternative(candidates, currentMeal, usedIds);

  if (faster) {
    usedIds.add(faster.id);
    alternatives.push(toAlternative("faster", faster, currentMeal));
  }

  const filling = chooseFillingAlternative(candidates, currentMeal, usedIds);

  if (filling) {
    usedIds.add(filling.id);
    alternatives.push(toAlternative("filling", filling, currentMeal));
  }

  return alternatives;
};

export const replaceMealInPlan = (
  currentPlan: WeeklyPlan,
  currentMealId: string,
  replacement: GeneratedMeal,
  ingredients: Ingredient[],
  preference: BudgetPreference
): WeeklyPlan => {
  const meals = currentPlan.meals.map((meal) =>
    meal.id === currentMealId ? { ...replacement, weekday: meal.weekday } : meal
  );

  return {
    meals,
    shoppingList: buildShoppingList(meals, ingredients, preference),
    summary: createPlanSummary(meals, preference)
  };
};
