import type { PaymentFailureReason } from "@relife/shared";
import { useLocalSearchParams } from "expo-router";

import { PaymentFailedScreen } from "@/features/checkout";

export default function Route() {
  const { orderId, reason } = useLocalSearchParams<{ orderId: string; reason?: PaymentFailureReason }>();
  return <PaymentFailedScreen orderId={orderId} reason={reason ?? "hold_expired"} />;
}
