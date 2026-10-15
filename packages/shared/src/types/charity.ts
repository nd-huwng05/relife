import type { ClaimStatus, StorageType } from "../constants";
import type { IsoDateTime, LocalTime, PhotoRef } from "./common";

export interface CharityPickupWindow {
  label: string;
  start: LocalTime | null;
  end: LocalTime | null;
}

/** `charities/{id}` */
export interface CharityProfile {
  id: string;
  name: string;
  dailyQuota: number;
  claimsLeftToday: number;
  storage: StorageType[];
  radiusKm: number;
  onlyMatchingStorage: { fridge: boolean; freezer: boolean };
  windows: CharityPickupWindow[];
  showRate: { collected: number; total: number; percent: number };
}

export interface CharityApplication {
  step: number;
  totalSteps: number;
  maxPortionsPerDay: number;
  storage: StorageType[];
  documents: { key: string; label: string; uploaded: boolean; detail: string }[];
  verificationCall: { at: IsoDateTime; contactName: string; contactRole: string } | null;
  checks: { label: string; done: boolean }[];
}

/** `surplus/{id}`: units left after the customer peak, open to approved charities. */
export interface Surplus {
  id: string;
  storeId: string;
  storeName: string;
  storeAddress: string;
  title: string;
  distanceKm: number;
  storageLabel: string;
  storageNote: string;
  needs: StorageType;
  closesAt: IsoDateTime;
  pickupStart: IsoDateTime;
  pickupEnd: IsoDateTime;
  unitsLeft: number;
  unitsTotal: number;
  photo: PhotoRef;
  recentClaimNote: string | null;
}

export interface Claim {
  id: string;
  surplusId: string;
  storeName: string;
  units: number;
  status: ClaimStatus;
  code: string;
  pickupStart: IsoDateTime;
  pickupEnd: IsoDateTime;
  createdAt: IsoDateTime;
}

export interface IntakeReport {
  monthLabel: string;
  portions: number;
  foodKg: number;
  meals: number;
  bySource: { storeName: string; portions: number }[];
  assumptions: string;
}
