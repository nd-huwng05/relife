import {
  BAG_CATEGORY,
  BAG_KIND,
  BAG_STATUS,
  CLAIM_STATUS,
  NOTIFICATION_KIND,
  ORDER_STATUS,
  ORDER_TYPE,
  PAYMENT_METHOD,
  STORE_STATUS,
  USER_ROLE,
  bagSchema,
  bagUpdateSchema,
  cancelOrderSchema,
  createOrderSchema,
  pauseBagSchema,
  payoutAccountSchema,
  pickupCodeSchema,
  repostSchema,
  reviewSchema,
  vnTimeOn,
  type BagInput,
  type BagUpdateInput,
  type CancelOrderInput,
  type Claim,
  type CreateOrderInput,
  type Order,
  type PauseBagInput,
  type PaymentInstructions,
  type PayoutAccountInput,
  type RepostInput,
  type ReviewInput,
  type ScanResult,
  type UserRole,
} from "@relife/shared";

import { now } from "../clock";
import { MOCK_WEBHOOK_DELAY_MS } from "./config";
import { MY_STORE_ID } from "./data/stores";
import { ME_CUSTOMER_ID } from "./data/orders";
import { DEMO_ACCOUNTS, DEMO_OTP } from "./data/users";
import { db } from "./db";
import { ApiError, newId, randomCode } from "./request";

// Fake Cloud Functions (Notion BE2). They apply the same business rules the real Functions
// will: validate with the shared Zod schema, reserve stock in a "transaction", and only
// the payment webhook sets an order to `paid`.

const HOLD_MINUTES = 15;
const NO_SHOW_GRACE_MINUTES = 15;
const FREE_CANCEL_UNTIL = "18:00";

function parse<T>(schema: { safeParse: (v: unknown) => { success: true; data: T } | { success: false; error: { issues: { message: string }[] } } }, input: unknown): T {
  const res = schema.safeParse(input);
  if (!res.success) throw new ApiError("invalid-argument", res.error.issues[0]?.message ?? "Dữ liệu chưa hợp lệ");
  return res.data;
}

function once<T>(key: string, run: () => T): T {
  if (db.idempotency.has(key)) return db.idempotency.get(key) as T;
  const result = run();
  db.idempotency.set(key, result);
  return result;
}

function findOrder(orderId: string): Order {
  const order = db.orders.find((o) => o.id === orderId);
  if (!order) throw new ApiError("not-found", "Không tìm thấy đơn");
  return order;
}

const minutesAgo = (iso: string) => (now().getTime() - new Date(iso).getTime()) / 60000;

// ---------- Auth (FC1) ----------

export const auth = {
  sendOtp(phone: string) {
    return { sentTo: phone, resendInSeconds: 42 };
  },
  /** A demo account signs straight in; any other number is a new user who sets up a profile. */
  verifyOtp(phone: string | null, code: string): { isNewUser: true } | { isNewUser: false; userId: string; role: UserRole } {
    if (!/^\d{6}$/.test(code)) throw new ApiError("invalid-argument", "Mã gồm 6 chữ số");
    const account = DEMO_ACCOUNTS.find((a) => a.phone === phone);
    if (!account) return { isNewUser: true };
    if (code !== DEMO_OTP) throw new ApiError("permission-denied", "Mã chưa đúng. Kiểm tra lại tin nhắn.");
    return { isNewUser: false, userId: account.userId, role: account.role };
  },
  signInWithGoogle() {
    return { isNewUser: true, suggestedName: db.customer.name };
  },
  completeProfile(input: { name: string; role: UserRole }) {
    db.customer.name = input.name;
    db.customer.role = input.role;
    // A new store owner starts with an empty application (B01).
    if (input.role === USER_ROLE.STORE) db.application.status = STORE_STATUS.DRAFT;
    return { role: input.role };
  },
};

// ---------- Orders and payment (FC4, FC5) ----------

