export const formatNok = (amount: number) =>
  new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: "NOK",
    maximumFractionDigits: 0
  }).format(amount);

export const formatCompactNok = (amount: number) =>
  `${amount.toLocaleString("nb-NO", { maximumFractionDigits: 0 })} kr`;
