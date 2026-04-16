import type {
  BudgetPreference,
  GeneratedMeal,
  Meal,
  SavingsTip,
  SavingsTipsReport,
  ShoppingListItem,
  WeeklyPlan
} from "@/types/domain";
import { stores } from "@/lib/data/stores";
import { generatePricedMeal, getStoreMultiplier, roundNok } from "./pricingEngine";

const ownBrandPantryIds = new Set(["pasta", "rice", "tomatoes-canned", "lentils", "bread", "tortilla"]);
const freshToFrozenIds = new Set(["broccoli", "carrots"]);

const getStoreName = (storeId: BudgetPreference["preferredStore"]) =>
  stores.find((store) => store.id === storeId)?.name ?? storeId;

const getAllShoppingItems = (plan: WeeklyPlan) => plan.shoppingList.groups.flatMap((group) => group.items);

const addTip = (tips: SavingsTip[], tip: SavingsTip | null) => {
  if (!tip || tip.estimatedSavingsNok <= 0 || tips.some((item) => item.id === tip.id)) {
    return;
  }

  tips.push(tip);
};

const findCheaperMeal = (
  currentMeal: GeneratedMeal,
  meals: Meal[],
  preference: BudgetPreference,
  predicate: (meal: GeneratedMeal) => boolean
) =>
  meals
    .filter((meal) => meal.id !== currentMeal.id)
    .map((meal) => generatePricedMeal(meal, preference))
    .filter(predicate)
    .filter((meal) => meal.totalPriceNok < currentMeal.totalPriceNok)
    .sort((a, b) => b.totalPriceNok - a.totalPriceNok)[0];

const createPremiumFishTip = (plan: WeeklyPlan, meals: Meal[], preference: BudgetPreference): SavingsTip | null => {
  const premiumFish = [...plan.meals]
    .filter((meal) => meal.categorySignals.premium && meal.tags.includes("fisk"))
    .sort((a, b) => b.totalPriceNok - a.totalPriceNok)[0];

  if (!premiumFish) {
    return null;
  }

  const cheaperFish = findCheaperMeal(
    premiumFish,
    meals,
    preference,
    (meal) => meal.tags.includes("fisk") && !meal.categorySignals.premium
  );

  if (!cheaperFish) {
    return null;
  }

  return {
    id: `premium-fish-${premiumFish.id}`,
    section: "Størst effekt",
    title: `Bytt ${premiumFish.name.toLowerCase()} med ${cheaperFish.name.toLowerCase()}`,
    body: `Du beholder fiskemiddagen, men flytter den fra premium-nivå til en roligere hverdagsrett.`,
    estimatedSavingsNok: roundNok(premiumFish.totalPriceNok - cheaperFish.totalPriceNok),
    kind: "meal-swap",
    sourceLabel: premiumFish.weekday ?? "Denne uken"
  };
};

const createVegetarianSwapTip = (plan: WeeklyPlan, meals: Meal[], preference: BudgetPreference): SavingsTip | null => {
  const vegetarianCount = plan.meals.filter((meal) => meal.categorySignals.vegetarian).length;

  if (vegetarianCount >= 3) {
    return null;
  }

  const swapCandidate = [...plan.meals]
    .filter((meal) => !meal.categorySignals.vegetarian)
    .sort((a, b) => b.totalPriceNok - a.totalPriceNok)[0];

  if (!swapCandidate) {
    return null;
  }

  const vegetarianAlternative = findCheaperMeal(
    swapCandidate,
    meals,
    preference,
    (meal) => meal.categorySignals.vegetarian && !plan.meals.some((plannedMeal) => plannedMeal.id === meal.id)
  );

  if (!vegetarianAlternative) {
    return null;
  }

  return {
    id: `vegetarian-swap-${swapCandidate.id}`,
    section: "Størst effekt",
    title: `Legg inn én ekstra vegetarmiddag`,
    body: `${vegetarianAlternative.name} kan erstatte ${swapCandidate.name.toLowerCase()} uten at uken mister metthet.`,
    estimatedSavingsNok: roundNok(swapCandidate.totalPriceNok - vegetarianAlternative.totalPriceNok),
    kind: "meal-swap",
    sourceLabel: swapCandidate.weekday ?? "Middagsplan"
  };
};

