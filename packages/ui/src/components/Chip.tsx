import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { Icon, type IconName } from "../icons";
import { colors, type ColorName } from "../theme/colors";
import { radius } from "../theme/spacing";
import { fontFamily } from "../theme/typography";
import { Text } from "./Text";

type ChipTone = "gold" | "danger" | "dangerSoft" | "outline" | "outlineDanger" | "white" | "scrim" | "success" | "dark";

const TONES: Record<ChipTone, { bg: string; fg: ColorName; border?: string }> = {
  gold: { bg: colors.goldSoft, fg: "forest" },
  danger: { bg: colors.terracotta, fg: "white" },
  dangerSoft: { bg: colors.terracottaSoft, fg: "terracotta" },
  outline: { bg: colors.white, fg: "ink", border: colors.line },
  outlineDanger: { bg: colors.white, fg: "terracotta", border: colors.line },
  white: { bg: colors.white, fg: "stone" },
  scrim: { bg: "rgba(255, 255, 255, 0.94)", fg: "terracotta" },
  success: { bg: colors.successSoft, fg: "success" },
  dark: { bg: colors.forest, fg: "cream" },
};

export interface ChipProps {
  label: string;
  tone?: ChipTone;
  icon?: IconName;
  size?: "sm" | "md";
  style?: StyleProp<ViewStyle>;
}

/** Small rounded label: "Túi bất ngờ", "Còn 2 túi", "-67%". */
export function Chip({ label, tone = "gold", icon, size = "md", style }: ChipProps) {
  const t = TONES[tone];
  const small = size === "sm";
  return (
    <View
      style={[
        styles.base,
        { backgroundColor: t.bg, paddingHorizontal: small ? 8 : 10, paddingVertical: small ? 4 : 6 },
        t.border && { borderWidth: 1, borderColor: t.border },
        style,
      ]}
    >
      {icon && <Icon name={icon} size={small ? 12 : 14} color={t.fg} />}
      <Text
        variant={small ? "overline" : tone === "white" ? "caption" : "captionStrong"}
        color={t.fg}
        style={[small && styles.smallText, tone === "white" && styles.medium]}
      >
        {label}
      </Text>
    </View>
  );
}

export interface SelectChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  icon?: IconName;
  /** "sm": 13pt label with 12/9 padding, as in the B06 form. */
  size?: "md" | "sm";
}

/** Toggleable chip for filters, tags and time slots. */
export function SelectChip({ label, selected, onPress, icon, size = "md" }: SelectChipProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.select,
        size === "sm" && styles.selectSmall,
        selected ? styles.selectOn : styles.selectOff,
        pressed && { opacity: 0.8 },
      ]}
    >
      {icon && <Icon name={icon} size={15} color={selected ? "cream" : "stone"} />}
      <Text style={[styles.selectText, size === "sm" && styles.selectTextSmall, selected && styles.selectTextOn]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 5,
    borderRadius: radius.full,
  },
  smallText: { letterSpacing: 0 },
  medium: { fontFamily: fontFamily.bodyMedium },
  select: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  selectOn: { backgroundColor: colors.forest, borderColor: colors.forest },
  // Figma filter chips: 14pt Inter Medium, Semi Bold and Cream when selected.
  selectText: { fontFamily: fontFamily.bodyMedium, fontSize: 14, color: colors.ink },
  selectTextOn: { fontFamily: fontFamily.bodySemiBold, color: colors.cream },
  selectOff: { backgroundColor: colors.white, borderColor: colors.line },
  selectSmall: { paddingHorizontal: 12, paddingVertical: 9 },
  selectTextSmall: { fontSize: 13 },
});
