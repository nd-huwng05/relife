import { Icon, Text, colors, radius } from "@relife/ui";
import { Image } from "expo-image";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

// Stylized map from the Figma file. A real map needs react-native-maps and a development
// build, and the provider (Google Maps or Goong) is still being decided (Notion IM3).
// TODO(S3): replace with the real map once the provider is chosen.
const MAP = require("@/assets/images/mock/map.svg");
const USER_DOT = require("@/assets/images/mock/user-location.svg");

/** Position on the illustration, as a fraction of its width and height. */
export interface MapPoint {
  x: number;
  y: number;
}

export function FakeMap({ children, style }: { children?: ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.map, style]}>
      <Image source={MAP} style={StyleSheet.absoluteFill} contentFit="cover" />
      {children}
    </View>
  );
}

const at = (p: MapPoint) => ({ position: "absolute" as const, left: `${p.x * 100}%` as const, top: `${p.y * 100}%` as const });

/** Price pin: Forest by default, Champagne when selected. */
export function MapPin({ point, label, selected, onPress }: { point: MapPoint; label: string; selected?: boolean; onPress?: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Túi bánh ${label}`}
      onPress={onPress}
      style={[at(point), styles.pin, { backgroundColor: selected ? colors.champagne : colors.forest }]}
    >
      <Icon name="bag" size={14} color={selected ? "deepForest" : "cream"} />
      <Text variant="labelStrong" style={{ fontFamily: "Inter_700Bold" }} color={selected ? "deepForest" : "cream"}>
        {label}
      </Text>
    </Pressable>
  );
}

export function MapCluster({ point, count }: { point: MapPoint; count: number }) {
  return (
    <View style={[at(point), styles.cluster]}>
      <Text variant="priceSmall" color="deepForest">
        {count}
      </Text>
    </View>
  );
}

export function UserLocation({ point }: { point: MapPoint }) {
  return <Image source={USER_DOT} style={[at(point), styles.user]} contentFit="contain" />;
}

/** Text label pinned on the map, e.g. "Cửa ra vào" during store registration. */
export function MapLabel({ point, label }: { point: MapPoint; label: string }) {
  return (
    <View style={[at(point), styles.label]}>
      <Icon name="bag" size={14} color="cream" />
      <Text variant="captionStrong" color="cream">
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  map: { overflow: "hidden", backgroundColor: colors.mapBase },
  pin: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingLeft: 10,
    paddingRight: 12,
    paddingVertical: 7,
    borderRadius: radius.full,
    shadowColor: colors.deepForest,
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cluster: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.champagne,
    borderWidth: 3,
    borderColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  user: { width: 36, height: 36, marginLeft: -18, marginTop: -15 },
  label: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radius.full,
    backgroundColor: colors.forest,
  },
});
