/** Money is always an integer amount of VND (đồng). Never use floats. */
export type Vnd = number;

const vndFormatter = new Intl.NumberFormat("vi-VN");

/** 45000 → "45.000đ" (the format used across the Figma designs) */
export function formatVnd(amount: Vnd): string {
  return `${vndFormatter.format(amount)}đ`;
}

/** 45000 → "45k", 2832000 → "2,8tr" for compact stats and map pins. */
export function formatVndShort(amount: Vnd): string {
  if (amount >= 1_000_000) {
    const millions = Math.round(amount / 100_000) / 10;
    return `${String(millions).replace(".", ",")}tr`;
  }
  return `${Math.round(amount / 1000)}k`;
}

/** Discount of `price` against `value`, rounded to a whole percent: 59000 / 180000 → 67 */
export function discountPercent(price: Vnd, value: Vnd): number {
  if (value <= 0 || price >= value) return 0;
  return Math.round((1 - price / value) * 100);
}

export function isValidVnd(amount: number): amount is Vnd {
  return Number.isSafeInteger(amount) && amount >= 0;
}
