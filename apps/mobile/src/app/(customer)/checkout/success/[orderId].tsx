import { useLocalSearchParams } from "expo-router";

import { PaymentSuccessScreen } from "@/features/checkout";

export default function Route() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  return <PaymentSuccessScreen orderId={orderId} />;
}
