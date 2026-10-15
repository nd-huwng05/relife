import type { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { Icon, type IconName } from "../icons";
import type { ColorName } from "../theme/colors";
import { fontFamily } from "../theme/typography";
import { IconButton } from "./IconButton";
import { Text } from "./Text";

export interface ListRowProps {
  title: string;
  subtitle?: string;
  icon?: IconName;
  iconVariant?: "linen" | "soft" | "danger";
  /** Value text before the chevron, e.g. "7 ngày" or "VCB ••8213". */
  value?: string;
  /** Replaces the chevron, e.g. a Toggle. */
  right?: ReactNode;
  titleColor?: ColorName;
  onPress?: () => void;
  chevron?: boolean;
}

/** Settings row: round icon, title + subtitle, value and chevron or a control. */
export function ListRow({
  title,
  subtitle,
  icon,
  iconVariant = "soft",
  value,
  right,
  titleColor = "ink",
  onPress,
  chevron = !!onPress && !right,
}: ListRowProps) {
  const body = (
    <View style={styles.row}>
      {icon && <IconButton name={icon} size={38} iconSize={17} variant={iconVariant} accessibilityLabel="" />}
      <View style={styles.text}>
        <Text variant="bodyStrong" color={titleColor} style={icon && styles.titleMedium}>
          {title}
        </Text>
        {subtitle && (
          <Text variant="caption" color="stone">
            {subtitle}
          </Text>
        )}
      </View>
      {value && (
        <Text variant="body" color="stone" style={styles.value}>
          {value}
        </Text>
      )}
      {right}
      {chevron && <Icon name="right" size={16} color="ink" />}
    </View>
  );
  if (!onPress) return body;
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      {body}
    </Pressable>
  );
}

export interface KeyValueRowProps {
  label: string;
  value: string;
  strong?: boolean;
  valueColor?: ColorName;
}

/** "Số lượng ........ 1 túi" row inside summary cards. */
export function KeyValueRow({ label, value, strong, valueColor = "ink" }: KeyValueRowProps) {
  return (
    <View style={styles.kv}>
      <Text style={strong ? styles.kvLabelStrong : styles.kvLabel} color={strong ? "ink" : "stone"}>
        {label}
      </Text>
      <Text
        style={[strong ? styles.kvValueStrong : styles.kvLabel, styles.kvValue]}
        color={strong && valueColor === "ink" ? "forest" : valueColor}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12, minHeight: 38 },
  text: { flex: 1, gap: 2 },
  titleMedium: { fontFamily: fontFamily.bodyMedium },
  value: { fontSize: 14, lineHeight: 18 },
  pressed: { opacity: 0.7 },
  kv: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  kvValue: { flexShrink: 1, textAlign: "right" },
  kvLabel: { fontFamily: fontFamily.body, fontSize: 14, lineHeight: 18 },
  kvLabelStrong: { fontFamily: fontFamily.bodySemiBold, fontSize: 16, lineHeight: 20 },
  kvValueStrong: { fontFamily: fontFamily.number, fontSize: 18, lineHeight: 22 },
});
