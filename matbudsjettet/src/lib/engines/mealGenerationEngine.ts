import type { BudgetPreference, GeneratedMeal, Ingredient, Meal, PlannedMeal, UserMealPreferences, WeeklyPlan } from "@/types/domain";
import { createPlanSummary, generatePricedMeal, getStoreMultiplier, householdMultipliers, roundNok } from "./pricingEngine";
import { buildShoppingList } from "./shoppingListEngine";

type BudgetProfile = {
  level: "low" | "mid" | "high";
  maxPremiumMeals: number;
  preferredVegetarianMeals: number;
};

const weekdays = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];
const budgetToleranceNok = 45;

export const getBudgetProfile = (preference: BudgetPreference): BudgetProfile => {
  const baseBudgetPerAdultMeal =
    preference.weeklyBudgetNok /
    (7 * householdMultipliers[preference.householdSize] * getStoreMultiplier(preference.preferredStore));

  if (baseBudgetPerAdultMeal <= 32) {
    return { level: "low", maxPremiumMeals: 0, preferredVegetarianMeals: 3 };
  }

  if (baseBudgetPerAdultMeal >= 50) {
    return { level: "high", maxPremiumMeals: 2, preferredVegetarianMeals: 1 };
  }

  return { level: "mid", maxPremiumMeals: 1, preferredVegetarianMeals: 2 };
};

const hasTag = (meal: Meal, tag: string) => meal.tags.some((item) => item.toLowerCase() === tag);

const isFishMeal = (meal: Meal) => hasTag(meal, "fisk");

const isChickenMeal = (meal: Meal) => hasTag(meal, "kylling") || meal.id.includes("kylling");

const isRedMeatMeal = (meal: Meal) => meal.id.includes("taco") || meal.id.includes("bolognese");

const getSignalScore = (meal: GeneratedMeal, profile: BudgetProfile) => {
  const budgetScore = meal.categorySignals.budget ? 10 : 0;
  const familyScore = meal.categorySignals.family ? 5 : 0;
  const proteinScore = meal.categorySignals.protein ? 3 : 0;
  const leftoverScore = meal.categorySignals.leftovers ? 2 : 0;
  const vegetarianScore = meal.categorySignals.vegetarian ? (profile.level === "low" ? 7 : 3) : 0;
  const premiumPenalty = meal.categorySignals.premium ? (profile.level === "high" ? -1 : -10) : 0;
  const simplicityScore = meal.difficulty === "easy" ? 2 : 0;

  return budgetScore + familyScore + proteinScore + leftoverScore + vegetarianScore + premiumPenalty + simplicityScore;
};

const getModeScore = (meal: GeneratedMeal, preference: BudgetPreference) => {
  if (preference.planMode === "save-most") {
    return (meal.categorySignals.budget ? 8 : 0) + (meal.categorySignals.vegetarian ? 4 : 0) - (meal.categorySignals.premium ? 8 : 0);
  }

  if (preference.planMode === "protein") {
    return meal.categorySignals.protein ? 8 : 0;
  }

  if (preference.planMode === "family") {
    return meal.categorySignals.family ? 8 : 0;
  }

  if (preference.planMode === "quick") {
    return meal.prepTimeMinutes <= 25 ? 8 : meal.prepTimeMinutes <= 30 ? 3 : -3;
  }

  if (preference.planMode === "extra") {
    return meal.categorySignals.premium ? 5 : meal.categorySignals.family ? 2 : 0;
  }

  return 0;
};

const getHabitScore = (meal: GeneratedMeal, mealPreferences?: UserMealPreferences) => {
  if (!mealPreferences) {
    return 0;
  }

  const favoriteScore = mealPreferences.favoriteMealIds.includes(meal.id) ? 6 : 0;
  const repeatCheapScore = mealPreferences.repeatCheapMealIds.includes(meal.id) ? 7 : 0;
  const dislikedPenalty = mealPreferences.dislikedMealIds.includes(meal.id) ? -100 : 0;

  return favoriteScore + repeatCheapScore + dislikedPenalty;
};

