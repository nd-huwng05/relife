import { USER_ROLE, type UserRole } from "@relife/shared";

export interface Session {
  isLoading: boolean;
  userId: string | null;
  role: UserRole | null;
}

const DEV_ROLES = Object.values(USER_ROLE) as string[];

function devRole(): UserRole | null {
  const role = process.env.EXPO_PUBLIC_DEV_ROLE;
  return role && DEV_ROLES.includes(role) ? (role as UserRole) : null;
}

/**
 * Current user session. Until Firebase Auth is wired up (S1), this reads
 * EXPO_PUBLIC_DEV_ROLE so each role's screens can be opened during development.
 */
export function useSession(): Session {
  const role = devRole();
  return { isLoading: false, userId: role ? "dev-user" : null, role };
}
