import { ORDER_STATUS, formatDuration, formatTime, formatWeekday, formatWindow, isSameVnDay, minutesUntil, type Order } from "@relife/shared";
import { Button, Card, Divider, Icon, LoadingView, SegmentedControl, StateView, StatusBadge, Text, colors, fontFamily } from "@relife/ui";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { Photo } from "@/components/Photo";
import { Screen } from "@/components/Screen";
import { useNow } from "@/lib/clock";
import { errorMessage } from "@/lib/queryClient";

import { useMyOrders } from "../hooks/usePickup";
import { isCompleted, isUpcoming, orderStatusView } from "../orderStatus";

type Tab = "upcoming" | "done" | "cancelled";

function groupLabel(o: Order, now: Date) {
  const days = Math.floor((now.getTime() - new Date(o.pickupStart).getTime()) / 86_400_000);
  if (isSameVnDay(o.pickupStart, now.toISOString())) return "Hôm nay";
  if (days < 7) return "Tuần này";
  if (days < 14) return "Tuần trước";
  return "Trước đó";
}

/** A21 My Orders. */
export function MyOrdersScreen() {
  const [tab, setTab] = useState<Tab>("upcoming");
  const query = useMyOrders();
  const now = useNow(30_000);
  const orders = query.data ?? [];
  const upcoming = orders.filter(isUpcoming);
  const shown = tab === "upcoming" ? upcoming : tab === "done" ? orders.filter(isCompleted) : orders.filter((o) => !isUpcoming(o) && !isCompleted(o));
  const groups = shown.map((o) => (tab === "upcoming" ? "" : groupLabel(o, now)));
  const items = shown.map((order, i) => ({ order, header: groups[i] && groups[i] !== groups[i - 1] ? groups[i] : null }));

  return (
    <Screen withTabBar gap={14} refreshing={query.isRefetching} onRefresh={() => query.refetch()}>
      <Text style={styles.title}>Đơn hàng</Text>
      <SegmentedControl
        value={tab}
        onChange={setTab}
        options={[
          { key: "upcoming", label: upcoming.length ? `Sắp tới · ${upcoming.length}` : "Sắp tới" },
          { key: "done", label: "Hoàn thành" },
          { key: "cancelled", label: "Đã huỷ" },
        ]}
      />
      {query.isPending ? (
        <LoadingView />
      ) : query.isError ? (
        <StateView icon="wifioff" title="Chưa tải được đơn" message={errorMessage(query.error)} actionLabel="Thử lại" onAction={() => query.refetch()} />
      ) : shown.length === 0 ? (
        <StateView
          icon="bag"
          title={tab === "upcoming" ? "Chưa có đơn sắp tới" : "Chưa có đơn nào"}
          message={tab === "upcoming" ? "Tối nay giải cứu một túi bánh nhé." : undefined}
          actionLabel={tab === "upcoming" ? "Khám phá túi bánh" : undefined}
          onAction={() => router.navigate("/(customer)/(tabs)")}
        />
      ) : (
        items.map(({ order, header }) => (
          <View key={order.id} style={styles.item}>
            {header && (
              <Text variant="labelStrong" color="stone">
                {header}
              </Text>
            )}
            <OrderCard order={order} now={now} />
          </View>
        ))
      )}
    </Screen>
  );
}

function OrderCard({ order, now }: { order: Order; now: Date }) {
  const status = orderStatusView(order);
  const paid = order.status === ORDER_STATUS.PAID;
  const left = minutesUntil(order.pickupEnd, now);
  const past = order.status === ORDER_STATUS.COLLECTED;
  const footer =
    order.status === ORDER_STATUS.COLLECTED && order.collectedAt
      ? `Nhận lúc ${formatTime(order.collectedAt)}, ${formatWeekday(order.collectedAt).toLowerCase()}`
      : paid && left > 0
        ? `Còn ${formatDuration(left)} · đến ${formatTime(order.pickupEnd)}`
        : `Nhận ${formatWindow(order.pickupStart, order.pickupEnd)}`;

  return (
    <Card gap={12} style={past && styles.past} onPress={() => router.push(`/order/${order.id}`)} accessibilityLabel={`${order.bagTitle}, ${status.label}`}>
      <View style={styles.row}>
        <Photo photo={order.bagPhoto} width={64} height={64} radius={16} />
        <View style={styles.text}>
          <Text variant="bodyStrong" numberOfLines={1}>
            {order.bagTitle}
          </Text>
          <Text variant="small" color="stone">
            {order.storeName} · × {order.qty}
          </Text>
          <StatusBadge label={status.label} tone={status.tone} />
        </View>
      </View>
      <Divider />
      <View style={styles.footer}>
        <View style={styles.inline}>
          <Icon name="clock" size={16} color={paid && left > 0 && left < 60 ? "terracotta" : "stone"} />
          <Text variant="labelStrong" color={paid && left > 0 && left < 60 ? "terracotta" : "stone"}>
            {footer}
          </Text>
        </View>
        {paid ? (
          <Button title="Mã nhận" size="sm" fullWidth={false} style={styles.codeBtn} onPress={() => router.push(`/pickup/${order.id}`)} />
        ) : (
          <Pressable accessibilityRole="button" onPress={() => router.push(`/order/${order.id}`)} hitSlop={8}>
            <Text variant="labelStrong" color="forest">
              Chi tiết
            </Text>
          </Pressable>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fontFamily.heading, fontSize: 30, lineHeight: 40, color: colors.ink, marginTop: 2 },
  past: { opacity: 0.75 },
  item: { gap: 10 },
  row: { flexDirection: "row", alignItems: "center", gap: 14 },
  text: { flex: 1, gap: 4 },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  inline: { flexDirection: "row", alignItems: "center", gap: 6, flexShrink: 1 },
  codeBtn: { width: 120 },
});
