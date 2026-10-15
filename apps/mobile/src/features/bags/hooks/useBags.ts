import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as api from "../api";

export const bagKeys = {
  all: ["bags"] as const,
  detail: (id: string) => ["bags", "detail", id] as const,
  store: (id: string) => ["bags", "store", id] as const,
  mine: ["bags", "mine"] as const,
  templates: ["bags", "templates"] as const,
};

export function useBag(bagId: string) {
  return useQuery({ queryKey: bagKeys.detail(bagId), queryFn: () => api.getBag(bagId) });
}

export function useStorePage(storeId: string) {
  return useQuery({ queryKey: bagKeys.store(storeId), queryFn: () => api.getStorePage(storeId) });
}

/** Save or unsave a bag. Invalidates everything that shows the heart. */
export function useToggleSaveBag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.toggleSaveBag,
    onSettled: () => qc.invalidateQueries(),
  });
}

export function useToggleFollowStore() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.toggleFollowStore,
    onSettled: () => qc.invalidateQueries(),
  });
}

export function useMyBags() {
  return useQuery({ queryKey: bagKeys.mine, queryFn: api.getMyBags });
}

export function useTemplates() {
  return useQuery({ queryKey: bagKeys.templates, queryFn: api.getTemplates });
}

function useStoreBagMutation<TInput, TResult>(mutationFn: (input: TInput) => Promise<TResult>) {
  const qc = useQueryClient();
  return useMutation({ mutationFn, onSuccess: () => qc.invalidateQueries() });
}

export const usePublishBag = () => useStoreBagMutation(api.publishBag);
export const useUpdateBag = () => useStoreBagMutation(api.updateBag);
export const usePauseBag = () => useStoreBagMutation(api.pauseBag);
export const useResumeBag = () => useStoreBagMutation(api.resumeBag);
export const useRepostTemplates = () => useStoreBagMutation(api.repostTemplates);
