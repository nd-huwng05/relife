import { Pressable, StyleSheet, View } from "react-native";

import { Icon } from "../icons";
import { colors } from "../theme/colors";
import { Text } from "./Text";

export interface RadioRowProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

/** Label on the left, 20pt radio on the right (sort, cancel reasons). */
export function RadioRow({ label, selected, onPress }: RadioRowProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={styles.row}
      hitSlop={{ top: 8, bottom: 8 }}
    >
      <Text variant={selected ? "bodyStrong" : "body"} color="ink" style={styles.flex}>
        {label}
      </Text>
      <Radio selected={selected} />
    </Pressable>
  );
}

export function Radio({ selected, size = 20 }: { selected: boolean; size?: number }) {
  return (
    <View
      style={[
        styles.radio,
        { width: size, height: size, borderRadius: size / 2 },
        // Figma: selected is a solid Forest dot, unselected a 1.5pt Line ring.
        selected ? { backgroundColor: colors.forest, borderWidth: 0 } : { borderColor: colors.line, borderWidth: 1.5 },
      ]}
    />
  );
}

export interface CheckboxRowProps {
  label: string;
  checked: boolean;
  onPress: () => void;
}

/** 24pt rounded checkbox with a label (A14 self-pickup agreement). */
export function CheckboxRow({ label, checked, onPress }: CheckboxRowProps) {
  return (
    <Pressable accessibilityRole="checkbox" accessibilityState={{ checked }} onPress={onPress} style={styles.check}>
      <View style={[styles.box, checked ? styles.boxOn : styles.boxOff]}>
        {checked && <Icon name="check" size={14} color="cream" />}
      </View>
      <Text variant="label" color="ink" style={[styles.flex, styles.checkLabel]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", minHeight: 24 },
  flex: { flex: 1 },
  radio: { backgroundColor: colors.white },
  check: { flexDirection: "row", alignItems: "center", gap: 10 },
  checkLabel: { fontSize: 14, lineHeight: 18 },
  box: { width: 24, height: 24, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  boxOn: { backgroundColor: colors.forest },
  boxOff: { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.line },
});
