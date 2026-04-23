/** Fixed ECB-style display rate (product prices from Strapi are in EUR). */
export const EUR_TO_BGN = 1.95583;

export function priceEurToBgn(eur: number): number {
  return eur * EUR_TO_BGN;
}

export function formatPriceEur(eur: number): string {
  return `${eur.toLocaleString("bg-BG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`;
}

/** Approximate BGN equivalent for display. */
export function formatPriceBgnFromEur(eur: number): string {
  return `${priceEurToBgn(eur).toLocaleString("bg-BG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} лв.`;
}
