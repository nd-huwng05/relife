import { useLocalSearchParams } from "expo-router";

import { PauseBagSheet } from "@/features/bags";

export default function Route() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <PauseBagSheet bagId={id} />;
}
