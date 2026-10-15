import { useImperativeHandle } from "react";

import { FakeMap, MapPin, UserLocation } from "./FakeMap";
import type { RelifeMapProps } from "./RelifeMap.types";

export type { MapPinData, RelifeMapHandle } from "./RelifeMap.types";

// react-native-maps has no web support, so the web build shows the Figma illustration
// with pins placed relative to the center.
export function RelifeMap({ center, span = 0.03, pins = [], selectedId, onPinPress, showsUserLocation, draggablePin, style, children, ref }: RelifeMapProps) {
  useImperativeHandle(ref, () => ({ centerOn: () => {} }));
  const toPoint = (p: { lat: number; lng: number }) => ({
    x: Math.min(0.85, Math.max(0.05, 0.45 + (p.lng - center.lng) / (span * 1.6))),
    y: Math.min(0.8, Math.max(0.1, 0.45 - (p.lat - center.lat) / span)),
  });
  return (
    <FakeMap style={style}>
      {pins.map((p) => (
        <MapPin key={p.id} point={toPoint(p.coordinate)} label={p.label} selected={p.id === selectedId} onPress={() => onPinPress?.(p.id)} />
      ))}
      {draggablePin && <MapPin point={toPoint(draggablePin.coordinate)} label={draggablePin.label} selected />}
      {showsUserLocation && <UserLocation point={toPoint(center)} />}
      {children}
    </FakeMap>
  );
}
