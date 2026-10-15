import { useLocalSearchParams } from "expo-router";

import { TrainingScreen } from "@/features/store-admin";

export default function Route() {
  const { card } = useLocalSearchParams<{ card?: string }>();
  return <TrainingScreen initialCard={Number(card ?? 0)} />;
}
