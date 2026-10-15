import type { GeoPoint } from "@relife/shared";
import * as Location from "expo-location";
import { useCallback, useEffect, useState } from "react";

/** Cầu Giấy, Hà Nội: where the demo stores are, used when the user's location is unknown. */
export const DEFAULT_CENTER: GeoPoint = { lat: 21.0346, lng: 105.79 };

export type LocationStatus = "unknown" | "granted" | "denied";

/** Asks for foreground location permission (A03). Returns true when granted. */
export async function requestLocationPermission(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === Location.PermissionStatus.GRANTED;
}

/** Straight-line distance in km between two points (haversine). */
export function distanceKm(a: GeoPoint, b: GeoPoint): number {
  const R = 6371;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

async function readLocation(): Promise<{ status: LocationStatus; position: GeoPoint | null }> {
  const perm = await Location.getForegroundPermissionsAsync();
  if (perm.status !== Location.PermissionStatus.GRANTED) {
    return { status: perm.status === Location.PermissionStatus.DENIED ? "denied" : "unknown", position: null };
  }
  const last = await Location.getLastKnownPositionAsync({ maxAge: 5 * 60_000 });
  const fix = last ?? (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }));
  return { status: "granted", position: { lat: fix.coords.latitude, lng: fix.coords.longitude } };
}

/**
 * The user's position if they allowed location, without prompting again.
 * Call `request()` to show the system prompt.
 */
export function useUserLocation() {
  const [status, setStatus] = useState<LocationStatus>("unknown");
  const [position, setPosition] = useState<GeoPoint | null>(null);

  useEffect(() => {
    let alive = true;
    readLocation()
      .then((r) => {
        if (!alive) return;
        setStatus(r.status);
        setPosition(r.position);
      })
      .catch(() => alive && setStatus("denied"));
    return () => {
      alive = false;
    };
  }, []);

  const request = useCallback(async () => {
    const granted = await requestLocationPermission();
    if (!granted) {
      setStatus("denied");
      return false;
    }
    const r = await readLocation();
    setStatus(r.status);
    setPosition(r.position);
    return true;
  }, []);

  return { status, position, request };
}
