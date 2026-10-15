import { formatTime, formatVndShort, greeting } from "@relife/shared";
import { Avatar, Button, Card, Icon, IconButton, LoadingView, StateView, Text, colors, fontFamily } from "@relife/ui";
import { router } from "expo-router";
import { Fragment } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { Screen } from "@/components/Screen";
import { maskCode } from "@/features/pickup";
import { useNow } from "@/lib/clock";
import { errorMessage } from "@/lib/queryClient";

import { useStoreHome } from "../hooks/useStoreAdmin";

/** B04 Store Home. */
export function StoreHomeScreen() {
  const query = useStoreHome();
  const now = useNow(60_000);

  if (query.isPending) return <LoadingView />;
  if (query.isError) return <StateView icon="wifioff" title="Chưa tải được" message={errorMessage(query.error)} actionLabel="Thử lại" onAction={() => query.refetch()} />;
  const h = query.data;

  return (
    <Screen withTabBar gap={14} refreshing={query.isRefetching} onRefresh={() => query.refetch()}>
      <View style={styles.top}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>{h.storeName.charAt(0)}</Text>
        </View>
        <View style={styles.flex}>
          <Text variant="small" color="stone">
            {greeting(now)}, {h.ownerFirstName}
          </Text>
          <Text style={styles.storeName}>{h.storeName}</Text>
        </View>
        <IconButton name="bell" iconSize={20} onPress={() => router.push("/settings/notifications")} accessibilityLabel="Thông báo cửa hàng" />
      </View>

      <Card variant="dark" gap={8} style={styles.hero}>
        <View style={styles.inline}>
          <Icon name="clock" size={16} color="champagne" />
          <Text variant="overline" color="champagne" style={styles.heroOverline}>
            {formatTime(now.toISOString())}
            {h.firstPickupStart ? ` · KHUNG NHẬN BẮT ĐẦU LÚC ${formatTime(h.firstPickupStart)}` : ""}
          </Text>
        </View>
        <Text style={styles.heroTitle}>
          {h.postedToday ? `Đã bán ${h.soldToday} / ${h.stockToday} túi hôm nay` : "Bạn chưa đăng túi hôm nay"}
        </Text>
        <Text variant="small" color="sageLight">
          {h.postedToday ? `${h.waitingPickup} khách đang chờ nhận bánh.` : h.yesterdayNote}
        </Text>
        <Button
          title={h.postedToday ? "Đăng thêm túi" : "Đăng lại như hôm qua"}
          icon={h.postedToday ? "plus" : "refresh"}
          variant="light"
          size="md"
          labelStyle={styles.heroButton}
          onPress={() => router.push(h.postedToday ? "/bags/new" : "/bags/repost")}
        />
      </Card>

      <View style={styles.stats}>
        <Stat value={`${h.soldToday}/${h.stockToday}`} label="túi đã bán" />
        <Stat value={String(h.waitingPickup)} label="chờ nhận" color={colors.amber} />
        <Stat value={formatVndShort(h.revenueToday)} label="doanh thu" color={colors.forest} />
      </View>

      <View style={styles.sectionRow}>
        <Text style={styles.section}>Khách sắp đến</Text>
        <Pressable accessibilityRole="button" onPress={() => router.push("/today-orders")} hitSlop={8}>
          <Text variant="labelStrong" color="champagne">
            Xem tất cả
          </Text>
        </Pressable>
      </View>
      {h.arriving.length === 0 ? (
        <StateView icon="users" title="Chưa có khách chờ" message="Đơn đã thanh toán sẽ hiện ở đây." />
      ) : (
        <Card gap={14}>
          {h.arriving.map((o) => (
            <Fragment key={o.id}>
              <Pressable accessibilityRole="button" style={styles.row} onPress={() => router.push(`/today-orders/${o.id}`)}>
                <Avatar name={o.customerName} size={38} tone="linen" />
                <View style={styles.flex}>
                  <Text variant="bodyStrong" style={styles.name}>
                    {o.customerName} · × {o.qty}
                  </Text>
                  <Text variant="caption" color="stone">
                    Mã {maskCode(o.pickupCode)}
                  </Text>
                </View>
                <View style={styles.right}>
                  <Text style={styles.time}>{formatTime(o.plannedArrival ?? o.pickupStart)}</Text>
                  <Text style={styles.paid}>Đã thanh toán</Text>
                </View>
              </Pressable>
            </Fragment>
          ))}
        </Card>
      )}
    </Screen>
  );
}

function Stat({ value, label, color = colors.ink }: { value: string; label: string; color?: string }) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text variant="caption" color="stone">
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: -4, marginBottom: 6 },
  logo: { width: 48, height: 48, borderRadius: 16, backgroundColor: colors.forest, alignItems: "center", justifyContent: "center" },
  logoText: { fontFamily: fontFamily.heading, fontSize: 20, color: colors.champagne },
  storeName: { fontFamily: fontFamily.heading, fontSize: 20, lineHeight: 27, color: colors.ink },
  flex: { flex: 1, gap: 2 },
  inline: { flexDirection: "row", alignItems: "center", gap: 6 },
  hero: { borderRadius: 24 },
  heroOverline: { letterSpacing: 0.88 },
  heroTitle: { fontFamily: fontFamily.heading, fontSize: 22, lineHeight: 29, color: colors.cream },
  heroButton: { fontSize: 15 },
  stats: { flexDirection: "row", gap: 10 },
  stat: { flex: 1, padding: 14, borderRadius: 18, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, gap: 2 },
  statValue: { fontFamily: fontFamily.number, fontSize: 22, lineHeight: 27, letterSpacing: -0.44 },
  sectionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  section: { fontFamily: fontFamily.heading, fontSize: 18, lineHeight: 24, color: colors.ink },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  name: { fontSize: 14, lineHeight: 18 },
  right: { alignItems: "flex-end", gap: 2 },
  time: { fontFamily: fontFamily.bodySemiBold, fontSize: 14, color: colors.ink },
  paid: { fontFamily: fontFamily.body, fontSize: 11, color: colors.success },
});
