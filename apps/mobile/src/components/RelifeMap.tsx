import { Icon, Text, colors, radius } from "@relife/ui";
import { useEffect, useImperativeHandle, useRef, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, UrlTile } from "react-native-maps";

import { FakeMap } from "./FakeMap";

import type { RelifeMapProps } from "./RelifeMap.types";

export type { MapPinData, RelifeMapHandle } from "./RelifeMap.types";

// Real map. iOS uses Apple Maps (no API key, works in Expo Go). On Android the Google Maps
// view is kept, but its own tiles need an API key that Expo Go does not provide, so the map
// draws OpenStreetMap tiles from CARTO instead (free for development, attribution required).
// TODO(S3): switch provider if the team picks Google Maps or Goong (Notion IM3, due 23/10).
const ANDROID_TILES = "https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png";
const isAndroid = Platform.OS === "android";

/** Price pin from the Figma map: Forest, or Champagne when selected. */
function PriceBubble({ label, selected }: { label: string; selected: boolean }) {
  return (
    // collapsable={false} keeps the view so Android can snapshot it as the marker image.
    <View collapsable={false} style={[styles.pin, { backgroundColor: selected ? colors.champagne : colors.forest }]}>
      <Icon name="bag" size={14} color={selected ? "deepForest" : "cream"} />
      <Text variant="labelStrong" color={selected ? "deepForest" : "cream"} style={styles.pinText}>
        {label}
      </Text>
    </View>
  );
}

export function RelifeMap({
  center,
  span = 0.03,
  pins = [],
  selectedId,
  onPinPress,
  showsUserLocation = false,
  draggablePin,
  style,
  children,
  ref,
}: RelifeMapProps) {
  const map = useRef<MapView>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  // Google Maps on Android stays blank without Google Play services or a valid key.
  // Show the illustrated map instead of an empty screen if it has not loaded after a while.
  useEffect(() => {
    if (ready) return;
    const id = setTimeout(() => setFailed(true), 8000);
    return () => clearTimeout(id);
  }, [ready]);

  useImperativeHandle(ref, () => ({
    centerOn: (p) => map.current?.animateToRegion({ latitude: p.lat, longitude: p.lng, latitudeDelta: span, longitudeDelta: span }, 400),
  }));

  return (
    <View style={[styles.wrap, isAndroid && styles.noClip, style]}>
      <MapView
        ref={map}
        provider={isAndroid ? PROVIDER_GOOGLE : undefined}
        mapType={isAndroid ? "none" : "standard"}
        onMapReady={() => setReady(true)}
        style={StyleSheet.absoluteFill}
        initialRegion={{ latitude: center.lat, longitude: center.lng, latitudeDelta: span, longitudeDelta: span }}
        showsUserLocation={showsUserLocation}
        showsMyLocationButton={false}
        showsPointsOfInterests={false}
        toolbarEnabled={false}
      >
        {isAndroid && <UrlTile urlTemplate={ANDROID_TILES} maximumZ={19} shouldReplaceMapContent />}
        {pins.map((p) => (
          <Marker
            key={`${p.id}-${p.id === selectedId}`}
            coordinate={{ latitude: p.coordinate.lat, longitude: p.coordinate.lng }}
            onPress={() => onPinPress?.(p.id)}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <PriceBubble label={p.label} selected={p.id === selectedId} />
          </Marker>
        ))}
        {draggablePin && (
          <Marker
            draggable
            coordinate={{ latitude: draggablePin.coordinate.lat, longitude: draggablePin.coordinate.lng }}
            onDragEnd={(e) => draggablePin.onChange({ lat: e.nativeEvent.coordinate.latitude, lng: e.nativeEvent.coordinate.longitude })}
            title={draggablePin.label}
            pinColor={colors.forest}
          />
        )}
      </MapView>
      {failed && !ready && <FakeMap style={StyleSheet.absoluteFill} />}
      {isAndroid && (
        <View style={styles.attribution} pointerEvents="none">
          <Text style={styles.attributionText}>© OpenStreetMap · © CARTO</Text>
        </View>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { overflow: "hidden", backgroundColor: colors.mapBase },
  // Clipping a Google MapView on Android can leave it blank.
  noClip: { overflow: "visible" },
  pin: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingLeft: 10,
    paddingRight: 12,
    paddingVertical: 7,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.white,
  },
  pinText: { fontFamily: "Inter_700Bold" },
  attribution: { position: "absolute", right: 6, top: 6, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, backgroundColor: "rgba(255, 255, 255, 0.8)" },
  attributionText: { fontSize: 9, color: colors.stone },
});
