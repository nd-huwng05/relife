import { colors, radius, shadows, spacing } from "@relife/ui";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** White sticky bar with rounded top corners for the main action of a screen. */
export function BottomBar({ children, plain = false }: { children: ReactNode; plain?: boolean }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, plain && styles.plain, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
      {children}
    </View>
  );
}

/** Two buttons side by side inside a BottomBar: a narrow secondary and a wide primary. */
export function ButtonRow({ children }: { children: ReactNode }) {
  return <View style={styles.row}>{children}</View>;
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.sheet - 2,
    borderTopRightRadius: radius.sheet - 2,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
    ...shadows.bar,
  },
  plain: { backgroundColor: "transparent", shadowOpacity: 0, elevation: 0 },
  row: { flexDirection: "row", gap: spacing.sm },
});
