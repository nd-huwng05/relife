import {
  PAYOUT_STATUS,
  STAFF_ROLE,
  STORE_STATUS,
  vnTimeOn,
  type Payout,
  type PayoutAccount,
  type PayoutLine,
  type RevenueReport,
  type Review,
  type ReviewSummary,
  type StaffMember,
  type StoreApplication,
  type StoreNotificationPrefs,
} from "@relife/shared";

// Fake data for the store role (demo store s1, owner Mai).
export const STORE_OWNER = { firstName: "Mai", fullName: "Nguyễn Thị Mai", phone: "912345678" };

export const YESTERDAY_NOTE = "Hôm qua bạn bán hết 10 túi trong 40 phút.";
export const BAG_LIST_INSIGHT = "7 ngày qua còn dư trung bình 2 túi mỗi tối. Thử đăng 8 túi thay vì 10.";

export function seedApplication(base: Date): StoreApplication {
  return {
    status: STORE_STATUS.APPROVED,
    submittedAt: vnTimeOn(base, "21:14", -3),
    expectedBy: vnTimeOn(base, "18:00", 2),
    rejectReason: "Ảnh Giấy chứng nhận ATTP bị mờ, không đọc được số giấy phép. Vui lòng chụp lại rõ nét, đủ 4 góc.",
    reviewedBy: "Relife Admin",
    reviewedAt: vnTimeOn(base, "10:20", -2),
    sections: [
      { key: "documents", label: "Giấy chứng nhận ATTP", needsFix: true },
      { key: "info", label: "Thông tin tiệm", needsFix: false },
      { key: "location", label: "Vị trí và ghim", needsFix: false },
      { key: "hours", label: "Giờ mở cửa", needsFix: false },
    ],
    address: "12 Trần Thái Tông, Dịch Vọng, Cầu Giấy",
  };
}

export const REGISTRATION_STEPS = ["Thông tin tiệm", "Giấy tờ", "Giờ mở cửa", "Vị trí tiệm", "Tài khoản nhận tiền", "Xem lại"];

export const revenueReports: Record<RevenueReport["period"], Omit<RevenueReport, "period">> = {
  week: {
    label: "TUẦN NÀY · 22 – 28/09",
    total: 2832000,
    changePercent: 18,
    bars: [
      { label: "T2", value: 310 }, { label: "T3", value: 240 }, { label: "T4", value: 400 },
      { label: "T5", value: 350 }, { label: "T6", value: 475 }, { label: "T7", value: 600 }, { label: "CN", value: 20 },
    ],
    insight: "Khung 19:00 – 20:30 bán hết nhanh nhất. Thử đăng sớm hơn 15 phút.",
  },
  month: {
    label: "THÁNG 9 / 2026",
    total: 10950000,
    changePercent: 9,
    bars: [
      { label: "T1", value: 2210 }, { label: "T2", value: 2580 }, { label: "T3", value: 2401 }, { label: "T4", value: 2832 },
    ],
    insight: "Thứ 7 là ngày bán tốt nhất trong tháng, trung bình 12 túi.",
  },
  year: {
    label: "NĂM 2026",
    total: 38400000,
    changePercent: 0,
    bars: [
      { label: "T6", value: 4200 }, { label: "T7", value: 7100 }, { label: "T8", value: 9800 }, { label: "T9", value: 10950 },
    ],
    insight: "Doanh thu tăng đều từ khi tham gia Relife vào tháng 6.",
  },
};

/** Days from `base` to the next Monday in Vietnam time (payouts run every Monday). */
function daysToNextMonday(base: Date): number {
  const vnDay = new Date(base.getTime() + 7 * 3600_000).getUTCDay();
  return ((8 - vnDay) % 7) || 7;
}

