import { Stack } from "expo-router";

// Tabs live in (tabs); detail screens (bag, store) are pushed on top of them.
export default function CustomerLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="bag/[id]" options={{ title: "" }} />
      <Stack.Screen name="store/[id]" options={{ title: "" }} />
    </Stack>
  );
}
