import type { ViewStyle } from "react-native";

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

/** Horizontal padding of every screen in the Figma frames. */
export const screenPadding = spacing.lg;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  sheet: 28,
  full: 999,
} as const;

// Soft shadows tinted with Deep Forest, as in the Figma cards.
export const shadows = {
  card: {
    shadowColor: "#12241F",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 13,
    elevation: 3,
  },
  raised: {
    shadowColor: "#12241F",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
  },
  bar: {
    shadowColor: "#12241F",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
} as const satisfies Record<string, ViewStyle>;
