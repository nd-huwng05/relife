import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as api from "../api";

export const charityKeys = {
  me: ["charity", "me"] as const,
  application: ["charity", "application"] as const,
  surplus: ["charity", "surplus"] as const,
  surplusItem: (id: string) => ["charity", "surplus", id] as const,
  claims: ["charity", "claims"] as const,
  claim: (id: string) => ["charity", "claim", id] as const,
  report: ["charity", "report"] as const,
};

export const useCharity = () => useQuery({ queryKey: charityKeys.me, queryFn: api.getCharity });
export const useCharityApplication = () => useQuery({ queryKey: charityKeys.application, queryFn: api.getCharityApplication });
/** Live list: other charities claim at the same time, so refresh often. */
export const useSurplusList = () => useQuery({ queryKey: charityKeys.surplus, queryFn: api.getSurplusList, refetchInterval: 10_000 });
export const useSurplus = (id: string) => useQuery({ queryKey: charityKeys.surplusItem(id), queryFn: () => api.getSurplus(id) });
export const useClaims = () => useQuery({ queryKey: charityKeys.claims, queryFn: api.getClaims });
export const useClaim = (id: string) => useQuery({ queryKey: charityKeys.claim(id), queryFn: () => api.getClaim(id) });
export const useIntakeReport = () => useQuery({ queryKey: charityKeys.report, queryFn: api.getIntakeReport });

export function useClaimSurplus() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: api.claimSurplus, onSuccess: () => qc.invalidateQueries({ queryKey: ["charity"] }) });
}

export function useUpdateCharitySettings() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: api.updateCharitySettings, onSuccess: () => qc.invalidateQueries({ queryKey: charityKeys.me }) });
}
