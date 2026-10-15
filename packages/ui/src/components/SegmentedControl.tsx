import { Pressable, StyleSheet, View } from "react-native";

import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";
import { Text } from "./Text";

export interface SegmentOption<K extends string> {
  key: K;
  label: string;
}

export interface SegmentedControlProps<K extends string> {
  options: readonly SegmentOption<K>[];
  value: K;
  onChange: (key: K) => void;
  /** "soft" (default): white tab on Stone Soft (A21, A26). "pill": Forest pill on white. */
  tone?: "pill" | "soft";
  /** 13pt labels and a 2pt gap (store frames B05, B10, B17). Always on with four or more tabs. */
  dense?: boolean;
}

/** Pill tabs: "Sắp tới · 2 | Hoàn thành | Đã huỷ". */
export function SegmentedControl<K extends string>({ options, value, onChange, tone = "soft", dense = false }: SegmentedControlProps<K>) {
  const soft = tone === "soft";
  const many = dense || options.length >= 4;
  return (
    <View style={[styles.wrap, soft && styles.softWrap, soft && many && styles.softWrapMany]} accessibilityRole="tablist">
      {options.map((o) => {
        const active = o.key === value;
        return (
          <Pressable
            key={o.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(o.key)}
            style={[styles.item, soft && styles.softItem, active && (soft ? styles.softActive : styles.active)]}
          >
            <Text
              variant={active ? "labelStrong" : "label"}
              color={active ? (soft ? "ink" : "cream") : "stone"}
              style={soft && !many && styles.softLabel}
              numberOfLines={1}
            >
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    padding: 4,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
  },
  item: { flex: 1, height: 36, alignItems: "center", justifyContent: "center", borderRadius: radius.full, paddingHorizontal: 6 },
  active: { backgroundColor: colors.forest },
  softWrap: { gap: 4, borderRadius: 16, backgroundColor: colors.stoneSoft, borderWidth: 0 },
  softItem: { height: undefined, paddingVertical: 10, borderRadius: 12 },
  softActive: { backgroundColor: colors.white },
  softWrapMany: { gap: 2 },
  softLabel: { fontSize: 14 },
});
