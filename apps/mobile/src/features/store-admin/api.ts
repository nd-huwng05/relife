import {
  BAG_STATUS,
  ORDER_STATUS,
  STORE_STATUS,
  inviteStaffSchema,
  isSameVnDay,
  payoutAccountSchema,
  type InviteStaffInput,
  type Order,
  type PayoutAccountInput,
  type RevenueReport,
  type Review,
  type StaffMember,
  type Store,
  type StoreApplication,
  type StoreNotificationPrefs,
  type StoreStatus,
  type StoreSummary,
} from "@relife/shared";

import { now } from "@/lib/clock";
import { data, db, fn, mockRequest } from "@/lib/mock";

// FS1 (store onboarding and home) and FS4 (money and management). Backed by the mock API.
// TODO(S2/S7): `storeApplications/{uid}`, `stats`, `payouts`, `reviews`, `stores/{id}/private/payout`
// and the `inviteStaff` Function.

const myStore = () => db.stores.find((s) => s.id === data.MY_STORE_ID) as Store;

export function getApplication(): Promise<StoreApplication> {
  return mockRequest(() => db.application, 200);
}

export function submitApplication(): Promise<StoreApplication> {
  return mockRequest(() => fn.submitStoreApplication(), 800);
}

/** Dev only: lets you see B02, B03 and the approved store without an admin app. */
export function devSetApplicationStatus(status: StoreStatus): Promise<StoreApplication> {
  return mockRequest(() => {
    db.application.status = status;
    if (status === STORE_STATUS.REJECTED) db.application.sections.forEach((s) => (s.needsFix = s.key === "documents"));
    return db.application;
  }, 200);
}

export interface StoreHome extends StoreSummary {
  storeName: string;
  arriving: Order[];
}

export function getStoreHome(): Promise<StoreHome> {
  return mockRequest(() => {
    const t = now();
    const bags = db.bags.filter((b) => b.storeId === data.MY_STORE_ID && isSameVnDay(b.pickupStart, t.toISOString()));
    const live = bags.filter((b) => b.status === BAG_STATUS.LIVE || b.status === BAG_STATUS.SOLD_OUT || b.status === BAG_STATUS.PAUSED);
    const orders = db.orders.filter((o) => o.storeId === data.MY_STORE_ID && isSameVnDay(o.pickupStart, t.toISOString()));
    const paidToday = orders.filter((o) => o.status === ORDER_STATUS.PAID || o.status === ORDER_STATUS.COLLECTED || o.status === ORDER_STATUS.NO_SHOW);
    const waiting = orders
      .filter((o) => o.status === ORDER_STATUS.PAID)
      .sort((a, b) => (a.plannedArrival ?? a.pickupStart).localeCompare(b.plannedArrival ?? b.pickupStart));
    const firstStart = [...live].sort((a, b) => a.pickupStart.localeCompare(b.pickupStart))[0]?.pickupStart;
    return {
      storeId: data.MY_STORE_ID,
      storeName: myStore().name,
      ownerFirstName: data.STORE_OWNER.firstName,
      soldToday: live.reduce((n, b) => n + b.sold, 0),
      stockToday: live.reduce((n, b) => n + b.stock, 0),
      waitingPickup: waiting.length,
      revenueToday: paidToday.reduce((n, o) => n + o.amount, 0),
      postedToday: live.length > 0,
      firstPickupStart: firstStart ?? "",
      yesterdayNote: data.YESTERDAY_NOTE,
      arriving: waiting.slice(0, 3),
    };
  });
}

export function getRevenue(period: RevenueReport["period"]): Promise<RevenueReport> {
  return mockRequest(() => ({ period, ...data.revenueReports[period] }), 250);
}

export function getPayouts() {
  return mockRequest(() => ({
    ...db.payouts,
    bankLabel: `${db.payoutAccount.bankName} ••${db.payoutAccount.accountNumber.slice(-4)}`,
  }));
}

export function getPayoutAccount() {
  return mockRequest(() => db.payoutAccount, 200);
}

export function savePayoutAccount(input: PayoutAccountInput) {
  const payload = payoutAccountSchema.parse(input);
  return mockRequest(() => fn.savePayoutAccount(payload), 700);
}

export const payoutOptions = { banks: data.BANKS, commissionPercent: data.COMMISSION_PERCENT };

export interface StoreSettings {
  store: Store;
  staffCount: number;
  payoutLabel: string;
  hoursLabel: string;
}

export function getStoreSettings(): Promise<StoreSettings> {
  return mockRequest(() => ({
    store: myStore(),
    staffCount: db.staff.length,
    payoutLabel: `${db.payoutAccount.bankName === "Vietcombank" ? "VCB" : db.payoutAccount.bankName} ••${db.payoutAccount.accountNumber.slice(-4)}`,
    hoursLabel: "7 ngày",
  }));
}

export function setTemporarilyClosed(closed: boolean) {
  return mockRequest(() => fn.setStoreClosed(closed), 300);
}

export function getStorePrefs(): Promise<StoreNotificationPrefs> {
  return mockRequest(() => db.storePrefs, 150);
}

export function updateStorePrefs(patch: Partial<StoreNotificationPrefs>): Promise<StoreNotificationPrefs> {
  return mockRequest(() => {
    db.storePrefs = { ...db.storePrefs, ...patch };
    return db.storePrefs;
  }, 150);
}

export function getReviews(): Promise<{ summary: typeof data.reviewSummary; reviews: Review[] }> {
  return mockRequest(() => ({ summary: data.reviewSummary, reviews: db.reviews.filter((r) => r.storeId === data.MY_STORE_ID) }));
}

export function replyReview(input: { reviewId: string; text: string }) {
  return mockRequest(() => fn.replyReview(input.reviewId, input.text.trim()), 400);
}

export function getStaff(): Promise<StaffMember[]> {
  return mockRequest(() => db.staff);
}

export function inviteStaff(input: InviteStaffInput): Promise<StaffMember> {
  const payload = inviteStaffSchema.parse(input);
  return mockRequest(() => {
    const member: StaffMember = { id: `st${Date.now()}`, name: "Lời mời đã gửi", phone: payload.phone, role: payload.role, isMe: false };
    db.staff.push(member);
    return member;
  }, 600);
}

export const storeContent = {
  registrationSteps: data.REGISTRATION_STEPS,
  guides: data.STORE_GUIDES,
  training: data.TRAINING_CARDS,
  pickupWindows: data.PICKUP_WINDOWS,
};
