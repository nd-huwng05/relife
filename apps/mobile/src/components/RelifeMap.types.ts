import type { GeoPoint } from "@relife/shared";
import type { ReactNode, Ref } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export interface MapPinData {
  id: string;
  coordinate: GeoPoint;
  /** Short price label, e.g. "59k". */
  label: string;
}

export interface RelifeMapHandle {
  /** Moves the camera to a point (e.g. "Về vị trí của tôi"). */
  centerOn: (point: GeoPoint) => void;
}

export interface RelifeMapProps {
  center: GeoPoint;
  /** Zoom as the visible latitude span in degrees (smaller is closer). */
  span?: number;
  pins?: MapPinData[];
  selectedId?: string | null;
  onPinPress?: (id: string) => void;
  showsUserLocation?: boolean;
  /** One draggable pin, used to place the store entrance (B01). */
  draggablePin?: { coordinate: GeoPoint; label: string; onChange: (point: GeoPoint) => void };
  style?: StyleProp<ViewStyle>;
  /** Overlays drawn on top of the map (chips, buttons). */
  children?: ReactNode;
  ref?: Ref<RelifeMapHandle>;
}
