import type { UserRole } from "@relife/shared";

import { useSessionState } from "../store";

export interface Session {
  isLoading: boolean;
  userId: string | null;
  role: UserRole | null;
  isGuest: boolean;
}

/**
 * Current user session. Starts from EXPO_PUBLIC_DEV_ROLE (so each role can be opened
 * directly during development) and then follows the fake sign-in flow in features/auth.
 */
export function useSession(): Session {
  const s = useSessionState();
  return { isLoading: false, userId: s.userId, role: s.role, isGuest: s.isGuest };
}
