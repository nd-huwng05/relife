import { formatVnd, type RevenueReport } from "@relife/shared";
import { Card, Icon, ListRow, LoadingView, SegmentedControl, Text, colors, fontFamily } from "@relife/ui";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { Screen } from "@/components/Screen";

import { useRevenue } from "../hooks/useStoreAdmin";

const CHART_HEIGHT = 124;

/** B17 Revenue. */
export function RevenueScreen() {
  const [period, setPeriod] = useState<RevenueReport["period"]>("week");
  const query = useRevenue(period);
  const r = query.data;
  const max = r ? Math.max(...r.bars.map((b) => b.value), 1) : 1;

  return (
    <Screen withTabBar gap={12}>
      <Text style={styles.title}>Doanh thu</Text>
      <SegmentedControl
        dense
        value={period}
        onChange={setPeriod}
        options={[
          { key: "week", label: "Tuần" },
          { key: "month", label: "Tháng" },
          { key: "year", label: "Năm" },
        ]}
      />
      {!r ? (
        <LoadingView />
      ) : (
        <>
          <Card variant="dark" gap={6} style={styles.totalCard}>
            <Text style={styles.overline}>{r.label}</Text>
            <Text style={styles.total}>{formatVnd(r.total)}</Text>
            {r.changePercent !== 0 && (
              <View style={styles.change}>
                <Text style={[styles.changeText, r.changePercent < 0 && { color: colors.terracottaMist }]}>
                  {`${r.changePercent > 0 ? "+" : ""}${r.changePercent}% so với kỳ trước`}
                </Text>
              </View>
            )}
          </Card>
          <Card gap={10}>
            <View style={styles.between}>
              <Text variant="bodyStrong">{period === "week" ? "Theo ngày" : period === "month" ? "Theo tuần" : "Theo tháng"}</Text>
              <Text style={styles.unit}>Nghìn đồng</Text>
            </View>
            <View style={styles.chart} accessibilityLabel="Biểu đồ doanh thu">
              {r.bars.map((b) => {
                const top = b.value === max;
                return (
                  <View key={b.label} style={styles.barCol} accessibilityLabel={`${b.label}: ${b.value} nghìn đồng`}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: Math.max(4, (b.value / max) * CHART_HEIGHT),
                          backgroundColor: b.value === 0 ? "rgba(31, 58, 50, 0.2)" : top ? colors.champagne : colors.forest,
                        },
                      ]}
                    />
                    <Text style={styles.unit}>{b.label}</Text>
                  </View>
                );
              })}
            </View>
          </Card>
          <View style={styles.insight}>
            <Icon name="clock" size={18} color="ink" />
            <Text style={styles.insightText}>{r.insight}</Text>
          </View>
          <Card padding={14}>
            <ListRow icon="dollar" iconVariant="soft" title="Đối soát và chi trả" subtitle="Số tiền Relife đang giữ và lịch sử chuyển" onPress={() => router.push("/payouts")} />
          </Card>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fontFamily.heading, fontSize: 30, lineHeight: 40, color: colors.ink, marginTop: 2 },
  totalCard: { borderRadius: 24 },
  overline: { fontFamily: fontFamily.bodySemiBold, fontSize: 11, letterSpacing: 1.32, color: colors.champagne },
  total: { fontFamily: fontFamily.number, fontSize: 31, lineHeight: 38, letterSpacing: -0.62, color: colors.cream },
  change: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: colors.forestLine },
  changeText: { fontFamily: fontFamily.bodySemiBold, fontSize: 11, color: colors.mint },
  unit: { fontFamily: fontFamily.body, fontSize: 11, color: colors.stone },
  insight: { flexDirection: "row", gap: 10, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 16, backgroundColor: "rgba(239, 227, 203, 0.7)" },
  insightText: { flex: 1, fontFamily: fontFamily.body, fontSize: 13, lineHeight: 19, color: colors.ink },
  between: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  chart: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", height: CHART_HEIGHT + 26 },
  barCol: { alignItems: "center", gap: 8, flex: 1 },
  bar: { width: 28, borderTopLeftRadius: 8, borderTopRightRadius: 8 },
});
