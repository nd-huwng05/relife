export const USER_ROLE = {
  CUSTOMER: "customer",
  STORE: "store",
  CHARITY: "charity",
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
