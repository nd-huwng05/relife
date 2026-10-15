import type { StaffRole, StoreStatus } from "../constants";
import type { Vnd } from "../money";
import type { GeoPoint, IsoDateTime, LocalTime, PhotoRef } from "./common";

export interface OpeningHours {
  /** e.g. "Thứ 2 – Thứ 6" */
  label: string;
  open: LocalTime | null;
  close: LocalTime | null;
  isToday?: boolean;
}

/** `stores/{id}` */
export interface Store {
  id: string;
  name: string;
  /** e.g. "Tiệm bánh Pháp" */
  category: string;
  description: string;
  address: string;
  district: string;
  location: GeoPoint;
  geohash: string;
  phone: string;
  rating: number;
  reviewCount: number;
  status: StoreStatus;
  /** Hidden from Discover while true; paid orders are kept. */
  temporarilyClosed: boolean;
  coverPhoto: PhotoRef;
  /** Usual posting time over the last 30 days. */
  usualPostTime: LocalTime;
  hours: OpeningHours[];
  /** Distance from the viewer, filled in by the nearby query. */
  distanceKm?: number;
}

export interface StoreSummary {
  storeId: string;
  ownerFirstName: string;
  soldToday: number;
  stockToday: number;
  waitingPickup: number;
  revenueToday: Vnd;
  postedToday: boolean;
  firstPickupStart: LocalTime;
  /** e.g. "Hôm qua bạn bán hết 10 túi trong 40 phút." */
  yesterdayNote: string;
}

export interface ApplicationSection {
  key: "documents" | "info" | "location" | "hours";
  label: string;
  needsFix: boolean;
}

/** `storeApplications/{uid}` */
export interface StoreApplication {
  status: StoreStatus;
  submittedAt: IsoDateTime | null;
  expectedBy: IsoDateTime | null;
  rejectReason: string | null;
  reviewedBy: string | null;
  reviewedAt: IsoDateTime | null;
  sections: ApplicationSection[];
  address: string;
}

export interface StaffMember {
  id: string;
  name: string;
  phone: string;
  role: StaffRole;
  isMe: boolean;
}

export interface StoreNotificationPrefs {
  postingReminderAt: LocalTime;
  newOrder: boolean;
  customerArriving: boolean;
  noShow: boolean;
  payoutSent: boolean;
  newReview: boolean;
}
