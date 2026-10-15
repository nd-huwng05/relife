import { colors, spacing, type ColorName } from "@relife/ui";
import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";

import { TAB_BAR_SPACE } from "./FloatingTabBar";

interface ScreenProps {
  children: ReactNode;
  /** Scroll the body (default). Turn off for full-bleed layouts like the map. */
  scroll?: boolean;
  edges?: Edge[];
  /** 24pt side padding from the Figma frames. */
  padded?: boolean;
  /** Fixed above the scrolling body, e.g. <ScreenHeader>. */
  header?: ReactNode;
  /** Fixed below the body, e.g. <BottomBar>. */
  footer?: ReactNode;
  /** Leave room for the floating tab bar on tab screens. */
  withTabBar?: boolean;
  gap?: number;
  background?: ColorName;
  refreshing?: boolean;
  onRefresh?: () => void;
}

/** Base wrapper for every screen: safe area, Linen background, padding and keyboard handling. */
export function Screen({
  children,
  scroll = true,
  edges = ["top"],
  padded = true,
  header,
  footer,
  withTabBar = false,
  gap = spacing.md,
  background = "background",
  refreshing,
  onRefresh,
}: ScreenProps) {
  const contentStyle = [
    padded && styles.padded,
    { gap, paddingBottom: withTabBar ? TAB_BAR_SPACE : footer ? spacing.lg : spacing.xl },
  ];

  return (
    <SafeAreaView edges={edges} style={[styles.safeArea, { backgroundColor: colors[background] }]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        {header}
        {scroll ? (
          <ScrollView
            style={styles.flex}
            contentContainerStyle={[styles.scrollContent, contentStyle]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            refreshControl={
              onRefresh ? <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor={colors.forest} /> : undefined
            }
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.flex, contentStyle]}>{children}</View>
        )}
        {footer}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingTop: spacing.xs },
  padded: { paddingHorizontal: spacing.lg },
});
