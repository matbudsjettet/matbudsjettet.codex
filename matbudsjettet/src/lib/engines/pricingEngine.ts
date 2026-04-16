import type {
  BenchmarkResult,
  BudgetComparison,
  BudgetPreference,
  GeneratedMeal,
  HouseholdSize,
  Ingredient,
  Meal,
  MealPlanTag,
  PlanSummary,
  RecipeIngredient,
  StoreId
} from "@/types/domain";

export const householdMultipliers = {
  1: 1,
  2: 1.9,
  3: 2.7,
  4: 3.4,
  5: 4.1,
  6: 4.8
} satisfies Record<HouseholdSize, number>;

export const storeMultipliers = {
  KIWI: 0.97,
  REMA_1000: 1,
  MENY: 1.12
} satisfies Record<StoreId, number>;

const benchmarkStore: StoreId = "REMA_1000";
const benchmarkBasis = "Estimert norsk snitt for samme husholdning og ukesmeny.";
const premiumOptimizationRate = 0.08;

export interface PricedIngredient {
  ingredient: Ingredient;
  quantity: number;
  householdAdjustedQuantity: number;
  packageCount: number;
  store: StoreId;
  basePriceNok: number;
  storeAdjustedPriceNok: number;
  finalPriceNok: number;
  alreadyHave: boolean;
}

export const roundNok = (amount: number) => Math.round(amount);

export const roundPercentage = (amount: number) => Math.round(amount);

export const getIngredientById = (ingredients: Ingredient[], id: string) => {
  const ingredient = ingredients.find((item) => item.id === id);

  if (!ingredient) {
    throw new Error(`Missing ingredient with id "${id}"`);
  }

  return ingredient;
};

export const getHouseholdMultiplier = (householdSize: HouseholdSize) => householdMultipliers[householdSize];

export const getStoreMultiplier = (store: StoreId) => storeMultipliers[store];

export const calculatePackageCount = (quantity: number, packageSize: number, householdSize: HouseholdSize) =>
  Math.max(1, Math.ceil((quantity * getHouseholdMultiplier(householdSize)) / packageSize));

export const priceIngredient = (
  recipeIngredient: RecipeIngredient,
  ingredients: Ingredient[],
  preference: Pick<BudgetPreference, "householdSize" | "preferredStore" | "pantryIngredientIds">,
  store: StoreId = preference.preferredStore
): PricedIngredient => {
  const ingredient = getIngredientById(ingredients, recipeIngredient.ingredientId);
  const packageCount = calculatePackageCount(recipeIngredient.quantity, ingredient.packageSize, preference.householdSize);
  const basePriceNok = packageCount * ingredient.averagePriceNok;
  const storeAdjustedPriceNok = basePriceNok * getStoreMultiplier(store);
  const alreadyHave = preference.pantryIngredientIds.includes(ingredient.id);

  return {
    ingredient,
    quantity: recipeIngredient.quantity,
    householdAdjustedQuantity: roundNok(recipeIngredient.quantity * getHouseholdMultiplier(preference.householdSize)),
    packageCount,
    store,
    basePriceNok: roundNok(basePriceNok),
    storeAdjustedPriceNok: roundNok(storeAdjustedPriceNok),
    finalPriceNok: alreadyHave ? 0 : roundNok(storeAdjustedPriceNok),
    alreadyHave
  };
};

export const priceIngredientPackages = (
  ingredient: Ingredient,
  packageCount: number,
  store: StoreId,
  alreadyHave = false
) => {
  const basePriceNok = packageCount * ingredient.averagePriceNok;
  const storeAdjustedPriceNok = basePriceNok * getStoreMultiplier(store);
  const roundedStorePriceNok = roundNok(storeAdjustedPriceNok);

  return {
    basePriceNok: roundNok(basePriceNok),
    finalPriceNok: alreadyHave ? 0 : roundedStorePriceNok,
    pantryReductionNok: alreadyHave ? roundedStorePriceNok : 0,
    storeAdjustedPriceNok: roundedStorePriceNok
  };
};