const createPantryOwnBrandTip = (items: ShoppingListItem[], preference: BudgetPreference): SavingsTip | null => {
  const pantryItems = items
    .filter((item) => item.group === "Tørrvarer" || item.group === "Sauser og krydder")
    .filter((item) => ownBrandPantryIds.has(item.ingredientId))
    .filter((item) => !item.alreadyHave);

  if (pantryItems.length === 0) {
    return null;
  }

  const total = pantryItems.reduce((sum, item) => sum + item.estimatedPriceNok, 0);
  const savingsRate = preference.preferredStore === "MENY" ? 0.18 : 0.12;

  return {
    id: "own-brand-pantry",
    section: "Enkle grep",
    title: "Velg egne merkevarer på basisvarene",
    body: `${pantryItems.slice(0, 3).map((item) => item.name.toLowerCase()).join(", ")} ligger allerede i handlelisten. Her er egne merkevarer ofte et trygt valg.`,
    estimatedSavingsNok: roundNok(total * savingsRate),
    kind: "pantry",
    sourceLabel: getStoreName(preference.preferredStore)
  };
};

const createFrozenSwapTip = (items: ShoppingListItem[]): SavingsTip | null => {
  const freshItems = items.filter((item) => freshToFrozenIds.has(item.ingredientId) && !item.alreadyHave);

  if (freshItems.length === 0) {
    return null;
  }

  const total = freshItems.reduce((sum, item) => sum + item.estimatedPriceNok, 0);

  return {
    id: "frozen-produce",
    section: "Enkle grep",
    title: "Bruk frosne grønnsaker der det passer",
    body: `${freshItems.map((item) => item.name.toLowerCase()).join(" og ")} brukes i varme retter denne uken. Frosne alternativer gir lite svinn og jevn pris.`,
    estimatedSavingsNok: roundNok(total * 0.2),
    kind: "frozen",
    sourceLabel: "Grønnsaker"
  };
};

const createLeftoverTip = (plan: WeeklyPlan): SavingsTip | null => {
  const leftoverMeals = plan.meals.filter((meal) => meal.categorySignals.leftovers);

  if (leftoverMeals.length < 2) {
    return null;
  }

  return {
    id: "leftover-lunches",
    section: "Enkle grep",
    title: "Sett av to lunsjbokser før servering",
    body: `${leftoverMeals[0].name} og ${leftoverMeals[1].name.toLowerCase()} tåler oppvarming godt. Pakk restene før bordet ryddes.`,
    estimatedSavingsNok: roundNok(Math.min(140, plan.summary.perMealAverageNok * 0.7)),
    kind: "leftovers",
    sourceLabel: "Rester"
  };
};

const createStoreMoveTip = (items: ShoppingListItem[], preference: BudgetPreference): SavingsTip | null => {
  if (preference.preferredStore === "KIWI") {
    const proteinItems = items.filter((item) => item.group === "Kjøtt og fisk" && !item.alreadyHave);
    const proteinTotal = proteinItems.reduce((sum, item) => sum + item.estimatedPriceNok, 0);

    return {
      id: "kiwi-low-price-focus",
      section: "Smart butikkvalg",
      title: "Hold lavprisvarene samlet hos KIWI",
      body: "Du har allerede valgt den rimeligste butikkprofilen. Størst effekt nå er å kjøpe basisvarene samlet og unngå små tilleggsturer.",
      estimatedSavingsNok: roundNok(Math.max(25, proteinTotal * 0.04)),
      kind: "store",
      sourceLabel: "KIWI"
    };
  }

  const currentMultiplier = getStoreMultiplier(preference.preferredStore);
  const kiwiMultiplier = getStoreMultiplier("KIWI");
  const movableGroups = items.filter((item) => ["Tørrvarer", "Frukt og grønt"].includes(item.group) && !item.alreadyHave);
  const currentTotal = movableGroups.reduce((sum, item) => sum + item.estimatedPriceNok, 0);
  const estimatedKiwiTotal = currentMultiplier > 0 ? currentTotal * (kiwiMultiplier / currentMultiplier) : currentTotal;
  const savings = roundNok(currentTotal - estimatedKiwiTotal);

  if (savings <= 0) {
    return null;
  }

  return {
    id: "move-basics-to-kiwi",
    section: "Smart butikkvalg",
    title: "Flytt basisvarer til KIWI hvis du handler to steder",
    body: `Siden du har valgt ${getStoreName(preference.preferredStore)}, kan tørrvarer og grønt være verdt å ta hos KIWI når det passer ruten.`,
    estimatedSavingsNok: savings,
    kind: "store",
    sourceLabel: "Tørrvarer og grønt"
  };
};