/** Expire holds older than 15 minutes and return their stock (Function `expireHolds`). */
export function expireHolds() {
  for (const order of db.orders) {
    if (order.status === ORDER_STATUS.HELD && !order.transferReportedAt && new Date(order.holdExpiresAt) < now()) {
      order.status = ORDER_STATUS.EXPIRED;
      const bag = db.bags.find((b) => b.id === order.bagId);
      if (bag) bag.sold = Math.max(0, bag.sold - order.qty);
    }
  }
}

export function createOrder(input: CreateOrderInput): Order {
  const data = parse(createOrderSchema, input);
  return once(data.idempotencyKey, () => {
    const bag = db.bags.find((b) => b.id === data.bagId);
    if (!bag || bag.status !== BAG_STATUS.LIVE) throw new ApiError("not-found", "Túi này không còn bán");
    if (new Date(bag.pickupEnd) < now()) throw new ApiError("failed-precondition", "Đã hết giờ nhận túi này");
    if (data.qty > bag.maxPerCustomer) throw new ApiError("invalid-argument", `Tối đa ${bag.maxPerCustomer} túi mỗi người`);
    const left = bag.stock - bag.sold;
    if (left < data.qty) throw new ApiError("resource-exhausted", left === 0 ? "Túi đã hết" : `Chỉ còn ${left} túi`);

    bag.sold += data.qty;
    if (bag.sold >= bag.stock) bag.status = BAG_STATUS.SOLD_OUT;
    const store = db.stores.find((s) => s.id === bag.storeId);
    const code = randomCode(6);
    const createdAt = now().toISOString();
    const order: Order = {
      id: newId("o"),
      code: `RLF-${randomCode(6)}`,
      type: ORDER_TYPE.CUSTOMER,
      customerId: ME_CUSTOMER_ID,
      customerName: db.customer.name.split(" ").pop() ?? db.customer.name,
      customerVisitCount: 1,
      bagId: bag.id,
      bagTitle: bag.title,
      bagPhoto: bag.photos[0] ?? "pastry",
      storeId: bag.storeId,
      storeName: bag.storeName,
      storeAddress: bag.storeAddress,
      storeDistanceKm: store?.distanceKm ?? 0,
      qty: data.qty,
      unitPrice: bag.price,
      amount: bag.price * data.qty,
      status: ORDER_STATUS.HELD,
      paymentMethod: PAYMENT_METHOD.VIETQR,
      bankName: null,
      holdExpiresAt: new Date(now().getTime() + HOLD_MINUTES * 60000).toISOString(),
      pickupCode: code,
      pickupStart: bag.pickupStart,
      pickupEnd: bag.pickupEnd,
      plannedArrival: null,
      createdAt,
      transferReportedAt: null,
      paidAt: null,
      collectedAt: null,
      cancelledAt: null,
      refundAmount: null,
      reviewed: false,
      idempotencyKey: data.idempotencyKey,
    };
    db.orders.unshift(order);
    return order;
  });
}

export function createPayment(orderId: string): PaymentInstructions {
  const order = findOrder(orderId);
  if (order.status !== ORDER_STATUS.HELD) throw new ApiError("failed-precondition", "Đơn không còn chờ thanh toán");
  const note = order.code.replace("-", " ");
  return {
    orderId,
    amount: order.amount,
    bankName: "MB Bank",
    accountNumber: "0123456789",
    transferNote: note,
    qrPayload: `00020101021238570010A00000072701270006970422011301234567890208QRIBFTTA53037045406${order.amount}5802VN62${note}`,
    holdExpiresAt: order.holdExpiresAt,
  };
}

/** Simulates the gateway calling `paymentWebhook` a few seconds after the transfer. */
function scheduleWebhook(orderId: string) {
  setTimeout(() => {
    const order = db.orders.find((o) => o.id === orderId);
    if (!order || order.status !== ORDER_STATUS.HELD) return;
    const lateBy = now().getTime() - new Date(order.holdExpiresAt).getTime();
    if (lateBy > 0) {
      // Money arrived after the hold closed: refund it.
      order.status = ORDER_STATUS.REFUNDING;
      order.refundAmount = order.amount;
      return;
    }
    order.status = ORDER_STATUS.PAID;
    order.paidAt = now().toISOString();
    order.bankName = "MB Bank";
    db.notifications.unshift({
      id: newId("n"),
      kind: NOTIFICATION_KIND.PICKUP,
      title: "Túi bánh sẵn sàng",
      body: `${order.storeName} đang chờ bạn. Mở mã nhận bánh.`,
      createdAt: now().toISOString(),
      read: false,
      link: `/pickup/${order.id}`,
    });
  }, MOCK_WEBHOOK_DELAY_MS);
}

