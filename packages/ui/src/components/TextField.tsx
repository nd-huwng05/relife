import { useState, type ReactNode } from "react";
import { StyleSheet, TextInput, View, type TextInputProps } from "react-native";

import { colors } from "../theme/colors";
import { radius, spacing } from "../theme/spacing";
import { fontFamily } from "../theme/typography";
import { Text } from "./Text";

export interface TextFieldProps extends TextInputProps {
  label?: string;
  /** Fixed text before the value, e.g. "+84". Shown with a divider. */
  prefix?: string;
  left?: ReactNode;
  right?: ReactNode;
  /** Small label next to the field label, e.g. a "Đã xác minh" chip. */
  labelAccessory?: ReactNode;
  helper?: string;
  error?: string | null;
  /** Green border and helper, e.g. "Hai số tài khoản khớp nhau" (B19). */
  success?: boolean;
  /** Greyed out with Stone text, e.g. a price locked after paid orders (B08). */
  locked?: boolean;
}

/** 54pt field with label above and helper or error below (Figma Foundations). */
export function TextField({
  label,
  prefix,
  left,
  right,
  labelAccessory,
  helper,
  error,
  success = false,
  locked = false,
  editable = true,
  onFocus,
  onBlur,
  style,
  ...rest
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const isFocused = focused;
  const borderColor = error ? colors.terracotta : success ? colors.success : isFocused ? colors.forest : colors.line;

  return (
    <View style={styles.wrap}>
      {(label || labelAccessory) && (
        <View style={styles.labelRow}>
          {label && (
            <Text variant="label" color="stone">
              {label}
            </Text>
          )}
          {labelAccessory}
        </View>
      )}
      <View
        style={[
          styles.box,
          { borderColor, borderWidth: isFocused || error || success ? 1.5 : 1 },
          locked && styles.locked,
        ]}
      >
        {left}
        {prefix && (
          <>
            <Text variant="button" color="ink">
              {prefix}
            </Text>
            <View style={styles.divider} />
          </>
        )}
        <TextInput
          placeholderTextColor={colors.sand}
          editable={editable}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[styles.input, locked && styles.lockedText, style]}
          {...rest}
        />
        {right}
      </View>
      {(error || helper) && (
        <Text variant="caption" color={error ? "terracotta" : success ? "success" : "stone"}>
          {error ?? helper}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6, alignSelf: "stretch" },
  labelRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  box: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
  },
  locked: { backgroundColor: colors.lockedField },
  lockedText: { color: colors.stone },
  divider: { width: 1, height: 22, backgroundColor: colors.line },
  input: {
    flex: 1,
    height: "100%",
    fontFamily: fontFamily.bodyMedium,
    fontSize: 16,
    color: colors.ink,
  },
});
