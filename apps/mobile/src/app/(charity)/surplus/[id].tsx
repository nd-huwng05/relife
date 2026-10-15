import { useLocalSearchParams } from "expo-router";

import { SurplusDetailScreen } from "@/features/charity";

export default function Route() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <SurplusDetailScreen surplusId={id} />;
}
