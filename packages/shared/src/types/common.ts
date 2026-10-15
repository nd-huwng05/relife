/** ISO 8601 timestamp in UTC, e.g. "2026-10-14T12:00:00.000Z". Shown in Vietnam time. */
export type IsoDateTime = string;

/** Local wall-clock time in Vietnam, "HH:mm". Used for recurring hours and templates. */
export type LocalTime = string;

export interface GeoPoint {
  lat: number;
  lng: number;
}

/**
 * Key of a photo. In the mock API it maps to a bundled image; with Firebase it becomes
 * a Storage path. Keep it a string so both work.
 */
export type PhotoRef = string;
