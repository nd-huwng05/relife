import type { ScanResult } from "@relife/shared";
import { router } from "expo-router";

/** Opens B13 (valid) or B14 (invalid) on top of the scanner. */
export function openScanResult(result: ScanResult) {
  if (result.ok) {
    router.push({ pathname: "/scanner/valid", params: { orderId: result.order.id } });
  } else {
    router.push({ pathname: "/scanner/invalid", params: { reason: result.reason, usedAt: result.usedAt ?? "" } });
  }
}
