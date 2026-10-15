import { Stack } from "expo-router";

// Charity role (phase 2, S9). C01 and C02 are reached from Cài đặt while the admin
// approval flow does not exist yet.
export default function CharityLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="claim/[id]" options={{ presentation: "modal" }} />
    </Stack>
  );
}
