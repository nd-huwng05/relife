import { Pressable, StyleSheet, View } from "react-native";

import { colors } from "../theme/colors";

export interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  accessibilityLabel: string;
}

/** 50 x 30 switch: Forest when on, Line when off. */
export function Toggle({ value, onValueChange, disabled, accessibilityLabel }: ToggleProps) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      hitSlop={8}
      onPress={() => onValueChange(!value)}
      style={[styles.track, { backgroundColor: value ? colors.forest : colors.line }, disabled && styles.disabled]}
    >
      <View style={[styles.knob, value ? styles.on : styles.off]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: { width: 50, height: 30, borderRadius: 15, justifyContent: "center", paddingHorizontal: 3 },
  knob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
    shadowColor: colors.deepForest,
    shadowOpacity: 0.15,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  on: { alignSelf: "flex-end" },
  off: { alignSelf: "flex-start" },
  disabled: { opacity: 0.5 },
});
