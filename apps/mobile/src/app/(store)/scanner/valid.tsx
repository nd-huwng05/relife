import { useLocalSearchParams } from "expo-router";

import { ScanValidScreen } from "@/features/pickup";

export default function Route() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  return <ScanValidScreen orderId={orderId} />;
}
