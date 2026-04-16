export type StoreId = "KIWI" | "REMA_1000" | "MENY";

export type HouseholdSize = 1 | 2 | 3 | 4 | 5 | 6;

export type PlanMode = "save-most" | "balanced" | "protein" | "family" | "quick" | "extra";

export type IngredientCategory =
  | "protein"
  | "produce"
  | "pantry"
  | "dairy"
  | "bakery"
  | "frozen"
  | "household";

export type BudgetPreference = {
  weeklyBudgetNok: number;
  householdSize: HouseholdSize;
  planMode: PlanMode;
  preferredStore: StoreId;
  pantryIngredientIds: string[];
};

export type UserMealPreferences = {
  dislikedMealIds: string[];
  favoriteMealIds: string[];
  repeatCheapMealIds: string[];
};

export type SavedPreferenceState = BudgetPreference & {
  shoppingStyle: "one-store" | "best-solution";
};

export type WeeklyPlanHistoryEntry = {
  createdAt: string;
  mealIds: string[];
  pantrySavingsNok: number;
  weeklyTotalNok: number;
};

export type WeeklyRoutineState = {
  lastGeneratedAt?: string;
  mealPreferences: UserMealPreferences;
  savedPreference?: SavedPreferenceState;
  smartCoach: {
    completedTipIds: string[];
    dismissedTipIds: string[];
    lastPlanHash: string;
  };
  weeklyHistory: WeeklyPlanHistoryEntry[];
};

export interface Store {
  id: StoreId;
  name: string;
  note: string;
  multiplier: number;
}

export type Ingredient = {
  id: string;
  name: string;
  category: IngredientCategory;
  unit: "g" | "stk" | "kg" | "pk" | "boks" | "pose" | "beger";
  packageSize: number;
  averagePriceNok: number;
  tags: string[];
};

export type RecipeIngredient = {
  ingredientId: string;
  quantity: number;
};

export type MealDifficulty = "easy" | "medium";

export type MealPlanTag = "Budsjett" | "Familie" | "Protein" | "Vegetar" | "Premium";

export type MealCategorySignals = {
  budget: boolean;
  family: boolean;
  vegetarian: boolean;
  protein: boolean;
  premium: boolean;
  leftovers: boolean;
};

export interface Meal {
  id: string;
  name: string;
  weekday?: string;
  servings: number;
  baseCostPerAdult: number;
  prepTimeMinutes: number;
  difficulty: MealDifficulty;
  tags: string[];
  categorySignals: MealCategorySignals;
  ingredients: RecipeIngredient[];
  instructions: string[];
  savingsNote: string;
}

export interface GeneratedMeal extends Meal {
  mealTag: MealPlanTag;
  baseCostReference: string;
  basePriceNok: number;
  storeAdjustedPriceNok: number;
  householdAdjustedPriceNok: number;
  totalPriceNok: number;
  costPerServingNok: number;
}

export type PlannedMeal = GeneratedMeal;

export type RecipeDefinition = {
  title: string;
  timeMinutes: number;
  ingredients: string[];
  steps: string[];
  notes?: string[];
};

export type ShoppingListItem = {
  ingredientId: string;
  name: string;
  group: ShoppingListGroupName;
  quantity: number;
  unit: "stk" | "g" | "kg" | "pk" | "boks" | "pose" | "beger";
  displayQuantity: string;
  packageCount: number;
  bestStore: StoreId;
  estimatedPriceNok: number;
  pantryReductionNok: number;
  totalPriceBeforePantryNok: number;
  alreadyHave: boolean;
};

export type ShoppingListGroupName =
  | "Kjøtt og fisk"
  | "Meieri og egg"
  | "Frukt og grønt"
  | "Tørrvarer"
  | "Sauser og krydder"
  | "Diverse";

export type ShoppingListGroup = {
  group: ShoppingListGroupName;
  items: ShoppingListItem[];
};

export type ShoppingList = {
  basketTotalNok: number;
  groups: ShoppingListGroup[];
  pantrySavingsNok: number;
  totalItems: number;
  totalItemsToBuy: number;
  totalBeforePantryNok: number;
};

export interface BudgetComparison {
  budgetNok: number;
  actualNok: number;
  differenceNok: number;
  percentageUsed: number;
  status: "under" | "over" | "on-track";
}

export interface BenchmarkResult {
  benchmarkWeeklyNok: number;
  differenceNok: number;
  percentageDifference: number;
  status: "below" | "above" | "matches";
  estimateBasis: string;
}

export interface PlanSummary {
  weeklyTotalNok: number;
  perDayCostNok: number;
  perMealAverageNok: number;
  savingsPotentialNok: number;
  premiumOptimizationPreviewNok: number;
  budgetComparison: BudgetComparison;
  benchmarkComparison: BenchmarkResult;
}

export interface WeeklyPlan {
  meals: PlannedMeal[];
  shoppingList: ShoppingList;
  summary: PlanSummary;
}

export type MealSwapKind = "cheaper" | "faster" | "filling";

export type MealSwapAlternative = {
  kind: MealSwapKind;
  title: "Billigere alternativ" | "Raskere alternativ" | "Mer mettende alternativ";
  meal: GeneratedMeal;
  priceDifferenceNok: number;
};

export type SavingsTipSectionName = "Størst effekt" | "Enkle grep" | "Smart butikkvalg";

export type SavingsTip = {
  id: string;
  section: SavingsTipSectionName;
  title: string;
  body: string;
  estimatedSavingsNok: number;
  kind: "meal-swap" | "pantry" | "frozen" | "store" | "leftovers";
  sourceLabel: string;
};

export type SavingsTipsReport = {
  planHash: string;
  primaryTips: SavingsTip[];
  secondaryTips: SavingsTip[];
  topInsight: SavingsTip | null;
  totalSavingsPotentialNok: number;
};

export type PremiumStrategy = {
  id: "practical" | "max-savings";
  title: string;
  description: string;
  benefits: string[];
  estimatedTotalNok: number;
  estimatedSavingsNok: number;
};

export type PremiumImprovement = {
  id: string;
  title: string;
  body: string;
  estimatedSavingsNok: number;
};

export type PremiumOptimizationPreview = {
  locked: boolean;
  estimatedExtraSavingsNok: number;
  strategies: PremiumStrategy[];
  improvements: PremiumImprovement[];
};
