import { Pressable, StyleSheet, View } from "react-native";

import { Icon } from "../icons";

export interface StarRatingProps {
  value: number;
  size?: number;
  gap?: number;
  /** Makes the stars tappable (A24). */
  onChange?: (value: number) => void;
}

/** Five Champagne stars; filled up to `value`. */
export function StarRating({ value, size = 16, gap = 2, onChange }: StarRatingProps) {
  return (
    <View style={[styles.row, { gap }]} accessibilityLabel={`${value} trên 5 sao`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const star = <Icon name="star" size={size} color={n <= value ? "champagne" : "line"} filled={n <= value} />;
        if (!onChange) return <View key={n}>{star}</View>;
        return (
          <Pressable key={n} accessibilityRole="button" accessibilityLabel={`${n} sao`} onPress={() => onChange(n)} hitSlop={4}>
            {star}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
});
