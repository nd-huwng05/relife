import { useLocalSearchParams } from "expo-router";

import { StoreOrderDetailScreen } from "@/features/pickup";

export default function Route() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <StoreOrderDetailScreen orderId={id} />;
}
