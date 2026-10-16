import { ORDER_STATUS } from "@relife/shared";
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

/**
 * The paid order waiting to be collected, from the cached order list. It stays available when
 * the network drops or during maintenance (E03, E07), because the pickup code is signed and
 * the store checks it offline.
 */
export function useActivePickup() {
  const orders = useMyOrders();
  const order = orders.data?.find((o) => o.status === ORDER_STATUS.PAID);
  if (!order) return null;
  return { orderId: order.id, storeName: order.storeName, code: `${order.pickupCode.slice(0, 3)} ${order.pickupCode.slice(3)}` };
}
