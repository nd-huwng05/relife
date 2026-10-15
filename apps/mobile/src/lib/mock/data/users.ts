import { NOTIFICATION_KIND, USER_ROLE, vnTimeOn, type AppNotification, type UserProfile } from "@relife/shared";

import { ME_CUSTOMER_ID } from "./orders";

// Fake `users/{uid}` for the demo customer.
export const customerProfile: UserProfile = {
  id: ME_CUSTOMER_ID,
  name: "Hưng Nguyễn",
  phone: "912345678",
  phoneVerified: true,
  email: "hung.nguyen@gmail.com",
  avatar: null,
  role: USER_ROLE.CUSTOMER,
  areaLabel: "Cầu Giấy, Hà Nội",
  impact: { bagsSaved: 7, foodKg: 4.2, moneySaved: 812000 },
  notificationPrefs: {
    orders: true,
    pickupReminder: true,
    followedStores: true,
    nearbyDeals: false,
    reviewReminder: true,
    news: false,
  },
  followingStoreIds: ["s1", "s2", "s3"],
  savedBagIds: ["b1", "b6"],
};

/** Total bags rescued across Relife today, shown in the Discover banner. */
export const PLATFORM_BAGS_SAVED_TODAY = 1248;

export function seedCustomerNotifications(base: Date): AppNotification[] {
  return [
    {
      id: "n1", kind: NOTIFICATION_KIND.PICKUP, title: "Túi bánh sẵn sàng",
      body: "Maison Bơ Sữa đang chờ bạn tới 20:30. Mở mã nhận bánh.",
      createdAt: vnTimeOn(base, "18:33"), read: false, link: "/pickup/o1",
    },
    {
      id: "n2", kind: NOTIFICATION_KIND.ORDER, title: "Còn 30 phút để nhận",
      body: "Đừng quên ghé Lò Bánh Nhà Mây trước 20:30.",
      createdAt: vnTimeOn(base, "18:20"), read: false, link: "/order/o2",
    },
    {
      id: "n3", kind: NOTIFICATION_KIND.STORE, title: "Tiệm bạn theo dõi vừa đăng túi",
      body: "Tiệm Hạt Dẻ có 4 túi bánh ngọt, nhận 19:00 – 20:00.",
      createdAt: vnTimeOn(base, "17:47"), read: false, link: "/bag/b3",
    },
    {
      id: "n4", kind: NOTIFICATION_KIND.PAYOUT, title: "Đã hoàn tiền 45.000đ",
      body: "Khoản hoàn cho đơn RLF-2H9D3A đã về tài khoản.",
      createdAt: vnTimeOn(base, "10:05", -1), read: true, link: "/order/o4",
    },
    {
      id: "n5", kind: NOTIFICATION_KIND.REVIEW, title: "Túi hôm qua thế nào?",
      body: "Đánh giá Bếp Bánh Mộc để giúp người khác chọn.",
      createdAt: vnTimeOn(base, "09:00", -1), read: true, link: "/order/o3/review",
    },
  ];
}

export const RECENT_SEARCHES = ["croissant", "bánh kem"];

/**
 * Demo sign-in accounts (one per role). Sign in with the phone number and OTP `DEMO_OTP`.
 * Any other phone number signs up as a new user and goes through profile setup (A07).
 * Phones are stored without the leading 0, as `phoneSchema` normalises them.
 */
export const DEMO_OTP = "123456";

export const DEMO_ACCOUNTS = [
  { phone: "912345678", userId: ME_CUSTOMER_ID, role: USER_ROLE.CUSTOMER, name: "Hưng Nguyễn" },
  { phone: "901234567", userId: "st1", role: USER_ROLE.STORE, name: "Mai · Maison Bơ Sữa" },
  { phone: "933333333", userId: "ch1", role: USER_ROLE.CHARITY, name: "Phạm Thu Hà · Bếp ăn Nhân Ái" },
] as const;