export function reportTransfer(orderId: string): Order {
  const order = findOrder(orderId);
  if (order.status !== ORDER_STATUS.HELD) return order;
  order.transferReportedAt ??= now().toISOString();
  scheduleWebhook(orderId);
  return order;
}

export function cancelHold(orderId: string): Order {
  const order = findOrder(orderId);
  if (order.status === ORDER_STATUS.HELD) {
    order.status = ORDER_STATUS.CANCELLED;
    order.cancelledAt = now().toISOString();
    const bag = db.bags.find((b) => b.id === order.bagId);
    if (bag) {
      bag.sold = Math.max(0, bag.sold - order.qty);
      if (bag.status === BAG_STATUS.SOLD_OUT) bag.status = BAG_STATUS.LIVE;
    }
  }
  return order;
}

/** Refund amount if the customer cancels now (Notion: 100% before 18:00, none after). */
export function refundIfCancelledNow(order: Order): number {
  const cutoff = vnTimeOn(new Date(order.pickupStart), FREE_CANCEL_UNTIL);
  return now() < new Date(cutoff) ? order.amount : 0;
}

export function cancelOrder(input: CancelOrderInput): Order {
  const data = parse(cancelOrderSchema, input);
  const order = findOrder(data.orderId);
  if (order.status === ORDER_STATUS.HELD) return cancelHold(order.id);
  if (order.status !== ORDER_STATUS.PAID) throw new ApiError("failed-precondition", "Đơn này không thể huỷ");
  const refund = refundIfCancelledNow(order);
  order.status = refund > 0 ? ORDER_STATUS.REFUNDING : ORDER_STATUS.CANCELLED;
  order.refundAmount = refund;
  order.cancelledAt = now().toISOString();
  const bag = db.bags.find((b) => b.id === order.bagId);
  if (bag) bag.sold = Math.max(0, bag.sold - order.qty);
  return order;
}

export function submitReview(input: ReviewInput) {
  const data = parse(reviewSchema, input);
  const order = findOrder(data.orderId);
  if (order.status !== ORDER_STATUS.COLLECTED) throw new ApiError("failed-precondition", "Chỉ đánh giá được đơn đã nhận");
  if (order.reviewed) throw new ApiError("failed-precondition", "Bạn đã đánh giá đơn này");
  order.reviewed = true;
  db.reviews.unshift({
    id: newId("r"),
    orderId: order.id,
    storeId: order.storeId,
    customerName: order.customerName,
    rating: data.rating,
    tags: data.tags,
    text: data.text,
    createdAt: now().toISOString(),
    reply: null,
  });
  return { ok: true };
}

export function deleteAccount() {
  const upcoming = db.orders.filter((o) => o.customerId === ME_CUSTOMER_ID && o.status === ORDER_STATUS.PAID);
  if (upcoming.length > 0) throw new ApiError("failed-precondition", "Bạn còn đơn sắp tới. Hãy nhận bánh hoặc huỷ đơn trước.");
  return { ok: true };
}

// ---------- Store and catalog (FS2, FS3) ----------

