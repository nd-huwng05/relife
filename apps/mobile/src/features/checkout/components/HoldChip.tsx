import { formatCountdown } from "@relife/shared";
import { Icon, Text, colors, radius } from "@relife/ui";
import { StyleSheet, View } from "react-native";

/** Full width "Giữ túi cho bạn trong 14:32" banner (A15, A16). */
export function HoldChip({ seconds }: { seconds: number }) {
  return (
    <View style={styles.chip} accessibilityLiveRegion="polite">
      <Icon name="clock" size={15} color="forest" />
      <Text variant="labelStrong" color="forest">
        Giữ túi cho bạn trong <Text variant="labelStrong" color="forest" style={styles.num}>{formatCountdown(seconds)}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.goldSoft,
  },
  num: { fontFamily: "Inter_700Bold" },
});
