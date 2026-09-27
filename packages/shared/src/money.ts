/** Money is always an integer amount of VND (đồng). Never use floats. */
export type Vnd = number;

const vndFormatter = new Intl.NumberFormat("vi-VN");

/** 45000 → "45.000 ₫" */
export function formatVnd(amount: Vnd): string {
  return `${vndFormatter.format(amount)} ₫`;
}

export function isValidVnd(amount: number): amount is Vnd {
  return Number.isSafeInteger(amount) && amount >= 0;
}
