import { useLocalSearchParams } from "expo-router";

import { PaymentMethodScreen } from "@/features/checkout";

export default function Route() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  return <PaymentMethodScreen orderId={orderId} />;
}