export const priceMeal = (
  meal: Meal,
  preference: Pick<BudgetPreference, "householdSize" | "preferredStore">,
  store: StoreId = preference.preferredStore
) => {
  const householdAdjustedPriceNok = meal.baseCostPerAdult * getHouseholdMultiplier(preference.householdSize);
  const totalPriceNok = householdAdjustedPriceNok * getStoreMultiplier(store);

  return {
    basePriceNok: roundNok(meal.baseCostPerAdult),
    storeAdjustedPriceNok: roundNok(meal.baseCostPerAdult * getStoreMultiplier(store)),
    householdAdjustedPriceNok: roundNok(householdAdjustedPriceNok),
    totalPriceNok: roundNok(totalPriceNok),
    costPerServingNok: roundNok(totalPriceNok / meal.servings)
  };
};

export const getMealPlanTag = (meal: Meal): MealPlanTag => {
  if (meal.categorySignals.premium) {
    return "Premium";
  }

  if (meal.categorySignals.budget) {
    return "Budsjett";
  }

  if (meal.categorySignals.vegetarian) {
    return "Vegetar";
  }

  if (meal.categorySignals.protein) {
    return "Protein";
  }

  return "Familie";
};

export const generatePricedMeal = (
  meal: Meal,
  preference: BudgetPreference
): GeneratedMeal => ({
  ...meal,
  mealTag: getMealPlanTag(meal),
  baseCostReference: `${roundNok(meal.baseCostPerAdult)} kr per voksen`,
  ...priceMeal(meal, preference)
});

export const compareToBudget = (weeklyTotalNok: number, weeklyBudgetNok: number): BudgetComparison => {
  const differenceNok = roundNok(weeklyBudgetNok - weeklyTotalNok);
  const percentageUsed =
    weeklyBudgetNok > 0 ? Math.min(100, Math.max(0, roundPercentage((weeklyTotalNok / weeklyBudgetNok) * 100))) : 0;

  return {
    budgetNok: roundNok(weeklyBudgetNok),
    actualNok: roundNok(weeklyTotalNok),
    differenceNok,
    percentageUsed,
    status: differenceNok > 0 ? "under" : differenceNok < 0 ? "over" : "on-track"
  };
};

export const compareToBenchmark = (
  meals: Meal[],
  preference: BudgetPreference,
  weeklyTotalNok: number
): BenchmarkResult => {
  const benchmarkWeeklyNok = meals.reduce(
    (total, meal) => total + priceMeal(meal, preference, benchmarkStore).totalPriceNok,
    0
  );
  const differenceNok = roundNok(benchmarkWeeklyNok - weeklyTotalNok);
  const percentageDifference =
    benchmarkWeeklyNok > 0 ? roundPercentage((differenceNok / benchmarkWeeklyNok) * 100) : 0;

  return {
    benchmarkWeeklyNok: roundNok(benchmarkWeeklyNok),
    differenceNok,
    percentageDifference,
    status: differenceNok > 0 ? "below" : differenceNok < 0 ? "above" : "matches",
    estimateBasis: benchmarkBasis
  };
};

export const createPlanSummary = (
  meals: GeneratedMeal[],
  preference: BudgetPreference
): PlanSummary => {
  const weeklyTotalNok = meals.reduce((total, meal) => total + meal.totalPriceNok, 0);
  const benchmarkComparison = compareToBenchmark(meals, preference, weeklyTotalNok);
  const savingsPotentialNok = Math.max(0, benchmarkComparison.differenceNok);

  return {
    weeklyTotalNok: roundNok(weeklyTotalNok),
    perDayCostNok: roundNok(weeklyTotalNok / 7),
    perMealAverageNok: roundNok(weeklyTotalNok / meals.length),
    savingsPotentialNok: roundNok(savingsPotentialNok),
    premiumOptimizationPreviewNok: roundNok(savingsPotentialNok + weeklyTotalNok * premiumOptimizationRate),
    budgetComparison: compareToBudget(weeklyTotalNok, preference.weeklyBudgetNok),
    benchmarkComparison
  };
};
