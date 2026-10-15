import { useLocalSearchParams } from "expo-router";

import { RegistrationScreen } from "@/features/store-admin";

export default function Route() {
  const { step, mode } = useLocalSearchParams<{ step?: string; mode?: "signup" | "edit" }>();
  return <RegistrationScreen initialStep={Number(step ?? 1)} mode={mode ?? "signup"} />;
}
