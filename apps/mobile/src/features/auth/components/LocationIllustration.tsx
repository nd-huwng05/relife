import { Icon, Text, colors, fontFamily, radius, shadows } from "@relife/ui";
import { StyleSheet, View, type ViewStyle } from "react-native";

// The stylized map on A03, drawn from the Figma frame "Map" (345 x 330).

const blocks: ViewStyle[] = [
  { left: 20, top: 30, width: 120, height: 90 },
  { left: 170, top: 20, width: 150, height: 110 },
  { left: 30, top: 170, width: 90, height: 140 },
  { left: 150, top: 180, width: 120, height: 80 },
  { left: 300, top: 170, width: 110, height: 150 },
  { left: 160, top: 300, width: 160, height: 120 },
  { left: 340, top: 40, width: 90, height: 100 },
];

function Pin({ left, top, label }: { left: number; top: number; label: string }) {
  return (
    <View style={[styles.pin, { left, top }]}>
      <Icon name="bag" size={14} color="cream" />
      <Text style={styles.pinText}>{label}</Text>
    </View>
  );
}

export function LocationIllustration({ style }: { style?: ViewStyle }) {
  return (
    <View style={[styles.map, style]}>
      {blocks.map((b, i) => (
        <View key={i} style={[styles.block, b]} />
      ))}
      <View style={[styles.block, styles.park]} />
      <View style={[styles.road, { left: 0, top: 140, width: 385, height: 14 }]} />
      <View style={[styles.road, { left: 130, top: -20, width: 14, height: 370 }]} />
      <View style={[styles.road, { left: 304, top: -20, width: 12, height: 370, transform: [{ rotate: "-6deg" }] }]} />
      <Pin left={40} top={60} label="59k" />
      <Pin left={220} top={40} label="45k" />
      <Pin left={250} top={230} label="35k" />
      <View style={styles.radius} />
      <View style={styles.dot} />
      <View style={styles.chip}>
        <Icon name="nav" size={15} color="ink" />
        <Text style={styles.chipText}>3 tiệm có bánh trong 1 km</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: { height: 330, borderRadius: 32, overflow: "hidden", backgroundColor: colors.mapBase },
  block: { position: "absolute", backgroundColor: colors.mapBlock, borderRadius: 10 },
  park: { left: 150, top: 300, width: 160, height: 120, backgroundColor: colors.mapPark, borderRadius: 14 },
  road: { position: "absolute", backgroundColor: colors.white },
  pin: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingLeft: 10,
    paddingRight: 12,
    paddingVertical: 7,
    borderRadius: radius.full,
    backgroundColor: colors.forest,
    shadowColor: colors.deepForest,
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  pinText: { fontFamily: fontFamily.number, fontSize: 13, color: colors.cream },
  radius: { position: "absolute", left: 112, top: 105, width: 120, height: 120, borderRadius: 60, backgroundColor: "rgba(201, 169, 110, 0.18)" },
  dot: {
    position: "absolute",
    left: 161,
    top: 154,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.forest,
    borderWidth: 4,
    borderColor: colors.white,
    shadowColor: colors.deepForest,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  chip: {
    position: "absolute",
    left: 16,
    top: 280,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    ...shadows.card,
  },
  chipText: { fontFamily: fontFamily.bodySemiBold, fontSize: 13, color: colors.ink },
});
