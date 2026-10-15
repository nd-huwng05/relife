import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { colors } from "../theme/colors";
import { fontFamily } from "../theme/typography";
import { Text } from "./Text";

export interface AvatarProps {
  name: string;
  size?: number;
  /** "gold": Gold Soft with a Playfair letter. "dark": Forest with Champagne letter. "linen": customers in store lists (Inter Bold). */
  tone?: "gold" | "dark" | "linen";
  style?: StyleProp<ViewStyle>;
}

/** Round initial avatar used for people and stores. */
export function Avatar({ name, size = 44, tone = "gold", style }: AvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  const bg = tone === "dark" ? colors.forest : colors.goldSoft;
  const fg = tone === "dark" ? colors.champagne : colors.forest;
  return (
    <View style={[styles.base, { width: size, height: size, borderRadius: size / 2, backgroundColor: bg }, style]}>
      <Text
        style={{ fontFamily: tone === "linen" ? fontFamily.number : fontFamily.heading, fontSize: tone === "linen" ? size * 0.4 : size * 0.42, color: fg }}
      >
        {initial}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: "center", justifyContent: "center" },
});
