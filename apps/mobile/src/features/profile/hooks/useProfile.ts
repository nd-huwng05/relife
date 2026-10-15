import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as api from "../api";

export const profileKeys = {
  me: ["profile", "me"] as const,
  notifications: ["profile", "notifications"] as const,
  upcoming: ["profile", "upcoming"] as const,
};

export function useProfile() {
  return useQuery({ queryKey: profileKeys.me, queryFn: api.getProfile });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: api.updateProfile, onSuccess: (p) => qc.setQueryData(profileKeys.me, p) });
}

export function useUpdateNotificationPrefs() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: api.updateNotificationPrefs, onSuccess: () => qc.invalidateQueries({ queryKey: profileKeys.me }) });
}

export function useNotifications() {
  return useQuery({ queryKey: profileKeys.notifications, queryFn: api.getNotifications });
}

export function useMarkAllRead() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: api.markAllNotificationsRead, onSuccess: () => qc.invalidateQueries({ queryKey: profileKeys.notifications }) });
}

export function useMarkRead() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: api.markNotificationRead, onSuccess: () => qc.invalidateQueries({ queryKey: profileKeys.notifications }) });
}

export function useUpcomingCount() {
  return useQuery({ queryKey: profileKeys.upcoming, queryFn: api.getUpcomingOrderCount });
}

export function useDeleteAccount() {
  return useMutation({ mutationFn: api.deleteAccount });
}
