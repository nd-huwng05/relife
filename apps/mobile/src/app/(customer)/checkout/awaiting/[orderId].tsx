import { useLocalSearchParams } from "expo-router";

import { AwaitingConfirmationScreen } from "@/features/checkout";

export default function Route() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  return <AwaitingConfirmationScreen orderId={orderId} />;
}
