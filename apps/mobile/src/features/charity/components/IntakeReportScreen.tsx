import { Button, Card, Icon, KeyValueRow, LoadingView, Overline, Text, colors, fontFamily } from "@relife/ui";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { Screen } from "@/components/Screen";

import { useIntakeReport } from "../hooks/useCharity";

/** C07 Intake Report for donors. */
export function IntakeReportScreen() {
  const query = useIntakeReport();
  const [exportNote, setExportNote] = useState(false);
  if (!query.data) return <LoadingView />;
  const r = query.data;

  return (
    <Screen withTabBar gap={12}>
      <Text style={styles.title}>Báo cáo tiếp nhận</Text>
      <Card variant="dark" gap={10} style={styles.summary}>
        <Text style={styles.overline}>{r.monthLabel}</Text>
        <View style={styles.stats}>
          <Stat value={String(r.portions)} label="phần đã nhận" />
          <Stat value={`${r.foodKg} kg`} label="thực phẩm" />
          <Stat value={`~ ${r.meals}`} label="bữa ăn" />
        </View>
      </Card>
      <Overline>THEO NGUỒN</Overline>
      <Card gap={10}>
        {r.bySource.map((s) => (
          <KeyValueRow key={s.storeName} label={s.storeName} value={`${s.portions} phần`} />
        ))}
      </Card>
      <Card gap={8}>
        <View style={styles.inline}>
          <Icon name="info" size={18} color="ink" />
          <Text variant="bodyStrong" style={styles.t14}>
            Giả định trong báo cáo
          </Text>
        </View>
        <Text variant="small" color="stone">
          {r.assumptions}
        </Text>
      </Card>
      <View style={styles.flex} />
      {/* TODO(S9): call `exportIntakeReport` (pdfkit) and share the PDF. */}
      <Button title={exportNote ? "Bản PDF sẽ có trong S9" : "Xuất báo cáo PDF cho nhà tài trợ"} icon="file" variant="white" labelStyle={styles.exportLabel} onPress={() => setExportNote(true)} />
    </Screen>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text variant="caption" color="sageLight">
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fontFamily.heading, fontSize: 28, lineHeight: 37, color: colors.ink, marginTop: 2, marginBottom: 4 },
  summary: { borderRadius: 24 },
  overline: { fontFamily: fontFamily.bodySemiBold, fontSize: 11, letterSpacing: 1.32, color: colors.champagne },
  stats: { flexDirection: "row", gap: 22 },
  stat: { gap: 0 },
  statValue: { fontFamily: fontFamily.number, fontSize: 26, lineHeight: 32, letterSpacing: -0.52, color: colors.cream },
  inline: { flexDirection: "row", alignItems: "center", gap: 8 },
  t14: { fontSize: 14, lineHeight: 18 },
  flex: { flex: 1, minHeight: 24 },
  exportLabel: { fontSize: 15 },
});
