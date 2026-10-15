import { STORE_STATUS, type RevenueReport } from "@relife/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as api from "../api";

export const storeKeys = {
  application: ["store", "application"] as const,
  home: ["store", "home"] as const,
  revenue: (p: RevenueReport["period"]) => ["store", "revenue", p] as const,
  payouts: ["store", "payouts"] as const,
  payoutAccount: ["store", "payoutAccount"] as const,
  settings: ["store", "settings"] as const,
  prefs: ["store", "prefs"] as const,
  reviews: ["store", "reviews"] as const,
  staff: ["store", "staff"] as const,
};

export function useApplication() {
  return useQuery({ queryKey: storeKeys.application, queryFn: api.getApplication });
}

/** Whether the signed-in store may use the store tabs yet (approved application). */
export function useStoreAccess() {
  const q = useApplication();
  return { isLoading: q.isPending, status: q.data?.status, approved: q.data?.status === STORE_STATUS.APPROVED };
}

function useStoreMutation<TInput, TResult>(mutationFn: (input: TInput) => Promise<TResult>) {
  const qc = useQueryClient();
  return useMutation({ mutationFn, onSuccess: () => qc.invalidateQueries() });
}

export const useSubmitApplication = () => useStoreMutation(api.submitApplication);
export const useDevSetApplicationStatus = () => useStoreMutation(api.devSetApplicationStatus);
export const useSavePayoutAccount = () => useStoreMutation(api.savePayoutAccount);
export const useSetClosed = () => useStoreMutation(api.setTemporarilyClosed);
export const useUpdateStorePrefs = () => useStoreMutation(api.updateStorePrefs);
export const useReplyReview = () => useStoreMutation(api.replyReview);
export const useInviteStaff = () => useStoreMutation(api.inviteStaff);

export function useStoreHome() {
  return useQuery({ queryKey: storeKeys.home, queryFn: api.getStoreHome, refetchInterval: 20_000 });
}

export function useRevenue(period: RevenueReport["period"]) {
  return useQuery({ queryKey: storeKeys.revenue(period), queryFn: () => api.getRevenue(period), placeholderData: (prev) => prev });
}

export function usePayouts() {
  return useQuery({ queryKey: storeKeys.payouts, queryFn: api.getPayouts });
}

export function usePayoutAccount() {
  return useQuery({ queryKey: storeKeys.payoutAccount, queryFn: api.getPayoutAccount });
}

export function useStoreSettings() {
  return useQuery({ queryKey: storeKeys.settings, queryFn: api.getStoreSettings });
}

export function useStorePrefs() {
  return useQuery({ queryKey: storeKeys.prefs, queryFn: api.getStorePrefs });
}

export function useReviews() {
  return useQuery({ queryKey: storeKeys.reviews, queryFn: api.getReviews });
}

export function useStaff() {
  return useQuery({ queryKey: storeKeys.staff, queryFn: api.getStaff });
}
