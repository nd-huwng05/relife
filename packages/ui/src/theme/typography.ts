import type { TextStyle } from "react-native";

// Family names match the @expo-google-fonts packages loaded in apps/mobile/src/app/_layout.tsx.
export const fontFamily = {
  heading: "PlayfairDisplay_700Bold",
  body: "Inter_400Regular",
  bodyMedium: "Inter_500Medium",
  bodySemiBold: "Inter_600SemiBold",
  /** Prices, times, counts and codes (Figma rule: numbers always use Inter Bold). */
  number: "Inter_700Bold",
} as const;

// Scale from the Figma Foundations page. Playfair is only for headings made of words.
export const typography = {
  display: { fontFamily: fontFamily.heading, fontSize: 34, lineHeight: 40 },
  hero: { fontFamily: fontFamily.heading, fontSize: 30, lineHeight: 37 },
  title: { fontFamily: fontFamily.heading, fontSize: 27, lineHeight: 34 },
  titleSmall: { fontFamily: fontFamily.heading, fontSize: 23, lineHeight: 30 },
  section: { fontFamily: fontFamily.heading, fontSize: 19, lineHeight: 25 },
  headline: { fontFamily: fontFamily.bodySemiBold, fontSize: 17, lineHeight: 22 },
  bodyStrong: { fontFamily: fontFamily.bodySemiBold, fontSize: 15, lineHeight: 20 },
  body: { fontFamily: fontFamily.body, fontSize: 15, lineHeight: 21 },
  small: { fontFamily: fontFamily.body, fontSize: 13, lineHeight: 19 },
  label: { fontFamily: fontFamily.bodyMedium, fontSize: 13, lineHeight: 17 },
  labelStrong: { fontFamily: fontFamily.bodySemiBold, fontSize: 13, lineHeight: 17 },
  caption: { fontFamily: fontFamily.body, fontSize: 12, lineHeight: 16 },
  captionStrong: { fontFamily: fontFamily.bodySemiBold, fontSize: 12, lineHeight: 15 },
  overline: { fontFamily: fontFamily.bodySemiBold, fontSize: 11, lineHeight: 13, letterSpacing: 1.3 },
  button: { fontFamily: fontFamily.bodySemiBold, fontSize: 16, lineHeight: 20 },
  tab: { fontFamily: fontFamily.bodyMedium, fontSize: 10, lineHeight: 12 },
  numberXL: { fontFamily: fontFamily.number, fontSize: 37, lineHeight: 44, letterSpacing: -0.7 },
  numberLarge: { fontFamily: fontFamily.number, fontSize: 28, lineHeight: 34, letterSpacing: -0.5 },
  number: { fontFamily: fontFamily.number, fontSize: 21, lineHeight: 26 },
  price: { fontFamily: fontFamily.number, fontSize: 19, lineHeight: 23 },
  priceSmall: { fontFamily: fontFamily.number, fontSize: 15, lineHeight: 18 },
} as const satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
