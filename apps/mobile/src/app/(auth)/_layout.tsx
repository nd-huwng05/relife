import { Stack } from "expo-router";

// A01 Splash → A02 Onboarding → A03 Location → A04 Sign in → A05 Phone → A06 OTP → A07 Profile.
export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="welcome">
      <Stack.Screen name="welcome" options={{ animation: "fade" }} />
      <Stack.Screen name="onboarding" options={{ animation: "fade" }} />
      <Stack.Screen name="login" options={{ animation: "fade" }} />
    </Stack>
  );
}
