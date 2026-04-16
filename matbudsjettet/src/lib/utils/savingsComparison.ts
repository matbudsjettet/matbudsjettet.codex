const coffeePriceNok = 38;
const extraDinnerPriceNok = 160;

const pluralize = (count: number, singular: string, plural: string) => `${count} ${count === 1 ? singular : plural}`;

export const getCoffeeComparisonCount = (savingsNok: number) => Math.max(1, Math.floor(savingsNok / coffeePriceNok));

export const getCoffeeComparisonText = (savingsNok: number) =>
  `Tilsvarer ca. ${pluralize(getCoffeeComparisonCount(savingsNok), "kaffekopp", "kaffekopper")} denne uken`;

export const getSavingsComparisonText = (savingsNok: number) => {
  if (savingsNok >= extraDinnerPriceNok) {
    const extraDinners = Math.max(1, Math.floor(savingsNok / extraDinnerPriceNok));
    return `Nok til ca. ${pluralize(extraDinners, "ekstra middag", "ekstra middager")}`;
  }

  return "";
};
