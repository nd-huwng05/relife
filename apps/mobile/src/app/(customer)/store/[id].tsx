import { useLocalSearchParams } from "expo-router";

import { StorePageScreen } from "@/features/bags";

export default function Route() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <StorePageScreen storeId={id} />;
}
