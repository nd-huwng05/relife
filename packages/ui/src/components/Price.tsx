import { formatVnd, type Vnd } from "@relife/shared";
import { StyleSheet } from "react-native";

import { Text, type TextProps } from "./Text";

export interface PriceProps extends Omit<TextProps, "children" | "variant"> {
  amount: Vnd;
  /** Show the original value crossed out next to the price. */
  originalValue?: Vnd;
}

export function Price({ amount, originalValue, ...rest }: PriceProps) {
  return (
    <Text variant="price" {...rest}>
      {formatVnd(amount)}
      {originalValue !== undefined && (
        <Text variant="caption" color="textSecondary" style={styles.original}>
          {"  "}
          {formatVnd(originalValue)}
        </Text>
      )}
    </Text>
  );
}

const styles = StyleSheet.create({
  original: { textDecorationLine: "line-through" },
});
