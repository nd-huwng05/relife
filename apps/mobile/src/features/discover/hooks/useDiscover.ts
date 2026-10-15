import type { BagFilters } from "@relife/shared";
import { useQuery } from "@tanstack/react-query";

import * as api from "../api";

export const discoverKeys = {
  feed: (f: BagFilters) => ["discover", "feed", f] as const,
  count: (f: BagFilters) => ["discover", "count", f] as const,
  search: (q: string) => ["discover", "search", q] as const,
  recent: ["discover", "recent"] as const,
  map: ["discover", "map"] as const,
  saved: ["discover", "saved"] as const,
};

export function useDiscoverFeed(filters: BagFilters) {
  return useQuery({ queryKey: discoverKeys.feed(filters), queryFn: () => api.getDiscoverFeed(filters) });
}

export function useBagCount(filters: BagFilters) {
  return useQuery({ queryKey: discoverKeys.count(filters), queryFn: () => api.countBags(filters), placeholderData: (prev) => prev });
}

export function useSearch(query: string) {
  return useQuery({
    queryKey: discoverKeys.search(query),
    queryFn: () => api.searchBags(query),
    enabled: query.trim().length > 0,
    placeholderData: (prev) => prev,
  });
}

export function useRecentSearches() {
  return useQuery({ queryKey: discoverKeys.recent, queryFn: api.getRecentSearches });
}

export function useMapBags() {
  return useQuery({ queryKey: discoverKeys.map, queryFn: api.getMapBags });
}

export function useSaved() {
  return useQuery({ queryKey: discoverKeys.saved, queryFn: api.getSaved });
}
