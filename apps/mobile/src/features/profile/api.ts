import {
  ORDER_STATUS,
  profileUpdateSchema,
  type AppNotification,
  type CustomerNotificationPrefs,
  type ProfileUpdateInput,
  type UserProfile,
} from "@relife/shared";

import { data, db, fn, mockRequest } from "@/lib/mock";

// FC6 data access. Backed by the mock API.
// TODO(S8): read/write `users/{uid}` (profile fields only), notifications from FCM history,
// and call `deleteAccount` for A31.

export function getProfile(): Promise<UserProfile> {
  return mockRequest(() => db.customer, 200);
}

export function updateProfile(input: ProfileUpdateInput): Promise<UserProfile> {
  const payload = profileUpdateSchema.parse(input);
  return mockRequest(() => {
    db.customer.name = payload.name;
    db.customer.email = payload.email;
    return db.customer;
  }, 500);
}

export function updateNotificationPrefs(patch: Partial<CustomerNotificationPrefs>): Promise<CustomerNotificationPrefs> {
  return mockRequest(() => {
    // Order and payment notifications always stay on so a pickup code is never missed.
    db.customer.notificationPrefs = { ...db.customer.notificationPrefs, ...patch, orders: true };
    return db.customer.notificationPrefs;
  }, 200);
}

export function getNotifications(): Promise<AppNotification[]> {
  return mockRequest(() => [...db.notifications].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
}

export function markAllNotificationsRead(): Promise<void> {
  return mockRequest(() => {
    db.notifications.forEach((n) => (n.read = true));
  }, 200);
}

export function markNotificationRead(id: string): Promise<void> {
  return mockRequest(() => {
    const n = db.notifications.find((x) => x.id === id);
    if (n) n.read = true;
  }, 100);
}

export function getUpcomingOrderCount(): Promise<number> {
  return mockRequest(() => db.orders.filter((o) => o.customerId === data.ME_CUSTOMER_ID && o.status === ORDER_STATUS.PAID).length, 150);
}

export function deleteAccount(): Promise<{ ok: boolean }> {
  return mockRequest(() => fn.deleteAccount(), 700);
}

export const helpContent = { faq: data.FAQ, legal: data.LEGAL_DOCS, version: data.APP_VERSION_LABEL };
