import { Pressable, StyleSheet, View, type PressableProps } from "react-native";

import { Icon, type IconName } from "../icons";
import { colors, type ColorName } from "../theme/colors";

type IconButtonVariant = "surface" | "soft" | "solid" | "scrim" | "linen" | "danger" | "ghost";

export interface IconButtonProps extends Omit<PressableProps, "children"> {
  name: IconName;
  /** Outer diameter. Figma uses 26, 36, 38, 40, 44, 48 and 56. */
  size?: number;
  iconSize?: number;
  variant?: IconButtonVariant;
  color?: ColorName;
  filled?: boolean;
  /** Small dot in the corner, e.g. unread notifications. */
  badge?: boolean;
  accessibilityLabel: string;
}

const VARIANTS: Record<IconButtonVariant, { bg: string; fg: ColorName; border?: string }> = {
  surface: { bg: colors.white, fg: "ink", border: colors.line },
  soft: { bg: colors.goldSoft, fg: "forest" },
  solid: { bg: colors.forest, fg: "cream" },
  scrim: { bg: colors.scrim, fg: "ink" },
  linen: { bg: colors.linen, fg: "forest" },
  danger: { bg: colors.terracottaSoft, fg: "terracotta" },
  ghost: { bg: "transparent", fg: "ink" },
};

/** Round icon button. Non-pressable when `onPress` is missing (used as an icon badge). */
export function IconButton({
  name,
  size = 44,
  iconSize,
  variant = "surface",
  color,
  filled,
  badge,
  style,
  onPress,
  ...rest
}: IconButtonProps) {
  const v = VARIANTS[variant];
  const glyph = iconSize ?? Math.round(size * 0.45);

  return (
    <Pressable
      accessibilityRole={onPress ? "button" : "image"}
      disabled={!onPress}
      onPress={onPress}
      hitSlop={size < 40 ? 6 : 0}
      style={(state) => [
        styles.base,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: v.bg },
        v.border && { borderWidth: 1, borderColor: v.border },
        state.pressed && styles.pressed,
        typeof style === "function" ? style(state) : style,
      ]}
      {...rest}
    >
      <Icon name={name} size={glyph} color={color ?? v.fg} filled={filled} />
      {badge && <View style={[styles.badge, { right: size * 0.18, top: size * 0.18 }]} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: "center", justifyContent: "center" },
  pressed: { opacity: 0.7 },
  badge: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.terracotta,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
});
