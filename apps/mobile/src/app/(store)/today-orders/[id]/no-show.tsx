import { useLocalSearchParams } from "expo-router";

import { NoShowScreen } from "@/features/pickup";

export default function Route() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <NoShowScreen orderId={id} />;
}
