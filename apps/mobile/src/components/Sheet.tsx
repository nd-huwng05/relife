import { colors, spacing } from "@relife/ui";
import { router } from "expo-router";
import type { ReactNode } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SheetProps {
  children: ReactNode;
  /** Fixed area at the bottom of the sheet, e.g. the confirm buttons. */
  footer?: ReactNode;
  onClose?: () => void;
  /** Space between content blocks (20 by default, 16 on A23). */
  gap?: number;
}

/**
 * Bottom sheet used by routes presented as a transparent modal (A09, A23, B09).
 * Tapping the dimmed area closes it.
 */
export function Sheet({ children, footer, onClose, gap = 20 }: SheetProps) {
  const insets = useSafeAreaInsets();
  const close = onClose ?? (() => router.back());
  return (
    <View style={styles.root}>
      <Pressable style={StyleSheet.absoluteFill} onPress={close} accessibilityLabel="Đóng" accessibilityRole="button" />
      <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
        <View style={styles.handle} />
        <ScrollView contentContainerStyle={[styles.content, { gap }]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
        {footer && <View style={styles.footer}>{footer}</View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: "flex-end", backgroundColor: colors.overlay },
  sheet: {
    maxHeight: "92%",
    backgroundColor: colors.linen,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  handle: { alignSelf: "center", width: 40, height: 5, borderRadius: 3, backgroundColor: colors.line, marginTop: 10 },
  content: { paddingHorizontal: spacing.lg, paddingTop: 17, paddingBottom: spacing.md },
  footer: { paddingHorizontal: spacing.lg, paddingTop: 14, borderTopWidth: 1, borderTopColor: colors.line, gap: spacing.xs },
});
