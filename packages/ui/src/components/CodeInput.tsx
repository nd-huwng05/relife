import { useRef } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";
import { fontFamily } from "../theme/typography";
import { Text } from "./Text";

export interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  /** "number" for SMS OTP, "text" for pickup codes (letters and digits). */
  kind?: "number" | "text";
  error?: boolean;
  autoFocus?: boolean;
  accessibilityLabel: string;
}

/** Six boxes backed by one hidden input, so paste and SMS autofill work. */
export function CodeInput({ value, onChange, length = 6, kind = "number", error, autoFocus = true, accessibilityLabel }: CodeInputProps) {
  const input = useRef<TextInput>(null);
  const chars = value.split("");

  return (
    <Pressable onPress={() => input.current?.focus()} style={styles.row} accessibilityLabel={accessibilityLabel}>
      {Array.from({ length }, (_, i) => {
        const filled = i < chars.length;
        const active = i === chars.length;
        return (
          <View
            key={i}
            style={[
              styles.box,
              filled && styles.filled,
              active && styles.active,
              error && styles.error,
            ]}
          >
            <Text style={chars[i] ? (/[A-Z]/i.test(chars[i]) ? styles.letter : styles.char) : styles.caret}>{chars[i] ?? (active ? "|" : "")}</Text>
          </View>
        );
      })}
      <TextInput
        ref={input}
        value={value}
        onChangeText={(t) => {
          const clean = kind === "number" ? t.replace(/\D/g, "") : t.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
          onChange(clean.slice(0, length));
        }}
        autoFocus={autoFocus}
        keyboardType={kind === "number" ? "number-pad" : "default"}
        autoCapitalize="characters"
        autoCorrect={false}
        textContentType={kind === "number" ? "oneTimeCode" : "none"}
        autoComplete={kind === "number" ? "sms-otp" : "off"}
        maxLength={length}
        style={styles.hidden}
        caretHidden
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", alignSelf: "stretch" },
  box: {
    width: 50,
    height: 62,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
  },
  // Figma A06: filled boxes get a Champagne border, the current box a 2pt Forest border.
  filled: { borderColor: colors.champagne },
  active: { borderColor: colors.forest, borderWidth: 2 },
  error: { borderColor: colors.terracotta, borderWidth: 2 },
  char: { fontFamily: fontFamily.number, fontSize: 24, letterSpacing: -0.48, color: colors.ink },
  caret: { fontFamily: fontFamily.number, fontSize: 26, color: colors.champagne },
  letter: { fontFamily: fontFamily.heading, fontSize: 26, color: colors.ink },
  hidden: { position: "absolute", opacity: 0, width: 1, height: 1 },
});
