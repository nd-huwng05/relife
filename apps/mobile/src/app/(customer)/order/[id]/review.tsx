import { useLocalSearchParams } from "expo-router";

import { ReviewScreen } from "@/features/pickup";

export default function Route() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ReviewScreen orderId={id} />;
}
