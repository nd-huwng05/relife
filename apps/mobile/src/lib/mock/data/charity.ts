import { CLAIM_STATUS, STORAGE_TYPE, vnTimeOn, type CharityApplication, type CharityProfile, type Claim, type IntakeReport, type Surplus } from "@relife/shared";

// Fake data for the charity role (phase 2, S9).
export const charityProfile: CharityProfile = {
  id: "c1",
  name: "Bếp ăn Nhân Ái",
  dailyQuota: 5,
  claimsLeftToday: 3,
  storage: [STORAGE_TYPE.ROOM, STORAGE_TYPE.FRIDGE],
  radiusKm: 5,
  onlyMatchingStorage: { fridge: true, freezer: false },
  windows: [
    { label: "Thứ 2 – Thứ 6", start: "19:00", end: "21:30" },
    { label: "Thứ 7", start: "18:00", end: "21:00" },
    { label: "Chủ nhật", start: null, end: null },
  ],
  showRate: { collected: 23, total: 25, percent: 92 },
};

export function seedCharityApplication(base: Date): CharityApplication {
  return {
    step: 3,
    totalSteps: 5,
    maxPortionsPerDay: 80,
    storage: [STORAGE_TYPE.ROOM, STORAGE_TYPE.FRIDGE],
    documents: [
      { key: "founding", label: "Quyết định thành lập", uploaded: true, detail: "PDF · 1,2 MB · đã tải lên" },
      { key: "food_safety", label: "Giấy chứng nhận ATTP", uploaded: false, detail: "Chưa tải lên" },
    ],
    verificationCall: { at: vnTimeOn(base, "10:00", 2), contactName: "chị Phạm Thu Hà", contactRole: "Người đại diện" },
    checks: [
      { label: "Giấy tờ pháp lý đã nhận", done: true },
      { label: "Kiểm tra năng lực bảo quản", done: true },
      { label: "Gọi xác minh người đại diện", done: false },
      { label: "Kích hoạt tài khoản", done: false },
    ],
  };
}

export function seedSurplus(base: Date): Surplus[] {
  const inMinutes = (m: number) => new Date(base.getTime() + m * 60 * 1000).toISOString();
  return [
    {
      id: "sp1", storeId: "s2", storeName: "Lò Bánh Nhà Mây", storeAddress: "45 Xuân Thuỷ", title: "Bánh mì & bánh ngọt",
      distanceKm: 1.2, storageLabel: "Nhiệt độ phòng", storageNote: "Nhiệt độ phòng, dùng trong ngày. Không cần tủ lạnh.",
      needs: STORAGE_TYPE.ROOM, closesAt: inMinutes(48), pickupStart: vnTimeOn(base, "19:30"), pickupEnd: vnTimeOn(base, "21:00"),
      unitsLeft: 12, unitsTotal: 20, photo: "bread-crates", recentClaimNote: "Tổ chức khác vừa nhận 8 phần",
    },
    {
      id: "sp2", storeId: "s6", storeName: "Bếp Cơm Nhà Lá", storeAddress: "102 Duy Tân", title: "Cơm phần chay",
      distanceKm: 2.4, storageLabel: "Tủ lạnh trong 2 giờ", storageNote: "Cần cho vào tủ lạnh trong 2 giờ sau khi nhận.",
      needs: STORAGE_TYPE.FRIDGE, closesAt: vnTimeOn(base, "21:00"), pickupStart: vnTimeOn(base, "20:00"), pickupEnd: vnTimeOn(base, "21:00"),
      unitsLeft: 15, unitsTotal: 15, photo: "bakery-interior", recentClaimNote: null,
    },
  ];
}

export function seedClaims(base: Date): Claim[] {
  return [
    { id: "cl1", surplusId: "sp1", storeName: "Lò Bánh Nhà Mây", units: 8, status: CLAIM_STATUS.READY, code: "C9TR2W", pickupStart: vnTimeOn(base, "19:30"), pickupEnd: vnTimeOn(base, "21:00"), createdAt: vnTimeOn(base, "18:40") },
    { id: "cl2", surplusId: "sp9", storeName: "Bếp Cơm Nhà Lá", units: 15, status: CLAIM_STATUS.COLLECTED, code: "K2PZ8Q", pickupStart: vnTimeOn(base, "20:00", -1), pickupEnd: vnTimeOn(base, "21:00", -1), createdAt: vnTimeOn(base, "19:10", -1) },
    { id: "cl3", surplusId: "sp8", storeName: "Maison Bơ Sữa", units: 6, status: CLAIM_STATUS.NO_SHOW, code: "R5MX1D", pickupStart: vnTimeOn(base, "20:00", -4), pickupEnd: vnTimeOn(base, "21:00", -4), createdAt: vnTimeOn(base, "19:30", -4) },
  ];
}

export const intakeReport: IntakeReport = {
  monthLabel: "THÁNG 9 / 2026",
  portions: 312,
  foodKg: 109,
  meals: 270,
  bySource: [
    { storeName: "Lò Bánh Nhà Mây", portions: 128 },
    { storeName: "Bếp Cơm Nhà Lá", portions: 104 },
    { storeName: "Maison Bơ Sữa", portions: 80 },
  ],
  assumptions: "1 phần bánh ≈ 0,35 kg. 1 bữa ăn ≈ 0,4 kg thực phẩm. Số liệu lấy từ phiếu đã quét tại tiệm.",
};
