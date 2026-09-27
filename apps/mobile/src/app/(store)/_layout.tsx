import { Stack } from "expo-router";

export default function StoreLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="bags/new" options={{ title: "New bag", presentation: "modal" }} />
    </Stack>
  );
}
