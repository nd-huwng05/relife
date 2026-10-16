import type { IsoDateTime, LocalTime } from "./types/common";

// Times are stored in UTC and shown in Vietnam time (Asia/Ho_Chi_Minh, UTC+7, no DST).
// A fixed offset avoids depending on Intl time zone data, which varies between engines.
const VN_OFFSET_MS = 7 * 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;

const WEEKDAYS_SHORT = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const WEEKDAYS_LONG = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

const pad = (n: number) => String(n).padStart(2, "0");

/** Date whose UTC fields read as Vietnam wall-clock time. */
function vnParts(iso: IsoDateTime) {
  const d = new Date(new Date(iso).getTime() + VN_OFFSET_MS);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
    hours: d.getUTCHours(),
    minutes: d.getUTCMinutes(),
    weekday: d.getUTCDay(),
  };
}

/** "2026-10-14T12:00:00Z" → "19:00" */
export function formatTime(iso: IsoDateTime): string {
  const p = vnParts(iso);
  return `${pad(p.hours)}:${pad(p.minutes)}`;
}

/** "2026-10-14T12:00:04Z" → "19:00:04", for logs and webhook attempts. */
export function formatTimeSeconds(iso: IsoDateTime): string {
  const d = new Date(new Date(iso).getTime() + VN_OFFSET_MS);
  return `${formatTime(iso)}:${pad(d.getUTCSeconds())}`;
}

/** → "19:00 – 20:30" */
export function formatWindow(start: IsoDateTime, end: IsoDateTime): string {
  return `${formatTime(start)} – ${formatTime(end)}`;
}

/** → "26/09" */
export function formatDayMonth(iso: IsoDateTime): string {
  const p = vnParts(iso);
  return `${pad(p.day)}/${pad(p.month)}`;
}

/** → "22/09/2026" */
export function formatDate(iso: IsoDateTime): string {
  const p = vnParts(iso);
  return `${pad(p.day)}/${pad(p.month)}/${p.year}`;
}

/** → "T6" */
export function formatWeekdayShort(iso: IsoDateTime): string {
  return WEEKDAYS_SHORT[vnParts(iso).weekday] ?? "";
}

/** → "Thứ 2" */
export function formatWeekday(iso: IsoDateTime): string {
  return WEEKDAYS_LONG[vnParts(iso).weekday] ?? "";
}

export function isSameVnDay(a: IsoDateTime, b: IsoDateTime): boolean {
  const pa = vnParts(a);
  const pb = vnParts(b);
  return pa.year === pb.year && pa.month === pb.month && pa.day === pb.day;
}

/** Whole minutes from `now` until `iso` (negative when in the past). */
export function minutesUntil(iso: IsoDateTime, now: Date = new Date()): number {
  return Math.round((new Date(iso).getTime() - now.getTime()) / MINUTE_MS);
}

/** 35 → "35 phút", 80 → "1 giờ 20", 72 → "1 giờ 12 phút" (long) */
export function formatDuration(minutes: number, style: "short" | "long" = "short"): string {
  const m = Math.max(0, minutes);
  if (m < 60) return `${m} phút`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  if (rest === 0) return `${h} giờ`;
  return style === "long" ? `${h} giờ ${rest} phút` : `${h} giờ ${rest}`;
}

/** Seconds → "14:32" for hold timers. */
export function formatCountdown(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  return `${Math.floor(s / 60)}:${pad(s % 60)}`;
}

/** UTC ISO string for a Vietnam wall-clock time on the same Vietnam day as `base`. */
export function vnTimeOn(base: Date, time: LocalTime, dayOffset = 0): IsoDateTime {
  const [h = 0, m = 0] = time.split(":").map(Number);
  const local = new Date(base.getTime() + VN_OFFSET_MS);
  const utc = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate() + dayOffset, h, m);
  return new Date(utc - VN_OFFSET_MS).toISOString();
}

/** "Chào buổi sáng / chiều / tối" by Vietnam time. */
export function greeting(now: Date = new Date()): string {
  const h = vnParts(now.toISOString()).hours;
  if (h < 11) return "Chào buổi sáng";
  if (h < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
}

/** UTC ISO → "2026-09-27T17:30", the Vietnam wall-clock value an `<input type="datetime-local">` uses. */
export function toVnDateTimeLocal(iso: IsoDateTime): string {
  return new Date(new Date(iso).getTime() + VN_OFFSET_MS).toISOString().slice(0, 16);
}

/** "2026-09-27T17:30" in Vietnam time → UTC ISO string, or null when the value is not a date. */
export function fromVnDateTimeLocal(value: string): IsoDateTime | null {
  const ms = Date.parse(`${value}:00Z`);
  return Number.isNaN(ms) ? null : new Date(ms - VN_OFFSET_MS).toISOString();
}
