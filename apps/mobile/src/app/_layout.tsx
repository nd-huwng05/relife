import "@/global.css";

import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import { PlayfairDisplay_700Bold } from "@expo-google-fonts/playfair-display";
import { USER_ROLE } from "@relife/shared";
import { colors } from "@relife/ui";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack, type ErrorBoundaryProps } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import { useSession } from "@/features/auth";
import { AppGate, SystemErrorScreen } from "@/features/status";
import { queryClient } from "@/lib/queryClient";

SplashScreen.preventAutoHideAsync();

/** E04: any render error that no screen handled. */
export function ErrorBoundary({ retry }: ErrorBoundaryProps) {
  return <SystemErrorScreen onRetry={retry} />;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PlayfairDisplay_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const session = useSession();
  const ready = (fontsLoaded || fontError !== null) && !session.isLoading;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  // Each role only sees its own route group; signed-out users only see (auth).
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" />
      <AppGate>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Protected guard={!session.role}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
        <Stack.Protected guard={session.role === USER_ROLE.CUSTOMER}>
          <Stack.Screen name="(customer)" />
        </Stack.Protected>
        <Stack.Protected guard={session.role === USER_ROLE.STORE}>
          <Stack.Screen name="(store)" />
        </Stack.Protected>
        <Stack.Protected guard={session.role === USER_ROLE.CHARITY}>
          <Stack.Screen name="(charity)" />
        </Stack.Protected>
        <Stack.Screen name="dev-states" options={{ presentation: "modal" }} />
      </Stack>
      </AppGate>
    </QueryClientProvider>
  );
}
