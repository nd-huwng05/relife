import { Button, Icon, IconButton, StepBar, Text, colors, fontFamily, spacing } from "@relife/ui";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { Screen } from "@/components/Screen";

import { storeContent } from "../api";

const CARDS = storeContent.training;

/** B24 Quick Training: five short cards for new store staff. */
export function TrainingScreen({ initialCard = 0 }: { initialCard?: number }) {
  const [index, setIndex] = useState(Math.min(Math.max(initialCard, 0), CARDS.length - 1));
  const card = CARDS[index];
  const last = index === CARDS.length - 1;
  if (!card) return null;

  return (
    <Screen
      edges={["top", "bottom"]}
      background="deepForest"
      gap={0}
      header={
        <View style={styles.header}>
          <IconButton name="x" variant="scrim" iconSize={20} style={styles.close} onPress={() => router.back()} accessibilityLabel="Đóng" />
          <StepBar total={CARDS.length} current={index + 1} height={4} tone="dark" style={styles.steps} />
        </View>
      }
    >
      <StatusBar style="light" />
      <View style={styles.card}>
        <View style={styles.art}>
          <Icon name={card.icon} size={64} color="forest" />
        </View>
        <View style={styles.body}>
          <Text style={styles.overline}>
            THẺ {index + 1} / {CARDS.length}
          </Text>
          <Text style={styles.title}>{card.title}</Text>
          <Text style={styles.text}>{card.body}</Text>
          <View style={styles.flex} />
          <View style={styles.inline}>
            <Icon name="help" size={14} color="stone" />
            <Text variant="caption" color="stone">
              Câu hỏi thật từ các tiệm thí điểm
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.flex} />
      <Button title={last ? "Xong" : "Thẻ tiếp theo"} variant="light" style={styles.cta} onPress={() => (last ? router.back() : setIndex(index + 1))} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingHorizontal: spacing.md, paddingBottom: spacing.sm },
  close: { backgroundColor: "rgba(255, 255, 255, 0.12)" },
  steps: { flex: 1 },
  card: { minHeight: 520, backgroundColor: colors.linen, borderRadius: 32, padding: 16, marginTop: 8 },
  art: { height: 220, borderRadius: 24, backgroundColor: colors.goldSoft, alignItems: "center", justifyContent: "center" },
  body: { flex: 1, gap: 12, paddingHorizontal: 8, paddingTop: 20, paddingBottom: 8 },
  overline: { fontFamily: fontFamily.bodySemiBold, fontSize: 11, letterSpacing: 1.54, color: colors.champagne },
  title: { fontFamily: fontFamily.heading, fontSize: 26, lineHeight: 32, color: colors.ink },
  text: { fontFamily: fontFamily.body, fontSize: 15, lineHeight: 23, color: colors.stone },
  flex: { flex: 1, minHeight: 16 },
  inline: { flexDirection: "row", alignItems: "center", gap: 6 },
  cta: { marginBottom: 16 },
});
