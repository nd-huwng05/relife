import { colors, type ColorName } from "@relife/ui";
import { StyleSheet, Text } from "react-native";

/** "RELIFE" wordmark in spaced Playfair, as on the onboarding and sign-in screens. */
export function BrandWord({ color = "champagne" }: { color?: ColorName }) {
  return <Text style={[styles.word, { color: colors[color] }]}>RELIFE</Text>;
}

const styles = StyleSheet.create({
  word: { fontFamily: "PlayfairDisplay_700Bold", fontSize: 15, letterSpacing: 3.3 },
});
