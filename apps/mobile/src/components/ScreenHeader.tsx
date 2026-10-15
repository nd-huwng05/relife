import { IconButton, Text, spacing, type IconName } from "@relife/ui";
import { router } from "expo-router";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

interface ScreenHeaderProps {
  title?: string;
  /** "back" (chevron), "close" (x) or none. */
  leading?: "back" | "close" | "none";
  onLeadingPress?: () => void;
  right?: ReactNode;
  /** Icon button on the right, e.g. share. */
  rightIcon?: IconName;
  onRightPress?: () => void;
  rightLabel?: string;
}

/** 44pt round back button, centered 17pt title, optional right action (Figma stack screens). */
export function ScreenHeader({
  title,
  leading = "back",
  onLeadingPress,
  right,
  rightIcon,
  onRightPress,
  rightLabel,
}: ScreenHeaderProps) {
  const goBack = onLeadingPress ?? (() => (router.canGoBack() ? router.back() : router.replace("/")));
  return (
    <View style={styles.row}>
      <View style={styles.side}>
        {leading !== "none" && (
          <IconButton
            name={leading === "close" ? "x" : "left"}
            variant="surface"
            iconSize={20}
            onPress={goBack}
            accessibilityLabel={leading === "close" ? "Đóng" : "Quay lại"}
          />
        )}
      </View>
      <Text variant="headline" numberOfLines={1} style={styles.title}>
        {title ?? ""}
      </Text>
      <View style={[styles.side, styles.right]}>
        {right}
        {rightIcon && onRightPress && (
          <IconButton name={rightIcon} variant="surface" iconSize={20} onPress={onRightPress} accessibilityLabel={rightLabel ?? ""} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingTop: 0,
    paddingBottom: spacing.xs,
    gap: spacing.xs,
  },
  side: { width: 76, flexDirection: "row" },
  right: { justifyContent: "flex-end" },
  title: { flex: 1, textAlign: "center" },
});
