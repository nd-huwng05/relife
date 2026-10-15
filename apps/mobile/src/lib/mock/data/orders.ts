import { ORDER_STATUS, ORDER_TYPE, PAYMENT_METHOD, vnTimeOn, type Order } from "@relife/shared";

/** The signed-in demo customer. */
export const ME_CUSTOMER_ID = "u1";

type OrderSeed = Omit<
  Order,
  "holdExpiresAt" | "pickupStart" | "pickupEnd" | "createdAt" | "paidAt" | "collectedAt" | "cancelledAt" | "plannedArrival" | "transferReportedAt" | "type" | "idempotencyKey"
> & {
  day: number;
  window: [string, string];
  created: string;
  paid?: string;
  collected?: string;
  cancelled?: string;
  reported?: string;
  arrival?: string;
};

// Fake `orders` collection: the demo customer's orders, then orders placed at the demo store (s1).
const seeds: OrderSeed[] = [
  {
    id: "o1", code: "RLF-8K2Q7M", customerId: ME_CUSTOMER_ID, customerName: "Hưng", customerVisitCount: 3,
    bagId: "b1", bagTitle: "Túi bánh ngọt cuối ngày", bagPhoto: "pastry-box", storeId: "s1", storeName: "Maison Bơ Sữa",
    storeAddress: "12 Trần Thái Tông, Cầu Giấy", storeDistanceKm: 0.8, qty: 1, unitPrice: 59000, amount: 59000,
    status: ORDER_STATUS.PAID, paymentMethod: PAYMENT_METHOD.VIETQR, bankName: "MB Bank", pickupCode: "K7QM4P",
    refundAmount: null, reviewed: false, day: 0, window: ["19:00", "20:30"], created: "18:32", paid: "18:33",
  },
  {
    id: "o2", code: "RLF-3J8A1C", customerId: ME_CUSTOMER_ID, customerName: "Hưng", customerVisitCount: 1,
    bagId: "b2", bagTitle: "Túi bánh mì cuối ngày", bagPhoto: "bread", storeId: "s2", storeName: "Lò Bánh Nhà Mây",
    storeAddress: "45 Xuân Thuỷ, Cầu Giấy", storeDistanceKm: 0.5, qty: 2, unitPrice: 39000, amount: 78000,
    status: ORDER_STATUS.HELD, paymentMethod: PAYMENT_METHOD.VIETQR, bankName: "MB Bank", pickupCode: "P2XW9D",
    refundAmount: null, reviewed: false, day: 0, window: ["19:30", "20:30"], created: "18:50", reported: "18:53",
  },
  {
    id: "o3", code: "RLF-5T1M8B", customerId: ME_CUSTOMER_ID, customerName: "Hưng", customerVisitCount: 2,
    bagId: "b4", bagTitle: "Túi bánh kem mini", bagPhoto: "cake", storeId: "s4", storeName: "Bếp Bánh Mộc",
    storeAddress: "21 Nguyễn Khánh Toàn, Cầu Giấy", storeDistanceKm: 1.2, qty: 1, unitPrice: 35000, amount: 35000,
    status: ORDER_STATUS.COLLECTED, paymentMethod: PAYMENT_METHOD.VIETQR, bankName: "Techcombank", pickupCode: "H4LQ2Z",
    refundAmount: null, reviewed: false, day: -5, window: ["19:00", "20:30"], created: "18:40", paid: "18:41", collected: "20:12",
  },
  {
    id: "o4", code: "RLF-2H9D3A", customerId: ME_CUSTOMER_ID, customerName: "Hưng", customerVisitCount: 1,
    bagId: "b3", bagTitle: "Túi bánh ngọt cuối ngày", bagPhoto: "pastry", storeId: "s3", storeName: "Tiệm Hạt Dẻ",
    storeAddress: "88 Trần Đăng Ninh, Cầu Giấy", storeDistanceKm: 0.4, qty: 1, unitPrice: 45000, amount: 45000,
    status: ORDER_STATUS.REFUNDED, paymentMethod: PAYMENT_METHOD.VIETQR, bankName: "MB Bank", pickupCode: "Z8NV3K",
    refundAmount: 45000, reviewed: false, day: -2, window: ["19:00", "20:00"], created: "16:10", paid: "16:11", cancelled: "17:20",
  },
  {
    id: "o5", code: "RLF-9QW4EX", customerId: ME_CUSTOMER_ID, customerName: "Hưng", customerVisitCount: 4,
    bagId: "b1", bagTitle: "Túi bánh ngọt cuối ngày", bagPhoto: "croissant", storeId: "s1", storeName: "Maison Bơ Sữa",
    storeAddress: "12 Trần Thái Tông, Cầu Giấy", storeDistanceKm: 0.8, qty: 1, unitPrice: 59000, amount: 59000,
    status: ORDER_STATUS.COLLECTED, paymentMethod: PAYMENT_METHOD.VIETQR, bankName: "MB Bank", pickupCode: "M3RT7Y",
    refundAmount: null, reviewed: true, day: -9, window: ["19:00", "20:30"], created: "18:20", paid: "18:21", collected: "19:41",
  },

  // Orders at the demo store s1 (Maison Bơ Sữa) for the store screens.
  {
    id: "o11", code: "RLF-6B2M4P", customerId: "u11", customerName: "Minh", customerVisitCount: 3,
    bagId: "b1", bagTitle: "Bánh ngọt cuối ngày", bagPhoto: "pastry-box", storeId: "s1", storeName: "Maison Bơ Sữa",
    storeAddress: "12 Trần Thái Tông, Cầu Giấy", storeDistanceKm: 0, qty: 1, unitPrice: 59000, amount: 59000,
    status: ORDER_STATUS.PAID, paymentMethod: PAYMENT_METHOD.VIETQR, bankName: "VPBank", pickupCode: "A9C34P",
    refundAmount: null, reviewed: false, day: 0, window: ["19:00", "20:30"], created: "18:02", paid: "18:03", arrival: "19:10",
  },
  {
    id: "o12", code: "RLF-4N7KQ7", customerId: "u12", customerName: "Lan", customerVisitCount: 1,
    bagId: "b1", bagTitle: "Bánh ngọt cuối ngày", bagPhoto: "pastry-box", storeId: "s1", storeName: "Maison Bơ Sữa",
    storeAddress: "12 Trần Thái Tông, Cầu Giấy", storeDistanceKm: 0, qty: 2, unitPrice: 59000, amount: 118000,
    status: ORDER_STATUS.PAID, paymentMethod: PAYMENT_METHOD.VIETQR, bankName: "ACB", pickupCode: "TR82Q7",
    refundAmount: null, reviewed: false, day: 0, window: ["19:00", "20:30"], created: "18:11", paid: "18:12", arrival: "19:25",
  },
  {
    id: "o13", code: "RLF-1P5X2K", customerId: "u13", customerName: "Tuấn", customerVisitCount: 2,
    bagId: "b9", bagTitle: "Bánh mì & sandwich", bagPhoto: "sandwich", storeId: "s1", storeName: "Maison Bơ Sữa",
    storeAddress: "12 Trần Thái Tông, Cầu Giấy", storeDistanceKm: 0, qty: 1, unitPrice: 39000, amount: 39000,
    status: ORDER_STATUS.PAID, paymentMethod: PAYMENT_METHOD.VIETQR, bankName: "Vietcombank", pickupCode: "WD5M2K",
    refundAmount: null, reviewed: false, day: 0, window: ["18:00", "18:30"], created: "17:20", paid: "17:21", arrival: "18:15",
  },
  {
    id: "o14", code: "RLF-8R3V9M", customerId: "u14", customerName: "Hà", customerVisitCount: 5,
    bagId: "b9", bagTitle: "Bánh mì & sandwich", bagPhoto: "sandwich", storeId: "s1", storeName: "Maison Bơ Sữa",
    storeAddress: "12 Trần Thái Tông, Cầu Giấy", storeDistanceKm: 0, qty: 1, unitPrice: 39000, amount: 39000,
    status: ORDER_STATUS.PAID, paymentMethod: PAYMENT_METHOD.VIETQR, bankName: "BIDV", pickupCode: "QJ7H9M",
    refundAmount: null, reviewed: false, day: 0, window: ["19:30", "21:00"], created: "18:30", paid: "18:31", arrival: "20:05",
  },
  {
    id: "o15", code: "RLF-7C1Z5S", customerId: "u15", customerName: "Ngọc", customerVisitCount: 2,
    bagId: "b1", bagTitle: "Bánh ngọt cuối ngày", bagPhoto: "pastry-box", storeId: "s1", storeName: "Maison Bơ Sữa",
    storeAddress: "12 Trần Thái Tông, Cầu Giấy", storeDistanceKm: 0, qty: 1, unitPrice: 59000, amount: 59000,
    status: ORDER_STATUS.COLLECTED, paymentMethod: PAYMENT_METHOD.VIETQR, bankName: "MB Bank", pickupCode: "USED12",
    refundAmount: null, reviewed: false, day: 0, window: ["18:00", "19:00"], created: "17:40", paid: "17:41", collected: "18:12", arrival: "18:10",
  },
  {
    id: "o16", code: "RLF-3K8D2W", customerId: "u16", customerName: "Phong", customerVisitCount: 1,
    bagId: "b6", bagTitle: "Combo bánh mì Pháp", bagPhoto: "baguette", storeId: "s1", storeName: "Maison Bơ Sữa",
    storeAddress: "12 Trần Thái Tông, Cầu Giấy", storeDistanceKm: 0, qty: 2, unitPrice: 49000, amount: 98000,
    status: ORDER_STATUS.COLLECTED, paymentMethod: PAYMENT_METHOD.VIETQR, bankName: "TPBank", pickupCode: "F6Y2LB",
    refundAmount: null, reviewed: false, day: 0, window: ["18:00", "19:00"], created: "17:05", paid: "17:06", collected: "18:31", arrival: "18:30",
  },
  {
    id: "o17", code: "RLF-5V9L1T", customerId: "u17", customerName: "Thảo", customerVisitCount: 1,
    bagId: "b1", bagTitle: "Bánh ngọt cuối ngày", bagPhoto: "pastry-box", storeId: "s1", storeName: "Maison Bơ Sữa",
    storeAddress: "12 Trần Thái Tông, Cầu Giấy", storeDistanceKm: 0, qty: 1, unitPrice: 59000, amount: 59000,
    status: ORDER_STATUS.COLLECTED, paymentMethod: PAYMENT_METHOD.VIETQR, bankName: "MB Bank", pickupCode: "N4E8GX",
    refundAmount: null, reviewed: false, day: 0, window: ["18:00", "19:00"], created: "17:15", paid: "17:16", collected: "18:44", arrival: "18:40",
  },
];

export function seedOrders(base: Date): Order[] {
  return seeds.map(({ day, window, created, paid, collected, cancelled, reported, arrival, ...o }) => {
    const at = (t?: string) => (t ? vnTimeOn(base, t, day) : null);
    const createdAt = vnTimeOn(base, created, day);
    return {
      ...o,
      type: ORDER_TYPE.CUSTOMER,
      idempotencyKey: `seed-${o.id}`,
      pickupStart: vnTimeOn(base, window[0], day),
      pickupEnd: vnTimeOn(base, window[1], day),
      createdAt,
      holdExpiresAt: new Date(new Date(createdAt).getTime() + 15 * 60 * 1000).toISOString(),
      plannedArrival: at(arrival),
      transferReportedAt: at(reported),
      paidAt: at(paid),
      collectedAt: at(collected),
      cancelledAt: at(cancelled),
    };
  });
}
