import { useNow } from "@/lib/clock";

/** Seconds left on the 15 minute hold, ticking every second. */
export function useHoldTimer(holdExpiresAt: string | undefined): number {
  const now = useNow(1000);
  if (!holdExpiresAt) return 0;
  return Math.max(0, Math.floor((new Date(holdExpiresAt).getTime() - now.getTime()) / 1000));
}
