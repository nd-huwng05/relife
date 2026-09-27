import { colors, spacing } from "@relife/ui";
import type { ReactNode } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";

interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  edges?: Edge[];
}

/** Base wrapper for every screen: safe area, background and padding. */
export function Screen({ children, scroll = false, edges = ["top"] }: ScreenProps) {
  return (
    <SafeAreaView edges={edges} style={styles.safeArea}>
      {scroll ? (
        <ScrollView contentContainerStyle={styles.content}>{children}</ScrollView>
      ) : (
        children
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  content: { gap: spacing.md },
});
