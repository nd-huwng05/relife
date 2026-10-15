// Status values for Firestore documents (Notion BE1, BE2). Never compare against raw strings.

/** Order lifecycle. Only Cloud Functions move an order between these states. */
export const ORDER_STATUS = {
  /** Stock reserved for 15 minutes while the customer pays. */
  HELD: "held",
  /** Set only by the payment webhook. */
  PAID: "paid",
  COLLECTED: "collected",
  NO_SHOW: "no_show",
  EXPIRED: "expired",
  CANCELLED: "cancelled",
  REFUNDING: "refunding",
  REFUNDED: "refunded",
} as const;
export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const ORDER_TYPE = {
  CUSTOMER: "customer",
  CHARITY: "charity",
} as const;
export type OrderType = (typeof ORDER_TYPE)[keyof typeof ORDER_TYPE];

export const BAG_STATUS = {
  DRAFT: "draft",
  LIVE: "live",
  PAUSED: "paused",
  SOLD_OUT: "sold_out",
  ENDED: "ended",
} as const;
export type BagStatus = (typeof BAG_STATUS)[keyof typeof BAG_STATUS];

export const BAG_KIND = {
  /** Contents chosen by the store at the end of the day. */
  SURPRISE: "surprise",
  /** A single named item. */
  ITEM: "item",
} as const;
export type BagKind = (typeof BAG_KIND)[keyof typeof BAG_KIND];

export const BAG_CATEGORY = {
  BREAD: "bread",
  PASTRY: "pastry",
  CAKE: "cake",
  MIXED: "mixed",
  MEAL: "meal",
} as const;
export type BagCategory = (typeof BAG_CATEGORY)[keyof typeof BAG_CATEGORY];

export const STORE_STATUS = {
  DRAFT: "draft",
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  SUSPENDED: "suspended",
} as const;
export type StoreStatus = (typeof STORE_STATUS)[keyof typeof STORE_STATUS];

export const PAYMENT_METHOD = {
  VIETQR: "vietqr",
  MOMO: "momo",
  ZALOPAY: "zalopay",
} as const;
export type PaymentMethod = (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];

export const PAYOUT_STATUS = {
  OPEN: "open",
  PROCESSING: "processing",
  PAID: "paid",
} as const;
export type PayoutStatus = (typeof PAYOUT_STATUS)[keyof typeof PAYOUT_STATUS];

export const STAFF_ROLE = {
  OWNER: "owner",
  MANAGER: "manager",
  COUNTER: "counter",
} as const;
export type StaffRole = (typeof STAFF_ROLE)[keyof typeof STAFF_ROLE];

export const STORAGE_TYPE = {
  ROOM: "room",
  FRIDGE: "fridge",
  FREEZER: "freezer",
  COLD_VAN: "cold_van",
} as const;
export type StorageType = (typeof STORAGE_TYPE)[keyof typeof STORAGE_TYPE];

export const CLAIM_STATUS = {
  READY: "ready",
  COLLECTED: "collected",
  NO_SHOW: "no_show",
} as const;
export type ClaimStatus = (typeof CLAIM_STATUS)[keyof typeof CLAIM_STATUS];

export const NOTIFICATION_KIND = {
  ORDER: "order",
  PICKUP: "pickup",
  PROMO: "promo",
  STORE: "store",
  REVIEW: "review",
  PAYOUT: "payout",
} as const;
export type NotificationKind = (typeof NOTIFICATION_KIND)[keyof typeof NOTIFICATION_KIND];