const createBudgetNudgeTip = (plan: WeeklyPlan): SavingsTip | null => {
  if (plan.summary.budgetComparison.status !== "over") {
    return null;
  }

  return {
    id: "budget-nudge",
    section: "Størst effekt",
    title: "Ta ned én dyr middag først",
    body: `Planen ligger ${roundNok(Math.abs(plan.summary.budgetComparison.differenceNok))} kr over budsjett. Start med ukens dyreste middag før du kutter småvarer.`,
    estimatedSavingsNok: roundNok(Math.min(Math.abs(plan.summary.budgetComparison.differenceNok), plan.summary.perMealAverageNok * 0.35)),
    kind: "meal-swap",
    sourceLabel: "Budsjett"
  };
};

export const generateSavingsTips = (
  plan: WeeklyPlan,
  preference: BudgetPreference,
  meals: Meal[],
  options?: {
    completedTipIds?: string[];
    dismissedTipIds?: string[];
    planHash?: string;
  }
): SavingsTipsReport => {
  const shoppingItems = getAllShoppingItems(plan);
  const tips: SavingsTip[] = [];

  addTip(tips, createBudgetNudgeTip(plan));
  addTip(tips, createPremiumFishTip(plan, meals, preference));
  addTip(tips, createVegetarianSwapTip(plan, meals, preference));
  addTip(tips, createPantryOwnBrandTip(shoppingItems, preference));
  addTip(tips, createFrozenSwapTip(shoppingItems));
  addTip(tips, createLeftoverTip(plan));
  addTip(tips, createStoreMoveTip(shoppingItems, preference));

  const totalSavingsPotentialNok = roundNok(tips.reduce((sum, tip) => sum + tip.estimatedSavingsNok, 0));
  const blockedTipIds = new Set([...(options?.dismissedTipIds ?? []), ...(options?.completedTipIds ?? [])]);
  const activeTips = tips
    .filter((tip) => !blockedTipIds.has(tip.id))
    .sort((a, b) => b.estimatedSavingsNok - a.estimatedSavingsNok);

  return {
    planHash: options?.planHash ?? "",
    primaryTips: activeTips.slice(0, 3),
    secondaryTips: activeTips.slice(3, 6),
    topInsight: activeTips[0] ?? null,
    totalSavingsPotentialNok,
  };
};

export const createSavingsTipsPlanHash = (plan: WeeklyPlan, preference: BudgetPreference) =>
  JSON.stringify({
    budget: preference.weeklyBudgetNok,
    householdSize: preference.householdSize,
    pantryIngredientIds: [...preference.pantryIngredientIds].sort(),
    store: preference.preferredStore,
    meals: plan.meals.map((meal) => ({
      id: meal.id,
      price: meal.totalPriceNok
    })),
    shopping: plan.shoppingList.groups.flatMap((group) =>
      group.items.map((item) => ({
        alreadyHave: item.alreadyHave,
        id: item.ingredientId,
        price: item.estimatedPriceNok
      }))
    )
  });
