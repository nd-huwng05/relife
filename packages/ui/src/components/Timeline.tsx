import { StyleSheet, View } from "react-native";

import { Icon } from "../icons";
import { colors } from "../theme/colors";
import { Text } from "./Text";

export interface TimelineStep {
  title: string;
  subtitle?: string;
  /** Right aligned time, e.g. "19:02". */
  meta?: string;
  state: "done" | "current" | "pending";
}

/** Vertical status list (A17, A22, B02, C02). */
export function Timeline({
  steps,
  size = 26,
  doneColor = colors.success,
  dense = false,
}: {
  steps: TimelineStep[];
  size?: number;
  doneColor?: string;
  /** 14pt titles and 12pt regular times, as in the A22 order card. */
  dense?: boolean;
}) {
  return (
    <View style={styles.list}>
      {steps.map((s, i) => (
        <View key={i} style={styles.row}>
          <View
            style={[
              styles.bullet,
              { width: size, height: size, borderRadius: size / 2 },
              s.state === "done" && { backgroundColor: doneColor },
              s.state === "current" && styles.current,
              s.state === "pending" && styles.pending,
            ]}
          >
            {s.state === "done" && <Icon name="check" size={size * 0.46} color="cream" />}
            {s.state === "current" && <View style={styles.currentDot} />}
          </View>
          <View style={styles.text}>
            <Text
              variant={s.state === "pending" ? "body" : "bodyStrong"}
              color={s.state === "pending" ? "stone" : "ink"}
              style={dense && styles.denseTitle}
            >
              {s.title}
            </Text>
            {s.subtitle && (
              <Text variant="caption" color="stone">
                {s.subtitle}
              </Text>
            )}
          </View>
          {s.meta && (
            <Text variant={dense ? "caption" : "captionStrong"} color="stone">
              {s.meta}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 14 },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  bullet: { alignItems: "center", justifyContent: "center" },
  current: { backgroundColor: colors.goldSoft, borderWidth: 1.5, borderColor: colors.champagne },
  currentDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.champagne },
  pending: { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.line },
  text: { flex: 1, gap: 2 },
  denseTitle: { fontSize: 14, lineHeight: 18 },
});
