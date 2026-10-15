import {
  ORDER_STATUS,
  cancelOrderSchema,
  isSameVnDay,
  reviewSchema,
  type CancelOrderInput,
  type Order,
  type ReviewInput,
  type ScanResult,
} from "@relife/shared";

import { now } from "@/lib/clock";
import { data, db, fn, mockRequest } from "@/lib/mock";

// FC5 (customer pickup) and FS3 (store scan) data access. Backed by the mock API.
// TODO(S5): orders come from `orders` where customerId == uid (or storeId == claim);
// cancel, redeem and no-show call `cancelOrder`, `redeemPickup` and `markNoShow`.

const PICKUP_PREFIX = "relife:pickup:";

/** Payload encoded in the customer's QR. The real one is signed with HMAC on the server. */
export function pickupQrPayload(order: Order) {
  return `${PICKUP_PREFIX}${order.pickupCode}`;
}

export function getMyOrders(): Promise<Order[]> {
  return mockRequest(() => {
    fn.expireHolds();
    return db.orders.filter((o) => o.customerId === data.ME_CUSTOMER_ID).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  });
}

export function getOrder(orderId: string): Promise<Order & { storePhone: string }> {
  return mockRequest(() => {
    const order = db.orders.find((o) => o.id === orderId);
    if (!order) throw new Error("Không tìm thấy đơn");
    const store = db.stores.find((s) => s.id === order.storeId);
    return { ...order, storePhone: store?.phone ?? "" };
  }, 200);
}

/** Refund the customer would get if they cancelled right now (A23). */
export function getRefundPreview(orderId: string): Promise<number> {
  return mockRequest(() => {
    const order = db.orders.find((o) => o.id === orderId);
    return order ? fn.refundIfCancelledNow(order) : 0;
  }, 150);
}

export function cancelOrder(input: CancelOrderInput): Promise<Order> {
  const payload = cancelOrderSchema.parse(input);
  return mockRequest(() => fn.cancelOrder(payload), 600);
}

export function submitReview(input: ReviewInput) {
  const payload = reviewSchema.parse(input);
  return mockRequest(() => fn.submitReview(payload), 600);
}

// ---------- Store side (FS3) ----------

export interface TodayOrders {
  waiting: Order[];
  collected: Order[];
  noShow: Order[];
}

export function getTodayOrders(): Promise<TodayOrders> {
  return mockRequest(() => {
    const today = db.orders.filter((o) => o.storeId === data.MY_STORE_ID && o.customerId !== data.ME_CUSTOMER_ID && isSameVnDay(o.pickupStart, now().toISOString()));
    const byArrival = (a: Order, b: Order) => (a.plannedArrival ?? a.pickupStart).localeCompare(b.plannedArrival ?? b.pickupStart);
    return {
      waiting: today.filter((o) => o.status === ORDER_STATUS.PAID).sort(byArrival),
      collected: today.filter((o) => o.status === ORDER_STATUS.COLLECTED).sort(byArrival),
      noShow: today.filter((o) => o.status === ORDER_STATUS.NO_SHOW).sort(byArrival),
    };
  });
}

/** Strips the QR prefix so both scanned and typed codes go through the same check. */
export function redeemPickup(raw: string, source: "scan" | "manual"): Promise<ScanResult> {
  const code = raw.startsWith(PICKUP_PREFIX) ? raw.slice(PICKUP_PREFIX.length) : raw;
  return mockRequest(() => fn.redeemPickup(code, source), 500);
}

export function markNoShow(orderId: string): Promise<Order> {
  return mockRequest(() => fn.markNoShow(orderId), 500);
}

/** Minutes of grace after the pickup window before a no-show can be marked (Notion BE2). */
export const NO_SHOW_GRACE_MINUTES = 15;

/** Review tags and labels shown on A24. */
export const reviewOptions = { tags: data.REVIEW_TAGS, ratingLabels: data.RATING_LABELS };
