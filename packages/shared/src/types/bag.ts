import type { BagCategory, BagKind, BagStatus } from "../constants";
import type { Vnd } from "../money";
import type { IsoDateTime, LocalTime, PhotoRef } from "./common";

/** `bags/{id}`. Written only by Cloud Functions (publishBag, updateBag, pauseBag). */
export interface Bag {
  id: string;
  storeId: string;
  storeName: string;
  storeAddress: string;
  title: string;
  kind: BagKind;
  category: BagCategory;
  /** e.g. "Bánh ngọt & bánh mì" */
  categoryLabel: string;
  description: string;
  price: Vnd;
  /** Original value before the discount. */
  value: Vnd;
  stock: number;
  sold: number;
  maxPerCustomer: number;
  pickupStart: IsoDateTime;
  pickupEnd: IsoDateTime;
  photos: PhotoRef[];
  allergens: string[];
  status: BagStatus;
  geohash: string;
  searchKeys: string[];
  /** Number of paid orders. The price is locked once this is above zero. */
  paidOrders: number;
  storeRating: number;
  storeReviewCount: number;
  distanceKm?: number;
}

/** `bagTemplates/{id}`: a reusable bag setup for "Đăng lại như hôm qua". */
export interface BagTemplate {
  id: string;
  storeId: string;
  title: string;
  price: Vnd;
  value: Vnd;
  defaultStock: number;
  pickupStart: LocalTime;
  pickupEnd: LocalTime;
  photo: PhotoRef;
  postedToday: boolean;
}

export interface BagFilters {
  maxDistanceKm: number;
  pickupSlot: "now" | "before18" | "18to20" | "after20" | null;
  categories: BagCategory[];
  priceRange: "under40" | "40to70" | "over70" | null;
  sort: "nearest" | "endingSoon" | "cheapest" | "topRated";
}

export const DEFAULT_BAG_FILTERS: BagFilters = {
  maxDistanceKm: 3,
  pickupSlot: null,
  categories: [],
  priceRange: null,
  sort: "nearest",
};
