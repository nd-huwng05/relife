import { Icon, Text, colors, shadows, type IconName } from "@relife/ui";
import type { BottomTabBarProps } from "expo-router/js-tabs";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** Space to leave under scrolling content so the floating bar never covers it. */
export const TAB_BAR_SPACE = 120;

const BAR_HEIGHT = 70;

/** Distance from the screen bottom to the bar's bottom edge. */
function barOffset(bottomInset: number) {
  return Math.max(bottomInset - 6, 12);
}

/** Distance from the screen bottom to the top of the floating bar, for overlays placed above it. */
export function useTabBarTop() {
  return barOffset(useSafeAreaInsets().bottom) + BAR_HEIGHT;
}

export interface TabItem {
  name: string;
  label: string;
  icon: IconName;
}

/** Deep Forest pill tab bar from the Figma Foundations page (Customer, Store and Charity). */
export function FloatingTabBar({ state, navigation, items }: BottomTabBarProps & { items: TabItem[] }) {
  const insets = useSafeAreaInsets();
  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom: barOffset(insets.bottom) }]}>
      <View style={styles.bar}>
        {items.map((item) => {
          const index = state.routes.findIndex((r) => r.name === item.name);
          if (index < 0) return null;
          const route = state.routes[index];
          const focused = state.index === index;
          return (
            <Pressable
              key={item.name}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={item.label}
              style={styles.item}
              onPress={() => {
                const event = navigation.emit({ type: "tabPress", target: route?.key, canPreventDefault: true });
                if (!focused && !event.defaultPrevented && route) navigation.navigate(route.name);
              }}
            >
              <Icon name={item.icon} size={22} color={focused ? "champagne" : "sage"} />
              <Text variant="tab" color={focused ? "champagne" : "sage"} style={focused && styles.focusedLabel} numberOfLines={1}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "absolute", left: 16, right: 16 },
  bar: {
    height: BAR_HEIGHT,
    borderRadius: 35,
    backgroundColor: colors.deepForest,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    ...shadows.raised,
  },
  item: { flex: 1, alignItems: "center", gap: 5, paddingVertical: 8 },
  focusedLabel: { fontFamily: "Inter_600SemiBold" },
});
