import { vnTimeOn } from "@relife/shared";

/** Fake network latency for every mock call, so loading states are visible. */
export const MOCK_LATENCY_MS = 350;

/** Vietnam time the demo clock starts at: just before the evening pickup windows open. */
const DEMO_START = "18:55";

export const MOCK_CLOCK = {
  enabled: true,
  startAt: new Date(vnTimeOn(new Date(), DEMO_START)),
};

/** Seconds after "Tôi đã chuyển khoản" before the fake payment webhook marks the order paid. */
export const MOCK_WEBHOOK_DELAY_MS = 4000;

/** One-time code accepted by the fake SMS sign-in. Any 6 digits work; this one is pre-filled in hints. */
export const MOCK_OTP = "481920";
