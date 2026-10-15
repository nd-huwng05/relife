import { LoadingView } from "@relife/ui";
import { Stack } from "expo-router";

import { useStoreAccess } from "@/features/store-admin";

// Approved stores get the tabs; others only see their application status (B01–B03).
export default function StoreLayout() {
  const { isLoading, approved } = useStoreAccess();
  if (isLoading) return <LoadingView />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!approved}>
        <Stack.Screen name="status" />
      </Stack.Protected>
      <Stack.Protected guard={approved}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="scanner/index" options={{ presentation: "fullScreenModal", animation: "fade" }} />
        <Stack.Screen name="scanner/valid" options={{ presentation: "fullScreenModal", animation: "fade", gestureEnabled: false }} />
        <Stack.Screen name="scanner/invalid" options={{ presentation: "fullScreenModal", animation: "fade" }} />
        <Stack.Screen name="bags/new" options={{ presentation: "modal" }} />
        <Stack.Screen name="bags/[id]/pause" options={{ presentation: "transparentModal", animation: "fade" }} />
      </Stack.Protected>
      <Stack.Screen name="register" />
      <Stack.Screen name="training" options={{ presentation: "modal" }} />
    </Stack>
  );
}
