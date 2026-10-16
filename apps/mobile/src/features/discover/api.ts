import { BAG_STATUS, formatTime, type Bag, type BagFilters, type GeoPoint, type Store } from "@relife/shared";

import { now } from "@/lib/clock";
import { data, db, mockRequest } from "@/lib/mock";

// FC2 data access. Backed by the mock API.
// TODO(S3): nearby = geohash range queries with geofire-common, then filter by distance;
// text search = `searchKeys` array-contains (lowercase, no accents).

/** "Bánh mì" → "banh mi" so search works without Vietnamese accents. */
export function normalize(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").trim();
}

function availableBags(): Bag[] {
  const t = now();
  return db.bags.filter((b) => b.status === BAG_STATUS.LIVE && new Date(b.pickupEnd) > t);
}

function matches(b: Bag, f: BagFilters): boolean {
  if ((b.distanceKm ?? 0) > f.maxDistanceKm) return false;
  const start = formatTime(b.pickupStart);
  if (f.pickupSlot === "now" && new Date(b.pickupStart) > now()) return false;
  if (f.pickupSlot === "before18" && start >= "18:00") return false;
  if (f.pickupSlot === "18to20" && (start < "18:00" || start >= "20:00")) return false;
  if (f.pickupSlot === "after20" && start < "20:00") return false;
  if (f.categories.length > 0 && !f.categories.includes(b.category)) return false;
  if (f.priceRange === "under40" && b.price >= 40000) return false;
  if (f.priceRange === "40to70" && (b.price < 40000 || b.price > 70000)) return false;
  if (f.priceRange === "over70" && b.price <= 70000) return false;
  return true;
}

function sortBags(bags: Bag[], sort: BagFilters["sort"]): Bag[] {
  const copy = [...bags];
  if (sort === "nearest") copy.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
  if (sort === "endingSoon") copy.sort((a, b) => a.pickupEnd.localeCompare(b.pickupEnd));
  if (sort === "cheapest") copy.sort((a, b) => a.price - b.price);
  if (sort === "topRated") copy.sort((a, b) => b.storeRating - a.storeRating);
  return copy;
}

export interface DiscoverFeed {
  areaLabel: string;
  userName: string;
  bagsSavedToday: number;
  closingSoon: Bag[];
  nearby: Bag[];
  savedBagIds: string[];
  /** Earliest time the nearby stores usually post, for the empty state (E02), e.g. "18:30". */
  usualPostTime: string | null;
}

export function getDiscoverFeed(filters: BagFilters): Promise<DiscoverFeed> {
  return mockRequest(() => {
    const bags = availableBags().filter((b) => matches(b, filters));
    const ninetyMinutes = now().getTime() + 90 * 60000;
    return {
      areaLabel: db.customer.areaLabel,
      userName: db.customer.name,
      bagsSavedToday: data.PLATFORM_BAGS_SAVED_TODAY,
      closingSoon: sortBags(bags.filter((b) => new Date(b.pickupEnd).getTime() < ninetyMinutes), "endingSoon"),
      nearby: sortBags(bags, filters.sort),
      savedBagIds: db.customer.savedBagIds,
      usualPostTime: db.stores.map((s) => s.usualPostTime).sort()[0] ?? null,
    };
  });
}

/** Number of bags the filter sheet would show ("Xem 24 túi bánh"). */
export function countBags(filters: BagFilters): Promise<number> {
  return mockRequest(() => availableBags().filter((b) => matches(b, filters)).length, 120);
}

export interface SearchResults {
  stores: (Store & { bagsToday: number })[];
  bags: Bag[];
}

export function searchBags(query: string): Promise<SearchResults> {
  return mockRequest(() => {
    const q = normalize(query);
    if (!q) return { stores: [], bags: [] };
    const words = q.split(/\s+/);
    const bags = availableBags().filter((b) => {
      const hay = normalize(`${b.title} ${b.storeName} ${b.searchKeys.join(" ")}`);
      return words.every((w) => hay.includes(w));
    });
    const stores = db.stores
      .filter((s) => words.every((w) => normalize(`${s.name} ${s.category}`).includes(w)))
      .map((s) => ({ ...s, bagsToday: availableBags().filter((b) => b.storeId === s.id).length }));
    return { stores, bags };
  }, 250);
}

export function getRecentSearches(): Promise<string[]> {
  return mockRequest(() => data.RECENT_SEARCHES, 100);
}

export interface MapBag {
  bag: Bag;
  coordinate: GeoPoint;
}

/** Bags with the location of their store, for the map (A11). */
export function getMapBags(): Promise<{ areaLabel: string; bags: MapBag[] }> {
  return mockRequest(() => {
    const bags = availableBags().map((bag) => ({
      bag,
      coordinate: db.stores.find((s) => s.id === bag.storeId)?.location ?? { lat: 0, lng: 0 },
    }));
    return { areaLabel: db.customer.areaLabel.split(",")[0] ?? "", bags };
  });
}

export interface SavedLists {
  stores: Store[];
  bags: Bag[];
}

export function getSaved(): Promise<SavedLists> {
  return mockRequest(() => ({
    stores: db.stores.filter((s) => db.customer.followingStoreIds.includes(s.id)),
    bags: db.bags.filter((b) => db.customer.savedBagIds.includes(b.id)),
  }));
}
