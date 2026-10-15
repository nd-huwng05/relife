import { CLAIM_STATUS, formatDayMonth, isSameVnDay, type ClaimStatus } from "@relife/shared";
import { Card, Divider, LoadingView, StatusBadge, Text, colors, fontFamily, type StatusTone } from "@relife/ui";
import { router } from "expo-router";
import { Fragment } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { Screen } from "@/components/Screen";
import { useNow } from "@/lib/clock";

import { useCharity, useClaims } from "../hooks/useCharity";

const STATUS: Record<ClaimStatus, { label: string; tone: StatusTone }> = {
  [CLAIM_STATUS.READY]: { label: "Sẵn sàng", tone: "success" },
  [CLAIM_STATUS.COLLECTED]: { label: "Đã nhận", tone: "neutral" },
  [CLAIM_STATUS.NO_SHOW]: { label: "Không đến", tone: "danger" },
};

/** Round progress for the show-up rate. */
function Ring({ percent, size = 84 }: { percent: number; size?: number }) {
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.stoneSoft} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={colors.success}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${(c * percent) / 100} ${c}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <Text style={styles.percent}>{percent}%</Text>
    </View>
  );
}

/** C06 Claim History with the show-up rate that keeps the daily quota. */
export function ClaimHistoryScreen() {
  const charity = useCharity().data;
  const claims = useClaims();
  const now = useNow(60_000);

  return (
    <Screen withTabBar gap={12}>
      <Text style={styles.title}>Phiếu nhận</Text>
      {charity && (
        <Card>
          <View style={styles.row}>
            <Ring percent={charity.showRate.percent} />
            <View style={styles.flex}>
              <Text variant="bodyStrong">Tỷ lệ đến nhận</Text>
              <Text variant="small" color="stone">
                {charity.showRate.collected} / {charity.showRate.total} phiếu trong 30 ngày
              </Text>
              <Text variant="caption" color="success">
                Trên 85% giữ hạn mức {charity.dailyQuota} lượt mỗi ngày
              </Text>
            </View>
          </View>
        </Card>
      )}
      {!claims.data ? (
        <LoadingView />
      ) : (
        <Card gap={12}>
          {claims.data.map((c, i) => {
            const s = STATUS[c.status];
            const day = isSameVnDay(c.pickupStart, now.toISOString()) ? "Hôm nay" : formatDayMonth(c.pickupStart);
            return (
              <Fragment key={c.id}>
                {i > 0 && <Divider />}
                <Pressable accessibilityRole="button" style={styles.row} onPress={() => router.push(`/claim/${c.id}`)}>
                  <View style={styles.flex}>
                    <Text variant="bodyStrong" style={styles.t14}>
                      {c.storeName}
                    </Text>
                    <Text variant="caption" color="stone">
                      {c.units} phần · {day}
                    </Text>
                  </View>
                  <StatusBadge label={s.label} tone={s.tone} />
                </Pressable>
              </Fragment>
            );
          })}
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fontFamily.heading, fontSize: 28, lineHeight: 37, color: colors.ink, marginTop: 2, marginBottom: 4 },
  percent: { fontFamily: fontFamily.number, fontSize: 18, color: colors.ink },
  t14: { fontSize: 14, lineHeight: 18 },
  row: { flexDirection: "row", alignItems: "center", gap: 16 },
  flex: { flex: 1, gap: 3 },
});
