import type {
  BudgetPreference,
  HouseholdSize,
  Ingredient,
  PlannedMeal,
  RecipeIngredient,
  ShoppingList,
  ShoppingListGroup,
  ShoppingListGroupName,
  ShoppingListItem
} from "@/types/domain";
import { priceIngredientPackages, roundNok } from "./pricingEngine";

type AggregatedIngredient = RecipeIngredient & {
  quantity: number;
};

const groupOrder: ShoppingListGroupName[] = [
  "Kjøtt og fisk",
  "Meieri og egg",
  "Frukt og grønt",
  "Tørrvarer",
  "Sauser og krydder",
  "Diverse"
];

const sauceAndSeasoningIds = new Set(["tomatoes-canned", "coconut-milk", "yogurt"]);

const getHouseholdScale = (householdSize: HouseholdSize) => householdSize / 4;

export const getIngredientById = (ingredients: Ingredient[], id: string) => {
  const ingredient = ingredients.find((item) => item.id === id);

  if (!ingredient) {
    throw new Error(`Missing ingredient with id "${id}"`);
  }

  return ingredient;
};

export const getShoppingGroup = (ingredient: Ingredient): ShoppingListGroupName => {
  if (sauceAndSeasoningIds.has(ingredient.id)) {
    return "Sauser og krydder";
  }

  if (ingredient.category === "protein") {
    return "Kjøtt og fisk";
  }

  if (ingredient.category === "dairy") {
    return "Meieri og egg";
  }

  if (ingredient.category === "produce" || ingredient.category === "frozen") {
    return "Frukt og grønt";
  }

  if (ingredient.category === "pantry" || ingredient.category === "bakery") {
    return "Tørrvarer";
  }

  return "Diverse";
};

export const aggregateIngredients = (meals: PlannedMeal[]) => {
  const grouped = new Map<string, AggregatedIngredient>();

  meals.flatMap((meal) => meal.ingredients).forEach((item) => {
    const existing = grouped.get(item.ingredientId);
    grouped.set(item.ingredientId, {
      ingredientId: item.ingredientId,
      quantity: (existing?.quantity ?? 0) + item.quantity
    });
  });

  return Array.from(grouped.values());
};

const getPackageCount = (quantity: number, packageSize: number) => Math.max(1, Math.ceil(quantity / packageSize));

const formatNorwegianQuantity = (quantity: number, unit: ShoppingListItem["unit"]) => {
  if (unit === "kg") {
    return `${quantity.toLocaleString("nb-NO", { maximumFractionDigits: 1 })} kg`;
  }

  return `${quantity.toLocaleString("nb-NO", { maximumFractionDigits: 0 })} ${unit}`;
};

export const roundToNaturalShoppingQuantity = (
  rawQuantity: number,
  ingredient: Ingredient
): Pick<ShoppingListItem, "quantity" | "unit" | "displayQuantity" | "packageCount"> => {
  const packageCount = getPackageCount(rawQuantity, ingredient.packageSize);
  const packagedQuantity = packageCount * ingredient.packageSize;

  if (ingredient.unit === "g" && packagedQuantity >= 1000) {
    const kgQuantity = packagedQuantity / 1000;
    return {
      quantity: kgQuantity,
      unit: "kg",
      displayQuantity: formatNorwegianQuantity(kgQuantity, "kg"),
      packageCount
    };
  }

  return {
    quantity: packagedQuantity,
    unit: ingredient.unit,
    displayQuantity: formatNorwegianQuantity(packagedQuantity, ingredient.unit),
    packageCount
  };
};

const sortShoppingItems = (a: ShoppingListItem, b: ShoppingListItem) => {
  if (a.alreadyHave !== b.alreadyHave) {
    return a.alreadyHave ? 1 : -1;
  }

  return a.name.localeCompare(b.name, "nb-NO");
};

export const buildShoppingList = (
  meals: PlannedMeal[],
  ingredients: Ingredient[],
  preference: BudgetPreference
): ShoppingList => {
  const scale = getHouseholdScale(preference.householdSize);
  const items = aggregateIngredients(meals).map((item) => {
    const ingredient = getIngredientById(ingredients, item.ingredientId);
    const roundedQuantity = roundToNaturalShoppingQuantity(item.quantity * scale, ingredient);
    const alreadyHave = preference.pantryIngredientIds.includes(ingredient.id);
    const packagePrice = priceIngredientPackages(
      ingredient,
      roundedQuantity.packageCount,
      preference.preferredStore,
      alreadyHave
    );

    return {
      ingredientId: ingredient.id,
      name: ingredient.name,
      group: getShoppingGroup(ingredient),
      ...roundedQuantity,
      bestStore: preference.preferredStore,
      estimatedPriceNok: packagePrice.finalPriceNok,
      pantryReductionNok: packagePrice.pantryReductionNok,
      totalPriceBeforePantryNok: packagePrice.storeAdjustedPriceNok,
      alreadyHave
    };
  });

  const groups: ShoppingListGroup[] = groupOrder
    .map((group) => ({
      group,
      items: items.filter((item) => item.group === group).sort(sortShoppingItems)
    }))
    .filter((group) => group.items.length > 0);

  return {
    basketTotalNok: roundNok(items.reduce((total, item) => total + item.estimatedPriceNok, 0)),
    groups,
    pantrySavingsNok: roundNok(items.reduce((total, item) => total + item.pantryReductionNok, 0)),
    totalItems: items.length,
    totalItemsToBuy: items.filter((item) => !item.alreadyHave).length,
    totalBeforePantryNok: roundNok(items.reduce((total, item) => total + item.totalPriceBeforePantryNok, 0))
  };
};
