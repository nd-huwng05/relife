import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { colors } from "../theme/colors";

export interface ProgressBarProps {
  /** 0 to 1 */
  value: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

/** Thin bar, e.g. "Đã bán 6 / 10". */
export function ProgressBar({ value, color = colors.forest, style }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <View style={[styles.track, style]} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: pct }}>
      <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color }]} />
    </View>
  );
}

export interface StepBarProps {
  total: number;
  /** 1-based index of the current step (Champagne); earlier steps are Forest. */
  current: number;
  height?: number;
  /** "dark": Champagne steps on Deep Forest, as on B24. */
  tone?: "light" | "dark";
  style?: StyleProp<ViewStyle>;
}

/** Segmented progress for multi-step flows (B01, C01, B24). */
export function StepBar({ total, current, height = 5, tone = "light", style }: StepBarProps) {
  const color = (i: number) =>
    tone === "dark"
      ? i < current
        ? colors.champagne
        : "rgba(201, 169, 110, 0.25)"
      : i < current - 1
        ? colors.forest
        : i === current - 1
          ? colors.champagne
          : colors.line;
  return (
    <View style={[styles.steps, style]} accessibilityLabel={`Bước ${current} trên ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[styles.step, { height, borderRadius: height / 2 }, { backgroundColor: color(i) }]}
        />
      ))}
    </View>
  );
}

export interface PageDotsProps {
  total: number;
  index: number;
  /** "dark" on light backgrounds, "light" over photos. */
  tone?: "dark" | "light";
  /** Dot size: 7 on onboarding (A02), 6 over bag photos (A12). */
  size?: number;
}

/** Pager dots: the active one is a wide pill. */
export function PageDots({ total, index, tone = "dark", size = 7 }: PageDotsProps) {
  const on = tone === "dark" ? colors.forest : colors.white;
  const off = tone === "dark" ? colors.line : "rgba(255, 255, 255, 0.55)";
  const active = size === 7 ? 26 : 20;
  return (
    <View style={[styles.dots, { gap: size - 1 }]}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[
            { height: size, borderRadius: size / 2 },
            i === index ? { width: active, backgroundColor: on } : { width: size, backgroundColor: off },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 6, borderRadius: 3, backgroundColor: colors.line, overflow: "hidden", alignSelf: "stretch" },
  fill: { height: "100%", borderRadius: 3 },
  steps: { flexDirection: "row", gap: 6, alignSelf: "stretch" },
  step: { flex: 1 },
  dots: { flexDirection: "row", alignItems: "center" },
});
