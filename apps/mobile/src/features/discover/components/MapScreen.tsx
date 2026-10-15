import { formatVndShort } from "@relife/shared";
import { Button, Chip, Icon, IconButton, LoadingView, Text, colors, radius, spacing } from "@relife/ui";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTabBarTop } from "@/components/FloatingTabBar";
import { RelifeMap, type RelifeMapHandle } from "@/components/RelifeMap";
import { BagRow } from "@/features/bags";
import { DEFAULT_CENTER, distanceKm, useUserLocation } from "@/lib/location";

import { useMapBags } from "../hooks/useDiscover";

/** Beyond this distance the demo stores are out of view, so the map stays on them. */
const NEARBY_KM = 30;

/** A11 Map: real map with price pins and a bag card for the selected pin. */
export function MapScreen() {
  const insets = useSafeAreaInsets();
  const tabBarTop = useTabBarTop();
  const query = useMapBags();
  const location = useUserLocation();
  const map = useRef<RelifeMapHandle>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const bags = query.data?.bags ?? [];
  const selected = bags.find((b) => b.bag.id === selectedId) ?? bags[0];
  const userNearby = location.position && distanceKm(location.position, DEFAULT_CENTER) < NEARBY_KM;
  const center = userNearby && location.position ? location.position : DEFAULT_CENTER;

  const locate = async () => {
    if (location.position) map.current?.centerOn(location.position);
    else await location.request();
  };

  if (query.isPending) return <LoadingView />;

  return (
    <View style={styles.root}>
      <RelifeMap
        ref={map}
        style={StyleSheet.absoluteFill}
        center={center}
        span={0.025}
        showsUserLocation={location.status === "granted"}
        pins={bags.map(({ bag, coordinate }) => ({ id: bag.id, coordinate, label: formatVndShort(bag.price) }))}
        selectedId={selected?.bag.id}
        onPinPress={setSelectedId}
      />

      <View style={[styles.top, { top: insets.top + spacing.xs }]}>
        <View style={styles.searchRow}>
          <Pressable accessibilityRole="search" onPress={() => router.push("/search")} style={styles.search}>
            <Icon name="search" size={20} color="stone" />
            <Text variant="body" color="stone">
              Tìm quanh {query.data?.areaLabel ?? "bạn"}
            </Text>
          </Pressable>
          <IconButton name="home" size={52} iconSize={23} variant="solid" onPress={() => router.navigate("/(customer)/(tabs)")} accessibilityLabel="Về Khám phá" />
        </View>
        {location.position && !userNearby && (
          <Chip label="Đang xem tiệm mẫu ở Cầu Giấy, Hà Nội" tone="outline" icon="info" style={styles.notice} />
        )}
      </View>

      <View style={[styles.bottom, { bottom: tabBarTop + 14 }]}>
        <IconButton
          name="nav"
          size={48}
          iconSize={22}
          variant="surface"
          style={styles.locate}
          onPress={locate}
          accessibilityLabel={location.position ? "Về vị trí của tôi" : "Bật vị trí"}
        />
        {selected && (
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <BagRow bag={selected.bag} onPress={() => router.push(`/bag/${selected.bag.id}`)} />
            <Button title="Xem túi bánh" size="md" onPress={() => router.push(`/bag/${selected.bag.id}`)} />
          </View>
        )}
      </View>
    </View>
  );
}

const shadow = {
  shadowColor: colors.deepForest,
  shadowOpacity: 0.12,
  shadowRadius: 9,
  shadowOffset: { width: 0, height: 6 },
  elevation: 4,
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.linen },
  top: { position: "absolute", left: spacing.lg, right: spacing.lg, gap: spacing.xs },
  searchRow: { flexDirection: "row", gap: 10 },
  search: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingLeft: 18,
    ...shadow,
  },
  notice: { ...shadow },
  bottom: { position: "absolute", left: 16, right: 16, gap: 12 },
  locate: { alignSelf: "flex-end", marginRight: 8, ...shadow },
  sheet: {
    backgroundColor: colors.linen,
    borderRadius: radius.sheet,
    padding: 16,
    paddingTop: 26,
    gap: 14,
    ...shadow,
    shadowOpacity: 0.2,
  },
  handle: { position: "absolute", top: 10, alignSelf: "center", width: 40, height: 5, borderRadius: 3, backgroundColor: colors.line },
});
