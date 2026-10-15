import { useEffect, useRef, useState } from "react";
import { PanResponder, StyleSheet, View, type LayoutChangeEvent } from "react-native";

import { colors } from "../theme/colors";

export interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  accessibilityLabel: string;
}

const KNOB = 26;

/** Single-value slider (Forest fill, white knob) used for distance and radius. */
export function Slider({ value, min, max, step = 1, onChange, accessibilityLabel }: SliderProps) {
  const [width, setWidth] = useState(0);
  const widthRef = useRef(0);
  const startX = useRef(0);
  // The pan responder is created once, so read the latest callback through a ref.
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });
  const range = max - min || 1;
  const ratio = (value - min) / range;

  const toValue = (x: number) => {
    const w = widthRef.current || 1;
    const raw = min + Math.max(0, Math.min(1, x / w)) * range;
    return Math.round(raw / step) * step;
  };

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        startX.current = e.nativeEvent.locationX;
        onChangeRef.current(toValue(startX.current));
      },
      onPanResponderMove: (_e, g) => onChangeRef.current(toValue(startX.current + g.dx)),
    }),
  ).current;

  const onLayout = (e: LayoutChangeEvent) => {
    widthRef.current = e.nativeEvent.layout.width;
    setWidth(e.nativeEvent.layout.width);
  };

  return (
    <View
      style={styles.hit}
      onLayout={onLayout}
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min, max, now: value }}
      accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
      onAccessibilityAction={(e) => onChange(Math.max(min, Math.min(max, value + (e.nativeEvent.actionName === "increment" ? step : -step))))}
      {...pan.panHandlers}
    >
      <View style={styles.track} pointerEvents="none">
        <View style={[styles.fill, { width: ratio * width }]} />
      </View>
      <View pointerEvents="none" style={[styles.knob, { left: ratio * width - KNOB / 2 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  hit: { height: 28, justifyContent: "center" },
  track: { height: 6, borderRadius: 3, backgroundColor: colors.line, overflow: "hidden" },
  fill: { height: 6, backgroundColor: colors.forest },
  knob: {
    position: "absolute",
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.forest,
    shadowColor: colors.deepForest,
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
});
