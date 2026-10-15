import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as api from "../api";

export const pickupKeys = {
  mine: ["orders", "mine"] as const,
  detail: (id: string) => ["orders", "pickup", id] as const,
  refund: (id: string) => ["orders", "refund", id] as const,
  today: ["orders", "today"] as const,
};

export function useMyOrders() {
  return useQuery({ queryKey: pickupKeys.mine, queryFn: api.getMyOrders, refetchInterval: 15_000 });
}

export function useOrder(orderId: string) {
  return useQuery({ queryKey: pickupKeys.detail(orderId), queryFn: () => api.getOrder(orderId), refetchInterval: 10_000 });
}

export function useRefundPreview(orderId: string) {
  return useQuery({ queryKey: pickupKeys.refund(orderId), queryFn: () => api.getRefundPreview(orderId) });
}

function useOrdersMutation<TInput, TResult>(mutationFn: (input: TInput) => Promise<TResult>) {
  const qc = useQueryClient();
  return useMutation({ mutationFn, onSuccess: () => qc.invalidateQueries() });
}

export const useCancelOrder = () => useOrdersMutation(api.cancelOrder);
export const useSubmitReview = () => useOrdersMutation(api.submitReview);
export const useMarkNoShow = () => useOrdersMutation(api.markNoShow);
export const useRedeemPickup = () =>
  useOrdersMutation(({ code, source }: { code: string; source: "scan" | "manual" }) => api.redeemPickup(code, source));

export function useTodayOrders() {
  return useQuery({ queryKey: pickupKeys.today, queryFn: api.getTodayOrders, refetchInterval: 20_000 });
}
