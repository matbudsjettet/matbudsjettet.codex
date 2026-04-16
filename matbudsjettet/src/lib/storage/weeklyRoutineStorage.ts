import type { WeeklyPlan, WeeklyRoutineState } from "@/types/domain";

const storageKey = "matbudsjettet.weeklyRoutine.v1";

export const defaultWeeklyRoutineState: WeeklyRoutineState = {
  mealPreferences: {
    dislikedMealIds: [],
    favoriteMealIds: [],
    repeatCheapMealIds: []
  },
  smartCoach: {
    completedTipIds: [],
    dismissedTipIds: [],
    lastPlanHash: ""
  },
  weeklyHistory: []
};

export const loadWeeklyRoutineState = (): WeeklyRoutineState => {
  try {
    const rawValue = window.localStorage.getItem(storageKey);

    if (!rawValue) {
      return defaultWeeklyRoutineState;
    }

    return {
      ...defaultWeeklyRoutineState,
      ...JSON.parse(rawValue)
    };
  } catch {
    return defaultWeeklyRoutineState;
  }
};

export const saveWeeklyRoutineState = (state: WeeklyRoutineState) => {
  window.localStorage.setItem(storageKey, JSON.stringify(state));
};

export const createWeeklyHistoryEntry = (plan: WeeklyPlan) => ({
  createdAt: new Date().toISOString(),
  mealIds: plan.meals.map((meal) => meal.id),
  pantrySavingsNok: plan.shoppingList.pantrySavingsNok,
  weeklyTotalNok: plan.summary.weeklyTotalNok
});
