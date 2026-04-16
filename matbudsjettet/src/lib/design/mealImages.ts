import mealImage1 from "../../../assets/meals/meal-1.png";
import mealImage2 from "../../../assets/meals/meal-2.png";
import mealImage3 from "../../../assets/meals/meal-3.png";
import mealImage4 from "../../../assets/meals/meal-4.png";
import mealImage5 from "../../../assets/meals/meal-5.png";
import mealImage6 from "../../../assets/meals/meal-6.png";
import mealImage7 from "../../../assets/meals/meal-7.png";
import mealImage8 from "../../../assets/meals/meal-8.png";
import mealImage9 from "../../../assets/meals/meal-9.png";
import mealImage10 from "../../../assets/meals/meal-10.png";

const mealImageMap: Record<string, string> = {
  "kyllingform-med-potet-og-gulrot": mealImage1,
  "torsk-med-gulrot-og-potet": mealImage2,
  "fiskekaker-med-rakost": mealImage2,
  "chili-sin-carne": mealImage3,
  "ovnsbakt-laks": mealImage4,
  "laksefilet-med-poteter": mealImage4,
  "spaghetti-bolognese": mealImage5,
  "pasta-med-tomatsaus": mealImage5,
  "kylling-med-ris-og-gronnsaker": mealImage10,
  "taco-fredag": mealImage7,
  "tomatsuppe-med-egg": mealImage8,
  "linsesuppe-med-brod": mealImage8,
  "potetsuppe-med-brod": mealImage8,
  "omelett-med-gronnsaker": mealImage9,
  "pastafrittata-med-brokkoli": mealImage9,
  "pytt-i-panne": mealImage10,
  "kyllingwraps-med-spro-kal": mealImage7,
  "egg-og-brod-med-rakost": mealImage7
};

export const mealImages = [
  mealImage1,
  mealImage2,
  mealImage3,
  mealImage4,
  mealImage5,
  mealImage6,
  mealImage7,
  mealImage8,
  mealImage9,
  mealImage10
];

export function getMealImage(mealId: string, index = 0) {
  return mealImageMap[mealId] ?? mealImages[index % mealImages.length];
}