const sortByPriceThenFit = (
  meals: GeneratedMeal[],
  profile: BudgetProfile,
  preference: BudgetPreference,
  mealPreferences?: UserMealPreferences
) =>
  [...meals].sort(
    (a, b) =>
      a.totalPriceNok - b.totalPriceNok ||
      getSignalScore(b, profile) +
        getModeScore(b, preference) +
        getHabitScore(b, mealPreferences) -
        (getSignalScore(a, profile) + getModeScore(a, preference) + getHabitScore(a, mealPreferences))
  );

const getWeeklyTotal = (meals: GeneratedMeal[]) => roundNok(meals.reduce((total, meal) => total + meal.totalPriceNok, 0));

const addMeal = (plan: GeneratedMeal[], meal: GeneratedMeal) => {
  if (!plan.some((item) => item.id === meal.id)) {
    plan.push(meal);
  }
};

const countPremiumMeals = (plan: GeneratedMeal[]) => plan.filter((meal) => meal.categorySignals.premium).length;

const isPlanValid = (plan: GeneratedMeal[], profile: BudgetProfile) =>
  plan.length === 7 &&
  plan.some(isFishMeal) &&
  plan.some(isChickenMeal) &&
  plan.some(isRedMeatMeal) &&
  plan.some((meal) => meal.categorySignals.vegetarian) &&
  countPremiumMeals(plan) <= profile.maxPremiumMeals;

const chooseFirst = (meals: GeneratedMeal[], predicate: (meal: GeneratedMeal) => boolean) => meals.find(predicate);

const createInitialPlan = (
  pricedMeals: GeneratedMeal[],
  profile: BudgetProfile,
  preference: BudgetPreference,
  mealPreferences?: UserMealPreferences
) => {
  const affordableMeals = sortByPriceThenFit(
    pricedMeals.filter((meal) => !meal.categorySignals.premium || profile.maxPremiumMeals > 0),
    profile,
    preference,
    mealPreferences
  );
  const plan: GeneratedMeal[] = [];

  affordableMeals
    .filter((meal) => mealPreferences?.repeatCheapMealIds.includes(meal.id))
    .slice(0, 2)
    .forEach((meal) => addMeal(plan, meal));

  addMeal(plan, chooseFirst(affordableMeals, isFishMeal) ?? affordableMeals[0]);

  affordableMeals
    .filter((meal) => meal.categorySignals.vegetarian)
    .slice(0, profile.preferredVegetarianMeals)
    .forEach((meal) => addMeal(plan, meal));

  addMeal(plan, chooseFirst(affordableMeals, isChickenMeal) ?? affordableMeals[0]);

  addMeal(plan, chooseFirst(affordableMeals, isRedMeatMeal) ?? affordableMeals[0]);

  affordableMeals.forEach((meal) => {
    if (plan.length < 7) {
      addMeal(plan, meal);
    }
  });

  return plan.slice(0, 7);
};

const canReplaceMeal = (
  plan: GeneratedMeal[],
  oldMeal: GeneratedMeal,
  newMeal: GeneratedMeal,
  profile: BudgetProfile
) => {
  if (oldMeal.id === newMeal.id || plan.some((meal) => meal.id === newMeal.id)) {
    return false;
  }

  const nextPlan = plan.map((meal) => (meal.id === oldMeal.id ? newMeal : meal));
  return isPlanValid(nextPlan, profile);
};