export function publishBag(input: BagInput) {
  const data = parse(bagSchema, input);
  return once(data.idempotencyKey, () => {
    const store = db.stores.find((s) => s.id === MY_STORE_ID);
    if (!store) throw new ApiError("not-found", "Không tìm thấy tiệm");
    const base = now();
    const bag = {
      id: newId("b"),
      storeId: store.id,
      storeName: store.name,
      storeAddress: store.address,
      title: data.title,
      kind: BAG_KIND.SURPRISE,
      category: BAG_CATEGORY.MIXED,
      categoryLabel: "Bánh ngọt & bánh mì",
      description: "Nội dung túi là bất ngờ. Tiệm chọn từ các loại bánh còn lại trong ngày.",
      price: data.price,
      value: data.value,
      stock: data.stock,
      sold: 0,
      maxPerCustomer: data.maxPerCustomer,
      pickupStart: vnTimeOn(base, data.pickupStart),
      pickupEnd: vnTimeOn(base, data.pickupEnd),
      photos: [data.photo],
      allergens: data.allergens.map((a) => a.toLowerCase()),
      status: BAG_STATUS.LIVE,
      geohash: store.geohash,
      searchKeys: data.title.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").split(/\s+/),
      paidOrders: 0,
      storeRating: store.rating,
      storeReviewCount: store.reviewCount,
      distanceKm: store.distanceKm,
    };
    db.bags.unshift(bag);
    return bag;
  });
}

export function updateBag(input: BagUpdateInput) {
  const data = parse(bagUpdateSchema, input);
  const bag = db.bags.find((b) => b.id === data.bagId);
  if (!bag) throw new ApiError("not-found", "Không tìm thấy túi");
  if (data.stock < bag.sold) throw new ApiError("failed-precondition", `Đã bán ${bag.sold}, không thể giảm dưới ${bag.sold}`);
  // Price is locked after the first paid order.
  if (data.price !== undefined && bag.paidOrders === 0) bag.price = data.price;
  bag.stock = data.stock;
  bag.pickupStart = vnTimeOn(new Date(bag.pickupStart), data.pickupStart);
  bag.pickupEnd = vnTimeOn(new Date(bag.pickupEnd), data.pickupEnd);
  if (bag.status === BAG_STATUS.SOLD_OUT && bag.stock > bag.sold) bag.status = BAG_STATUS.LIVE;
  return bag;
}

export function pauseBag(input: PauseBagInput) {
  const data = parse(pauseBagSchema, input);
  const bag = db.bags.find((b) => b.id === data.bagId);
  if (!bag) throw new ApiError("not-found", "Không tìm thấy túi");
  bag.status = BAG_STATUS.PAUSED;
  if (data.paidOrders === "refund") {
    for (const o of db.orders) {
      if (o.bagId === bag.id && o.status === ORDER_STATUS.PAID) {
        o.status = ORDER_STATUS.REFUNDING;
        o.refundAmount = o.amount;
        o.cancelledAt = now().toISOString();
      }
    }
  }
  return bag;
}

export function resumeBag(bagId: string) {
  const bag = db.bags.find((b) => b.id === bagId);
  if (!bag) throw new ApiError("not-found", "Không tìm thấy túi");
  bag.status = bag.sold >= bag.stock ? BAG_STATUS.SOLD_OUT : BAG_STATUS.LIVE;
  return bag;
}

export function repostTemplates(input: RepostInput) {
  const data = parse(repostSchema, input);
  return once(data.idempotencyKey, () => {
    const posted = data.items.map((item) => {
      const t = db.templates.find((x) => x.id === item.templateId);
      if (!t) throw new ApiError("not-found", "Không tìm thấy mẫu túi");
      t.postedToday = true;
      return publishBag({
        title: t.title,
        price: t.price,
        value: t.value,
        stock: item.stock,
        maxPerCustomer: 2,
        pickupStart: t.pickupStart,
        pickupEnd: t.pickupEnd,
        allergens: ["gluten", "sữa", "trứng"],
        photo: t.photo,
        idempotencyKey: `${data.idempotencyKey}-${t.id}`,
      });
    });
    return { count: posted.length };
  });
}

