import { useLocalSearchParams } from "expo-router";

import { CancelOrderSheet } from "@/features/pickup";

export default function Route() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <CancelOrderSheet orderId={id} />;
}