const tunePlanToBudget = (
  initialPlan: GeneratedMeal[],
  allMeals: GeneratedMeal[],
  preference: BudgetPreference,
  profile: BudgetProfile,
  mealPreferences?: UserMealPreferences
) => {
  let plan = [...initialPlan];

  for (let attempt = 0; attempt < 14; attempt += 1) {
    const weeklyTotal = getWeeklyTotal(plan);
    const budgetGap = preference.weeklyBudgetNok - weeklyTotal;

    if (Math.abs(budgetGap) <= budgetToleranceNok) {
      break;
    }

    const upgrades = allMeals
      .filter((meal) => meal.totalPriceNok > Math.min(...plan.map((item) => item.totalPriceNok)))
      .filter((meal) => !meal.categorySignals.premium || countPremiumMeals(plan) < profile.maxPremiumMeals)
      .sort((a, b) => a.totalPriceNok - b.totalPriceNok);

    const downgrades = sortByPriceThenFit(
      allMeals.filter((meal) => !meal.categorySignals.premium),
      profile,
      preference,
      mealPreferences
    );

    const candidates = budgetGap > 0 ? upgrades : downgrades;
    const currentMeals = budgetGap > 0 ? [...plan].sort((a, b) => a.totalPriceNok - b.totalPriceNok) : [...plan].sort((a, b) => b.totalPriceNok - a.totalPriceNok);

    let changed = false;

    for (const oldMeal of currentMeals) {
      const replacement = candidates.find((candidate) => {
        const delta = candidate.totalPriceNok - oldMeal.totalPriceNok;

        if (budgetGap > 0 && (delta <= 0 || delta > budgetGap + budgetToleranceNok)) {
          return false;
        }

        if (budgetGap < 0 && (delta >= 0 || Math.abs(delta) > Math.abs(budgetGap) + budgetToleranceNok)) {
          return false;
        }

        return canReplaceMeal(plan, oldMeal, candidate, profile);
      });

      if (replacement) {
        plan = plan.map((meal) => (meal.id === oldMeal.id ? replacement : meal));
        changed = true;
        break;
      }
    }

    if (!changed) {
      break;
    }
  }

  return plan;
};

const orderMealsByWeek = (plan: GeneratedMeal[]) => {
  const fish = plan.find(isFishMeal);
  const redMeat = plan.find(isRedMeatMeal);
  const premium = plan.find((meal) => meal.categorySignals.premium && meal.id !== fish?.id && meal.id !== redMeat?.id);
  const remaining = plan.filter((meal) => ![fish?.id, redMeat?.id, premium?.id].includes(meal.id));
  const ordered = [
    ...remaining.slice(0, 4),
    redMeat,
    premium ?? remaining[4],
    fish ?? remaining[5]
  ].filter((meal): meal is GeneratedMeal => Boolean(meal));

  plan.forEach((meal) => {
    if (!ordered.some((item) => item.id === meal.id)) {
      ordered.push(meal);
    }
  });

  return ordered.slice(0, 7).map((meal, index) => ({ ...meal, weekday: weekdays[index] }));
};

export const generateWeeklyMeals = (
  meals: Meal[],
  _ingredients: Ingredient[],
  preference: BudgetPreference,
  mealPreferences?: UserMealPreferences
): PlannedMeal[] => {
  const profile = getBudgetProfile(preference);
  const pricedMeals = meals
    .filter((meal) => !meal.tags.includes("bytteforslag"))
    .filter((meal) => !mealPreferences?.dislikedMealIds.includes(meal.id))
    .map((meal) => generatePricedMeal(meal, preference));
  const initialPlan = createInitialPlan(pricedMeals, profile, preference, mealPreferences);
  const tunedPlan = tunePlanToBudget(initialPlan, pricedMeals, preference, profile, mealPreferences);

  return orderMealsByWeek(tunedPlan);
};

export const createWeeklyPlan = (
  meals: Meal[],
  ingredients: Ingredient[],
  preference: BudgetPreference,
  mealPreferences?: UserMealPreferences
): WeeklyPlan => {
  const plannedMeals = generateWeeklyMeals(meals, ingredients, preference, mealPreferences);
  const shoppingList = buildShoppingList(plannedMeals, ingredients, preference);

  return {
    meals: plannedMeals,
    shoppingList,
    summary: createPlanSummary(plannedMeals, preference)
  };
};

export const refreshWeeklyPlan = (
  meals: Meal[],
  ingredients: Ingredient[],
  preference: BudgetPreference,
  mealPreferences?: UserMealPreferences
) => createWeeklyPlan(meals, ingredients, preference, mealPreferences);