/** `redeemPickup`: checks the code belongs to this store, the window, and that it is unused. */
export function redeemPickup(rawCode: string, source: "scan" | "manual"): ScanResult {
  const parsed = pickupCodeSchema.safeParse(rawCode);
  const recent = db.codeAttempts.filter((t) => now().getTime() - t < 10 * 60000);
  db.codeAttempts = recent;
  if (source === "manual" && recent.length >= 5) {
    throw new ApiError("resource-exhausted", "Đã thử quá nhiều lần. Thử lại sau 10 phút.");
  }
  const fail = (reason: Extract<ScanResult, { ok: false }>["reason"], usedAt?: string): ScanResult => {
    if (source === "manual") db.codeAttempts.push(now().getTime());
    return { ok: false, reason, usedAt, attemptsLeft: Math.max(0, 4 - recent.length) };
  };
  if (!parsed.success) return fail("not_found");
  const order = db.orders.find((o) => o.pickupCode === parsed.data);
  if (!order) return fail("not_found");
  if (order.storeId !== MY_STORE_ID) return fail("other_store");
  if (order.status === ORDER_STATUS.COLLECTED) return fail("already_used", order.collectedAt ?? undefined);
  if (order.status === ORDER_STATUS.CANCELLED || order.status === ORDER_STATUS.REFUNDING || order.status === ORDER_STATUS.REFUNDED) {
    return fail("cancelled");
  }
  if (order.status !== ORDER_STATUS.PAID) return fail("not_found");
  const t = now();
  if (t < new Date(new Date(order.pickupStart).getTime() - 30 * 60000)) return fail("too_early");
  if (t > new Date(new Date(order.pickupEnd).getTime() + NO_SHOW_GRACE_MINUTES * 60000)) return fail("window_closed");
  order.status = ORDER_STATUS.COLLECTED;
  order.collectedAt = t.toISOString();
  return { ok: true, order };
}

export function markNoShow(orderId: string): Order {
  const order = findOrder(orderId);
  if (order.status !== ORDER_STATUS.PAID) throw new ApiError("failed-precondition", "Đơn này không thể đánh dấu");
  if (minutesAgo(order.pickupEnd) < NO_SHOW_GRACE_MINUTES) {
    throw new ApiError("failed-precondition", `Chỉ được đánh dấu sau ${NO_SHOW_GRACE_MINUTES} phút ân hạn`);
  }
  order.status = ORDER_STATUS.NO_SHOW;
  return order;
}

export function savePayoutAccount(input: PayoutAccountInput) {
  const data = parse(payoutAccountSchema, input);
  db.payoutAccount = { bankName: data.bankName, accountNumber: data.accountNumber, holderName: data.holderName };
  return db.payoutAccount;
}

export function setStoreClosed(closed: boolean) {
  const store = db.stores.find((s) => s.id === MY_STORE_ID);
  if (store) store.temporarilyClosed = closed;
  return { closed };
}

export function submitStoreApplication() {
  db.application.status = STORE_STATUS.PENDING;
  db.application.submittedAt = now().toISOString();
  for (const s of db.application.sections) s.needsFix = false;
  return db.application;
}

export function replyReview(reviewId: string, text: string) {
  const review = db.reviews.find((r) => r.id === reviewId);
  if (!review) throw new ApiError("not-found", "Không tìm thấy đánh giá");
  review.reply = { text, createdAt: now().toISOString() };
  return review;
}

// ---------- Charity (FH1, FH2) ----------

export function claimSurplus(surplusId: string, units: number): Claim {
  const item = db.surplus.find((s) => s.id === surplusId);
  if (!item) throw new ApiError("not-found", "Nguồn này không còn");
  if (db.charity.claimsLeftToday <= 0) throw new ApiError("resource-exhausted", "Đã hết lượt nhận hôm nay");
  if (units < 1 || units > item.unitsLeft) throw new ApiError("resource-exhausted", `Chỉ còn ${item.unitsLeft} phần`);
  item.unitsLeft -= units;
  db.charity.claimsLeftToday -= 1;
  const claim: Claim = {
    id: newId("cl"),
    surplusId,
    storeName: item.storeName,
    units,
    status: CLAIM_STATUS.READY,
    code: randomCode(6),
    pickupStart: item.pickupStart,
    pickupEnd: item.pickupEnd,
    createdAt: now().toISOString(),
  };
  db.claims.unshift(claim);
  return claim;
}

// The seeded order "o2" already reported a transfer, so let its webhook arrive too.
scheduleWebhook("o2");
