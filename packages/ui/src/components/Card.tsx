import type { ReactNode } from "react";
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { colors } from "../theme/colors";
import { radius, shadows } from "../theme/spacing";

type CardVariant = "outline" | "elevated" | "soft" | "danger" | "dark" | "plain";

const VARIANTS: Record<CardVariant, ViewStyle> = {
  outline: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line },
  elevated: { backgroundColor: colors.card, ...shadows.card },
  soft: { backgroundColor: "rgba(239, 227, 203, 0.6)" },
  danger: { backgroundColor: colors.terracottaSoft },
  dark: { backgroundColor: colors.deepForest },
  plain: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line },
};

export interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  padding?: number;
  gap?: number;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

/** Rounded container used for every grouped block in the Figma screens. */
export function Card({ children, variant = "outline", padding = 16, gap, onPress, accessibilityLabel, style }: CardProps) {
  const body = [styles.base, VARIANTS[variant], { padding, gap }, style];
  if (!onPress) return <View style={body}>{children}</View>;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [body, pressed && styles.pressed]}
    >
      {children}
    </Pressable>
  );
}

export function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.divider, style]} />;
}

const styles = StyleSheet.create({
  base: { borderRadius: radius.xl, overflow: "hidden" },
  pressed: { opacity: 0.85 },
  divider: { height: 1, backgroundColor: colors.line, alignSelf: "stretch" },
});
