import type { ScanResult } from "@relife/shared";
import { useLocalSearchParams } from "expo-router";

import { ScanInvalidScreen } from "@/features/pickup";

type Reason = Extract<ScanResult, { ok: false }>["reason"];

export default function Route() {
  const { reason, usedAt } = useLocalSearchParams<{ reason: Reason; usedAt?: string }>();
  return <ScanInvalidScreen reason={reason} usedAt={usedAt || undefined} />;
}
