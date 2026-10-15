import { useLocalSearchParams } from "expo-router";

import { BagDetailScreen } from "@/features/bags";

export default function Route() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <BagDetailScreen bagId={id} />;
}
