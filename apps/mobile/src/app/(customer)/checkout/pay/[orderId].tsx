import { useLocalSearchParams } from "expo-router";

import { PaymentScreen } from "@/features/checkout";

export default function Route() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  return <PaymentScreen orderId={orderId} />;
}
