import { IconButton, Text, colors, fontFamily, type ColorName } from "@relife/ui";
import * as Clipboard from "expo-clipboard";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

/** "Mã đơn  RLF-8K2Q7M  [copy]" row. Shows a check for a moment after copying. */
export function CopyRow({
  label,
  value,
  copyValue,
  large = false,
  compact = false,
  valueColor = "ink",
}: {
  label: string;
  value: string;
  copyValue?: string;
  /** 20pt value, e.g. the amount on A16. */
  large?: boolean;
  /** 15pt value with a 36pt copy button (A19). */
  compact?: boolean;
  valueColor?: ColorName;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <View style={styles.row}>
      <View style={styles.text}>
        <Text variant="caption" color="stone">
          {label}
        </Text>
        <Text color={valueColor} style={[styles.value, large && styles.large, compact && styles.compact]} selectable>
          {value}
        </Text>
      </View>
      <IconButton
        name={copied ? "check" : "copy"}
        size={compact ? 36 : 38}
        iconSize={17}
        variant={copied ? "solid" : "soft"}
        accessibilityLabel={`Sao chép ${label}`}
        onPress={async () => {
          await Clipboard.setStringAsync(copyValue ?? value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  text: { gap: 2, flex: 1 },
  value: { fontFamily: fontFamily.bodySemiBold, fontSize: 16, lineHeight: 20, color: colors.ink },
  large: { fontSize: 20, lineHeight: 25 },
  compact: { fontSize: 15, lineHeight: 19 },
});
