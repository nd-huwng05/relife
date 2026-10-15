import { useEffect, useState } from "react";

import { MOCK_CLOCK } from "./mock/config";

// One source of "now" for countdowns and pickup windows.
// With the mock API the clock starts at a fixed evening time (see mock/config.ts) so the
// screens look like the Figma frames whenever you open the app, then runs in real time.
// TODO(S1): return `new Date()` once data comes from Firestore.
const appStartedAt = Date.now();

export function now(): Date {
  if (!MOCK_CLOCK.enabled) return new Date();
  return new Date(MOCK_CLOCK.startAt.getTime() + (Date.now() - appStartedAt));
}

/** Re-renders every `intervalMs` with the current time. */
export function useNow(intervalMs = 1000): Date {
  const [value, setValue] = useState(now);
  useEffect(() => {
    const id = setInterval(() => setValue(now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return value;
}
