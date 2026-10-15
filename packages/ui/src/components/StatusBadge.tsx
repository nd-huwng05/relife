import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { colors, type ColorName } from "../theme/colors";
import { radius } from "../theme/spacing";
import { Text } from "./Text";

export type StatusTone = "success" | "warning" | "danger" | "neutral" | "dark";

const TONES: Record<StatusTone, { bg: string; fg: ColorName }> = {
  success: { bg: colors.successSoft, fg: "success" },
  warning: { bg: colors.amberSoft, fg: "amber" },
  danger: { bg: colors.terracottaSoft, fg: "terracotta" },
  neutral: { bg: colors.stoneSoft, fg: "stone" },
  dark: { bg: colors.forest, fg: "cream" },
};

export interface StatusBadgeProps {
  label: string;
  tone: StatusTone;
  style?: StyleProp<ViewStyle>;
}

/** Dot + label pill: "Sẵn sàng nhận", "Chờ xác nhận", "Đã hủy", "Nháp", "Đang bán". */
export function StatusBadge({ label, tone, style }: StatusBadgeProps) {
  const t = TONES[tone];
  return (
    <View style={[styles.base, { backgroundColor: t.bg }, style]}>
      <View style={[styles.dot, { backgroundColor: colors[t.fg] }]} />
      <Text variant="captionStrong" color={t.fg}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
});
