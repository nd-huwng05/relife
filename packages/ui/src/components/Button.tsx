import { ActivityIndicator, Pressable, StyleSheet, View, type PressableProps, type StyleProp, type TextStyle } from "react-native";

import { Icon, type IconName } from "../icons";
import { colors, type ColorName } from "../theme/colors";
import { radius, spacing } from "../theme/spacing";
import { Text } from "./Text";

type ButtonVariant = "primary" | "secondary" | "white" | "outline" | "danger" | "dangerOutline" | "dangerSolid" | "soft" | "ghost" | "light";

export interface ButtonProps extends Omit<PressableProps, "children"> {
  title: string;
  variant?: ButtonVariant;
  size?: "lg" | "md" | "sm";
  icon?: IconName;
  loading?: boolean;
  /** Stretch to the width of the parent (default) or hug the label. */
  fullWidth?: boolean;
  /** Override the label, e.g. a 14pt label when two long buttons share a row (A16). */
  labelStyle?: StyleProp<TextStyle>;
}

const VARIANTS: Record<ButtonVariant, { bg: string; fg: ColorName; border?: string; pressed: string }> = {
  primary: { bg: colors.forest, fg: "cream", pressed: colors.deepForest },
  secondary: { bg: colors.white, fg: "ink", border: colors.line, pressed: colors.linen },
  white: { bg: colors.white, fg: "forest", border: colors.line, pressed: colors.linen },
  /** Linen with a Line border and Forest text (A03 "Tự chọn khu vực", A15 "Huỷ đơn"…). */
  outline: { bg: colors.linen, fg: "forest", border: colors.line, pressed: colors.stoneSoft },
  danger: { bg: colors.terracottaSoft, fg: "terracotta", pressed: "#F0D4CA" },
  dangerSolid: { bg: colors.terracotta, fg: "white", pressed: "#9C4632" },
  dangerOutline: { bg: colors.white, fg: "terracotta", border: colors.line, pressed: colors.terracottaSoft },
  soft: { bg: colors.goldSoft, fg: "forest", pressed: "#E6D6B6" },
  ghost: { bg: "transparent", fg: "forest", pressed: "rgba(31, 58, 50, 0.06)" },
  light: { bg: colors.champagne, fg: "deepForest", pressed: "#B8975B" },
};

const HEIGHT = { lg: 56, md: 50, sm: 38 } as const;

/** Pill button from the Figma Foundations page. Disabled shows at 40% opacity. */
export function Button({
  title,
  variant = "primary",
  size = "lg",
  icon,
  loading = false,
  fullWidth = true,
  labelStyle,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const v = VARIANTS[variant];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled, busy: loading }}
      disabled={isDisabled}
      style={(state) => [
        styles.base,
        {
          height: HEIGHT[size],
          borderRadius: radius.full,
          backgroundColor: state.pressed ? v.pressed : v.bg,
          paddingHorizontal: size === "sm" ? spacing.md : spacing.lg,
        },
        v.border && { borderWidth: 1, borderColor: v.border },
        !fullWidth && styles.hug,
        disabled && styles.disabled,
        typeof style === "function" ? style(state) : style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={colors[v.fg]} />
      ) : (
        <View style={styles.content}>
          {icon && <Icon name={icon} size={size === "sm" ? 16 : 20} color={v.fg} />}
          <Text variant={size === "sm" ? "labelStrong" : "button"} color={v.fg} numberOfLines={1} style={labelStyle}>
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: "center", justifyContent: "center", alignSelf: "stretch" },
  hug: { alignSelf: "flex-start" },
  content: { flexDirection: "row", alignItems: "center", gap: 10 },
  disabled: { opacity: 0.4 },
});
