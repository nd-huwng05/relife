import { formatVnd, type Vnd } from "@relife/shared";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import type { ColorName } from "../theme/colors";
import { Text } from "./Text";

const SIZES = {
  lg: { amount: "numberLarge", original: "body", gap: 10 },
  md: { amount: "price", original: "small", gap: 8 },
  sm: { amount: "priceSmall", original: "caption", gap: 6 },
} as const;

export interface PriceProps {
  amount: Vnd;
  /** Original value shown crossed out after the price. */
  originalValue?: Vnd;
  size?: keyof typeof SIZES;
  color?: ColorName;
  style?: StyleProp<ViewStyle>;
}

/** Price in Inter Bold with the original value struck through: "59.000đ 180.000đ". */
export function Price({ amount, originalValue, size = "md", color = "forest", style }: PriceProps) {
  const s = SIZES[size];
  return (
    <View style={[styles.row, { gap: s.gap }, style]}>
      <Text variant={s.amount} color={color}>
        {formatVnd(amount)}
      </Text>
      {originalValue !== undefined && (
        <Text variant={s.original} color="stone" style={styles.original}>
          {formatVnd(originalValue)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "baseline" },
  original: { textDecorationLine: "line-through" },
});
