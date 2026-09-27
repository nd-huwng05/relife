import "@/global.css";

import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from "@expo-google-fonts/inter";
import { PlayfairDisplay_700Bold } from "@expo-google-fonts/playfair-display";
import { USER_ROLE } from "@relife/shared";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { useSession } from "@/features/auth";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PlayfairDisplay_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });
  const session = useSession();
  const ready = (fontsLoaded || fontError !== null) && !session.isLoading;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  // Each role only sees its own route group; signed-out users only see (auth).
  return (
    <Stack screenOptions={{ headerShown: false }}>
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
    </Stack>
  );
}
