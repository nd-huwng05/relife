import { useLocalSearchParams } from "expo-router";

import { PickupCodeScreen } from "@/features/pickup";

export default function Route() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  return <PickupCodeScreen orderId={orderId} />;
}
