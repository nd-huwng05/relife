import { ORDER_STATUS } from "@relife/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as api from "../api";

export const checkoutKeys = {
  bag: (id: string) => ["checkout", "bag", id] as const,
  order: (id: string) => ["orders", "detail", id] as const,
  payment: (id: string) => ["checkout", "payment", id] as const,
  impact: ["checkout", "impact"] as const,
};

export function useCheckoutBag(bagId: string) {
  return useQuery({ queryKey: checkoutKeys.bag(bagId), queryFn: () => api.getBagForCheckout(bagId), enabled: !!bagId });
}

/** Order with polling while it waits for the payment webhook. */
export function useCheckoutOrder(orderId: string, opts: { poll?: boolean } = {}) {
  return useQuery({
    queryKey: checkoutKeys.order(orderId),
    queryFn: () => api.getOrder(orderId),
    refetchInterval: (q) => (opts.poll && q.state.data?.status === ORDER_STATUS.HELD ? 1500 : false),
  });
}

export function usePaymentInstructions(orderId: string) {
  return useQuery({ queryKey: checkoutKeys.payment(orderId), queryFn: () => api.createPayment(orderId), staleTime: Infinity, retry: false });
}

export function useImpact() {
  return useQuery({ queryKey: checkoutKeys.impact, queryFn: api.getImpact });
}

function useOrderMutation<T>(mutationFn: (input: T) => ReturnType<typeof api.getOrder>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (order) => {
      qc.setQueryData(checkoutKeys.order(order.id), order);
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["bags"] });
      qc.invalidateQueries({ queryKey: ["discover"] });
    },
  });
}

export const useCreateOrder = () => useOrderMutation(api.createOrder);
export const useReportTransfer = () => useOrderMutation(api.reportTransfer);
export const useCancelHold = () => useOrderMutation(api.cancelHold);
