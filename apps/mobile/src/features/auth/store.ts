import { USER_ROLE, type UserRole } from "@relife/shared";
import { useSyncExternalStore } from "react";

// Session state shared by every screen. A tiny external store keeps this dependency free;
// swap it for Zustand + MMKV persistence when real auth lands.
// TODO(S1): replace with Firebase Auth (onAuthStateChanged) and custom claims for the role.

export interface SessionState {
  userId: string | null;
  role: UserRole | null;
  /** Browsing as a guest from "Xem trước, đăng nhập sau" (A04). */
  isGuest: boolean;
  /** Phone or Google identity used during sign-in, before the profile is created. */
  pendingPhone: string | null;
  /** Onboarding was already shown in this session, so sign-in opens directly. */
  introSeen: boolean;
}

const DEV_ROLES = Object.values(USER_ROLE) as string[];

function initialRole(): UserRole | null {
  const role = process.env.EXPO_PUBLIC_DEV_ROLE;
  return role && DEV_ROLES.includes(role) ? (role as UserRole) : null;
}

let state: SessionState = {
  userId: initialRole() ? "dev-user" : null,
  role: initialRole(),
  isGuest: false,
  pendingPhone: null,
  introSeen: false,
};
const listeners = new Set<() => void>();

function setState(patch: Partial<SessionState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

export const sessionStore = {
  get: () => state,
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  signIn(role: UserRole, userId = "u1") {
    setState({ userId, role, isGuest: false, pendingPhone: null });
  },
  continueAsGuest() {
    setState({ userId: null, role: USER_ROLE.CUSTOMER, isGuest: true });
  },
  setPendingPhone(phone: string) {
    setState({ pendingPhone: phone });
  },
  markIntroSeen() {
    setState({ introSeen: true });
  },
  /** Leave the app's role screens. Sign-in opens directly the next time. */
  signOut() {
    setState({ userId: null, role: null, isGuest: false, pendingPhone: null, introSeen: true });
  },
};

export function useSessionState(): SessionState {
  return useSyncExternalStore(sessionStore.subscribe, sessionStore.get, sessionStore.get);
}
