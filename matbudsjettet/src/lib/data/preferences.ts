import type { BudgetPreference } from "@/types/domain";

export const defaultPreference: BudgetPreference = {
  weeklyBudgetNok: 1350,
  householdSize: 4,
  planMode: "balanced",
  preferredStore: "KIWI",
  pantryIngredientIds: ["rice", "oats", "tomatoes-canned"]
};
