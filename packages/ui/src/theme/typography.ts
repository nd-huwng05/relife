import type { TextStyle } from "react-native";

// Family names match the @expo-google-fonts packages loaded in apps/mobile/src/app/_layout.tsx.
export const fontFamily = {
  heading: "PlayfairDisplay_700Bold",
  body: "Inter_400Regular",
  bodyMedium: "Inter_500Medium",
  bodySemiBold: "Inter_600SemiBold",
} as const;

export const typography = {
  display: { fontFamily: fontFamily.heading, fontSize: 32, lineHeight: 40 },
  title: { fontFamily: fontFamily.heading, fontSize: 24, lineHeight: 32 },
  subtitle: { fontFamily: fontFamily.bodySemiBold, fontSize: 18, lineHeight: 26 },
  body: { fontFamily: fontFamily.body, fontSize: 16, lineHeight: 24 },
  label: { fontFamily: fontFamily.bodyMedium, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: fontFamily.body, fontSize: 12, lineHeight: 16 },
  price: { fontFamily: fontFamily.bodySemiBold, fontSize: 18, lineHeight: 24 },
} as const satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
