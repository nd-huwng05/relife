import type { ReactNode } from "react";
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { Icon, type IconName } from "../icons";
import { colors, type ColorName } from "../theme/colors";
import { radius } from "../theme/spacing";
import { Text } from "./Text";

export interface SectionHeaderProps {
  title: string;
  accessory?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

/** Playfair section title with an optional Champagne action: "Sắp hết giờ ... Xem tất cả". */
export function SectionHeader({ title, accessory, actionLabel, onAction }: SectionHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text variant="section">{title}</Text>
        {accessory}
      </View>
      {actionLabel && (
        <Pressable accessibilityRole="button" onPress={onAction} hitSlop={8}>
          <Text variant="labelStrong" color="champagne">
            {actionLabel}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

/** Small caps group label: "HÔM NAY", "ĐƠN HÀNG". */
export function Overline({ children, color = "stone", icon }: { children: string; color?: ColorName; icon?: IconName }) {
  return (
    <View style={styles.overline}>
      {icon && <Icon name={icon} size={16} color={color} />}
      <Text variant="overline" color={color} style={styles.overlineText}>
        {children}
      </Text>
    </View>
  );
}

type NoteTone = "outline" | "soft" | "danger" | "warning" | "plain";

export interface InfoNoteProps {
  icon?: IconName;
  children: ReactNode;
  tone?: NoteTone;
  style?: StyleProp<ViewStyle>;
}

/** Icon + explanatory text block, e.g. "Vị trí không được chia sẻ với tiệm…". */
export function InfoNote({ icon = "info", children, tone = "outline", style }: InfoNoteProps) {
  const bg =
    tone === "danger"
      ? colors.terracottaSoft
      : tone === "warning"
        ? colors.amberSoft
        : tone === "soft"
          ? "rgba(239, 227, 203, 0.6)"
          : tone === "plain"
            ? "transparent"
            : colors.card;
  const iconColor: ColorName = tone === "danger" ? "terracotta" : tone === "warning" ? "amber" : tone === "plain" ? "stone" : "forest";
  return (
    <View
      style={[
        styles.note,
        { backgroundColor: bg },
        tone === "outline" && styles.noteBorder,
        tone === "plain" && styles.notePlain,
        style,
      ]}
    >
      <Icon name={icon} size={tone === "plain" ? 16 : 18} color={iconColor} />
      <View style={styles.noteText}>
        {typeof children === "string" ? (
          <Text variant="small" color={tone === "plain" ? "stone" : "ink"}>
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  overline: { flexDirection: "row", alignItems: "center", gap: 6 },
  overlineText: { fontSize: 13, lineHeight: 16, letterSpacing: 1.3 },
  note: { flexDirection: "row", gap: 10, paddingHorizontal: 14, paddingVertical: 12, borderRadius: radius.lg, alignItems: "flex-start" },
  noteBorder: { borderWidth: 1, borderColor: colors.line },
  notePlain: { padding: 0, alignItems: "center" },
  noteText: { flex: 1 },
});
