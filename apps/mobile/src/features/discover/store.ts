import { DEFAULT_BAG_FILTERS, type BagFilters } from "@relife/shared";
import { useSyncExternalStore } from "react";

// Discover filters, shared between Discover (A08) and the filter sheet (A09).
let filters: BagFilters = DEFAULT_BAG_FILTERS;
const listeners = new Set<() => void>();

export const filterStore = {
  get: () => filters,
  set(next: BagFilters) {
    filters = next;
    listeners.forEach((l) => l());
  },
  reset() {
    filterStore.set(DEFAULT_BAG_FILTERS);
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useFilters(): BagFilters {
  return useSyncExternalStore(filterStore.subscribe, filterStore.get, filterStore.get);
}

/** Number of filters that differ from the defaults, for the filter button badge. */
export function activeFilterCount(f: BagFilters): number {
  let n = 0;
  if (f.maxDistanceKm !== DEFAULT_BAG_FILTERS.maxDistanceKm) n++;
  if (f.pickupSlot) n++;
  if (f.categories.length) n++;
  if (f.priceRange) n++;
  if (f.sort !== DEFAULT_BAG_FILTERS.sort) n++;
  return n;
}

// Session choices for the shared states: browse the live area from outside it (E05) and use
// a manually chosen area when location is off (E06). They reset when the app restarts.
let browseLiveArea = false;
let manualArea = false;
const sessionListeners = new Set<() => void>();
const sessionSnapshot = () => `${browseLiveArea}|${manualArea}`;

export const areaChoice = {
  browseLiveArea() {
    browseLiveArea = true;
    sessionListeners.forEach((l) => l());
  },
  chooseManualArea() {
    manualArea = true;
    sessionListeners.forEach((l) => l());
  },
  subscribe(l: () => void) {
    sessionListeners.add(l);
    return () => sessionListeners.delete(l);
  },
};

export function useAreaChoice() {
  useSyncExternalStore(areaChoice.subscribe, sessionSnapshot, sessionSnapshot);
  return { browseLiveArea, manualArea };
}
