import { formatDuration, formatTime, minutesUntil } from "@relife/shared";
import { Card, Icon, LoadingView, StateView, Text, colors, fontFamily } from "@relife/ui";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

import { Photo } from "@/components/Photo";
import { Screen } from "@/components/Screen";
import { formatKm } from "@/features/bags";
import { useNow } from "@/lib/clock";

import { useCharity, useSurplusList } from "../hooks/useCharity";

/** C03 Surplus List: live list with the daily quota and closing countdowns. */
export function SurplusListScreen() {
  const charity = useCharity().data;
  const query = useSurplusList();
  const now = useNow(30_000);

  return (
    <Screen withTabBar gap={12} refreshing={query.isRefetching} onRefresh={() => query.refetch()}>
      <View style={styles.top}>
        <Text variant="small" color="stone">
          {charity?.name ?? ""}
        </Text>
        <Text style={styles.title}>Nguồn thực phẩm</Text>
      </View>
      {charity && (
        <Card variant="dark" padding={16}>
          <View style={styles.between}>
            <View style={styles.gap2}>
              <Text variant="small" color="sageLight">
                Hạn mức hôm nay
              </Text>
              <Text style={styles.quota}>
                Còn <Text style={styles.quotaNumber}>{charity.claimsLeftToday}</Text> / <Text style={styles.quotaNumber}>{charity.dailyQuota}</Text> lượt nhận
              </Text>
            </View>
            <View style={styles.live}>
              <Text style={styles.liveText}>Cập nhật trực tiếp</Text>
            </View>
          </View>
        </Card>
      )}
      {query.isPending ? (
        <LoadingView />
      ) : (query.data ?? []).length === 0 ? (
        <StateView icon="package" title="Chưa có nguồn mới" message="Các tiệm thường mở nguồn sau 20:00." />
      ) : (
        (query.data ?? []).map((s) => {
          const closes = minutesUntil(s.closesAt, now);
          return (
            <Card key={s.id} gap={10} onPress={() => router.push(`/surplus/${s.id}`)} accessibilityLabel={`${s.title}, ${s.storeName}`}>
              <View style={styles.row}>
                <Photo photo={s.photo} width={64} height={64} radius={16} />
                <View style={styles.flex}>
                  <Text variant="bodyStrong">{s.title}</Text>
                  <Text variant="caption" color="stone">
                    {s.storeName} · {formatKm(s.distanceKm)}
                  </Text>
                  <View style={styles.storage}>
                    <Text style={styles.storageText}>{s.storageLabel}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.between}>
                <View style={styles.inline}>
                  <Icon name="clock" size={16} color={closes < 60 ? "terracotta" : "ink"} />
                  <Text variant="labelStrong" color={closes < 60 ? "terracotta" : "ink"}>
                    {closes < 60 ? `Đóng sau ${formatDuration(closes)}` : `Đóng lúc ${formatTime(s.closesAt)}`}
                  </Text>
                </View>
                <Text variant="labelStrong" color="forest">
                  {s.unitsLeft} / {s.unitsTotal} phần
                </Text>
              </View>
              {s.recentClaimNote && (
                <View style={styles.inline}>
                  <Icon name="users" size={14} color="amber" />
                  <Text variant="caption" color="amber">
                    {s.recentClaimNote}
                  </Text>
                </View>
              )}
            </Card>
          );
        })
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { gap: 2, marginTop: -4, marginBottom: 6 },
  title: { fontFamily: fontFamily.heading, fontSize: 28, lineHeight: 37, color: colors.ink },
  gap2: { gap: 2 },
  quota: { fontFamily: fontFamily.heading, fontSize: 18, lineHeight: 24, color: colors.cream },
  quotaNumber: { fontFamily: fontFamily.number, fontSize: 17 },
  live: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: colors.forestLine },
  liveText: { fontFamily: fontFamily.bodySemiBold, fontSize: 11, color: colors.mint },
  storage: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, backgroundColor: colors.coolSoft },
  storageText: { fontFamily: fontFamily.bodySemiBold, fontSize: 11, color: colors.cool },
  between: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  flex: { flex: 1, gap: 4 },
  inline: { flexDirection: "row", alignItems: "center", gap: 6 },
});
