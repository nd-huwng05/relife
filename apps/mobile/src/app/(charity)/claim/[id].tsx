import { useLocalSearchParams } from "expo-router";

import { ClaimSlipScreen } from "@/features/charity";

export default function Route() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ClaimSlipScreen claimId={id} />;
}
