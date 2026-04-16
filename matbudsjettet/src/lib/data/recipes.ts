import { ingredients } from "@/lib/data/ingredients";
import { getHouseholdMultiplier } from "@/lib/engines/pricingEngine";
import type { HouseholdSize, Ingredient, PlannedMeal, RecipeDefinition } from "@/types/domain";

const tacoFridayRecipe: RecipeDefinition = {
  title: "Taco fredag",
  timeMinutes: 25,
  ingredients: [
    "1.1 kg karbonadedeig",
    "3 pk tortillalefser",
    "1 stk hodekål",
    "800 g gulrøtter",
    "3 bokser hakkede tomater",
    "3 beger rømme",
    "400 g revet ost"
  ],
  steps: [
    "Stek karbonadedeig i panne på middels varme i 5-7 minutter, og bruk en stekespade til å dele kjøttet i små biter underveis.",
    "Snitt kål fint og riv gulrøtter grovt. La grønnsakene ligge klare i en bolle så de holder seg sprø.",
    "Varm tortillalefser raskt i tørr panne i ca. 20 sekunder per side, eller 3-4 minutter i ovn på 180°C under folie.",
    "Fyll lefsene med kjøtt, grønnsaker, rømme og ost. Server med en gang mens lefsene fortsatt er myke og varme."
  ],
  notes: ["Tips: Sett frem alt på bordet, så kan alle fylle sine egne lefser."]
};

export const getRecipeDefinition = (meal: PlannedMeal, householdSize: HouseholdSize): RecipeDefinition => {
  if (meal.name.includes("Taco fredag")) {
    return tacoFridayRecipe;
  }

  return {
    title: meal.name,
    timeMinutes: meal.prepTimeMinutes,
    ingredients: meal.ingredients
      .map((item) => {
        const ingredient = ingredients.find((candidate) => candidate.id === item.ingredientId);

        if (!ingredient) {
          return null;
        }

        const quantity = item.quantity * getHouseholdMultiplier(householdSize);

        return `${formatIngredientQuantity(quantity, ingredient)} ${ingredient.name.toLowerCase()}`;
      })
      .filter((item): item is string => item !== null),
    steps: meal.instructions.slice(0, 5).map((step) => step.trim()),
    notes: meal.savingsNote ? [`Tips: ${meal.savingsNote}`] : undefined
  };
};

const formatIngredientQuantity = (quantity: number, ingredient: Ingredient) => {
  if (ingredient.unit === "g") {
    if (quantity >= 1000) {
      const kilograms = Math.round((quantity / 1000) * 10) / 10;
      return `${kilograms} kg`;
    }

    return `${Math.max(50, Math.round(quantity / 50) * 50)} g`;
  }

  return `${Math.max(1, Math.ceil(quantity))} ${ingredient.unit}`;
};
