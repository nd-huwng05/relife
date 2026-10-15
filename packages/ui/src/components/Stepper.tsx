import { Pressable, StyleSheet, View } from "react-native";

import { Icon } from "../icons";
import { colors } from "../theme/colors";
import { fontFamily } from "../theme/typography";
import { Text } from "./Text";

export interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: number;
  label: string;
}

/** − value + control used for quantities (A14, B06, B07, B08, C04). */
export function Stepper({ value, onChange, min = 0, max = 99, size = 40, label }: StepperProps) {
  const canDec = value > min;
  const compact = size <= 38;
  const canInc = value < max;
  return (
    <View style={[styles.row, compact && styles.rowCompact]} accessibilityLabel={label}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Giảm ${label}`}
        disabled={!canDec}
        onPress={() => onChange(value - 1)}
        style={[styles.btn, styles.minus, compact && styles.minusCompact, { width: size, height: size, borderRadius: size / 2 }, !canDec && styles.off]}
      >
        <Text color="stone" style={[styles.minusGlyph, compact && styles.minusGlyphCompact]}>
          −
        </Text>
      </Pressable>
      <Text variant="number" color="ink" style={[styles.value, compact && styles.valueCompact]} accessibilityLiveRegion="polite">
        {value}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Tăng ${label}`}
        disabled={!canInc}
        onPress={() => onChange(value + 1)}
        style={[styles.btn, styles.plus, { width: size, height: size, borderRadius: size / 2 }, !canInc && styles.off]}
      >
        <Icon name="plus" size={Math.round(size * 0.45)} color="cream" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 18 },
  btn: { alignItems: "center", justifyContent: "center" },
  minus: { backgroundColor: colors.linen },
  plus: { backgroundColor: colors.forest },
  minusGlyph: { fontFamily: fontFamily.bodyMedium, fontSize: 22, lineHeight: 26, marginTop: -2 },
  value: { minWidth: 14, textAlign: "center", fontSize: 20, lineHeight: 24 },
  off: { opacity: 0.35 },
  rowCompact: { gap: 14 },
  minusCompact: { borderWidth: 1, borderColor: colors.line },
  minusGlyphCompact: { fontFamily: fontFamily.body, fontSize: 20, lineHeight: 24 },
  valueCompact: { fontSize: 18, lineHeight: 22 },
});
