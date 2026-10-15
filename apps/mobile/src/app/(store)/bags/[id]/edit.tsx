import { useLocalSearchParams } from "expo-router";

import { EditBagScreen } from "@/features/bags";

export default function Route() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <EditBagScreen bagId={id} />;
}
