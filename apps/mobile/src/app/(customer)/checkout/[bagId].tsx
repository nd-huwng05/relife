import { useLocalSearchParams } from "expo-router";

import { ConfirmOrderScreen } from "@/features/checkout";

export default function Route() {
  const { bagId } = useLocalSearchParams<{ bagId: string }>();
  return <ConfirmOrderScreen bagId={bagId} />;
}