export function seedPayouts(base: Date): { holding: number; nextPayoutAt: string; history: Payout[]; lines: PayoutLine[] } {
  const next = daysToNextMonday(base);
  const monday = (weeksAgo: number) => next - 7 * weeksAgo;
  return {
    holding: 2832200,
    nextPayoutAt: vnTimeOn(base, "09:00", next),
    history: [
      { id: "p1", periodStart: vnTimeOn(base, "00:00", monday(1) - 7), periodEnd: vnTimeOn(base, "23:59", monday(1) - 1), paidAt: vnTimeOn(base, "09:00", monday(1)), orderCount: 41, amount: 2401500, status: PAYOUT_STATUS.PAID },
      { id: "p2", periodStart: vnTimeOn(base, "00:00", monday(2) - 7), periodEnd: vnTimeOn(base, "23:59", monday(2) - 1), paidAt: vnTimeOn(base, "09:00", monday(2)), orderCount: 35, amount: 1986000, status: PAYOUT_STATUS.PAID },
    ],
    lines: [
      { orderCode: "RLF-8K2Q7M", date: vnTimeOn(base, "18:33"), description: "Bánh ngọt × 1", amount: 50150 },
      { orderCode: "RLF-3J8A1C", date: vnTimeOn(base, "18:12"), description: "Bánh mì × 2", amount: 66300 },
      { orderCode: "RLF-7H2N6P", date: vnTimeOn(base, "19:40", -1), description: "Hoàn tiền", amount: 0 },
    ],
  };
}

export const payoutAccount: PayoutAccount = {
  bankName: "Vietcombank",
  accountNumber: "0071000458213",
  holderName: "NGUYEN THI MAI",
};

export const BANKS = ["Vietcombank", "MB Bank", "Techcombank", "BIDV", "VPBank", "ACB", "TPBank", "VietinBank"];

/** Relife commission on each sale (Notion: config.commission). */
export const COMMISSION_PERCENT = 15;

export const staff: StaffMember[] = [
  { id: "st1", name: "Mai", phone: "901234567", role: STAFF_ROLE.OWNER, isMe: true },
  { id: "st2", name: "Hoàng", phone: "903111222", role: STAFF_ROLE.MANAGER, isMe: false },
  { id: "st3", name: "Vy", phone: "988765432", role: STAFF_ROLE.COUNTER, isMe: false },
];

export const storeNotificationPrefs: StoreNotificationPrefs = {
  postingReminderAt: "17:30",
  newOrder: true,
  customerArriving: true,
  noShow: true,
  payoutSent: true,
  newReview: false,
};

export function seedReviews(base: Date): Review[] {
  return [
    {
      id: "r1", orderId: "o90", storeId: "s1", customerName: "Linh", rating: 5, tags: ["Đáng tiền"],
      text: "Túi đầy ắp, có cả croissant bơ và 2 bánh mì. Quá đáng tiền!",
      createdAt: vnTimeOn(base, "20:10", -2), reply: { text: "Cảm ơn Linh, hẹn bạn tối mai nhé!", createdAt: vnTimeOn(base, "21:00", -2) },
    },
    {
      id: "r2", orderId: "o91", storeId: "s1", customerName: "Quân", rating: 4, tags: ["Ít hơn mong đợi"],
      text: "Bánh ngon nhưng hôm nay ít món hơn tuần trước.", createdAt: vnTimeOn(base, "19:50", -2), reply: null,
    },
    {
      id: "r3", orderId: "o92", storeId: "s1", customerName: "Trang", rating: 5, tags: ["Bánh còn tươi", "Nhân viên thân thiện"],
      text: "Bánh vẫn giòn dù đã cuối ngày, nhân viên rất dễ thương.", createdAt: vnTimeOn(base, "20:30", -4), reply: null,
    },
  ];
}

export const reviewSummary: ReviewSummary = {
  rating: 4.8,
  count30d: 126,
  topTags: [
    { label: "Đáng tiền", count: 84 },
    { label: "Bánh tươi", count: 71 },
    { label: "Thân thiện", count: 52 },
  ],
};
