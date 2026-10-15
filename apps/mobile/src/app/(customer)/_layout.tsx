import { Stack } from "expo-router";

// Tabs live in (tabs); everything else is pushed on top of them.
export default function CustomerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="filter" options={{ presentation: "transparentModal", animation: "fade" }} />
      <Stack.Screen name="search" options={{ animation: "fade" }} />
      <Stack.Screen name="order/[id]/cancel" options={{ presentation: "transparentModal", animation: "fade" }} />
      <Stack.Screen name="order/[id]/review" options={{ presentation: "modal" }} />
      <Stack.Screen name="pickup/[orderId]" options={{ presentation: "modal" }} />
      <Stack.Screen name="checkout/awaiting/[orderId]" options={{ gestureEnabled: false }} />
      <Stack.Screen name="checkout/success/[orderId]" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
