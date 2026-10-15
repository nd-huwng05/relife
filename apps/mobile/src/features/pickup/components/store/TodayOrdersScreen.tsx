import { ORDER_STATUS, formatTime, minutesUntil, type Order } from "@relife/shared";
import { Avatar, Card, Icon, IconButton, LoadingView, SegmentedControl, StateView, StatusBadge, Text, colors, fontFamily, spacing } from "@relife/ui";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { Screen } from "@/components/Screen";
import { useNow } from "@/lib/clock";
import { errorMessage } from "@/lib/queryClient";

import { NO_SHOW_GRACE_MINUTES } from "../../api";
import { useTodayOrders } from "../../hooks/usePickup";
import { maskCode } from "../../orderStatus";

type Tab = "waiting" | "collected" | "noShow";

/** B10 Today's Orders, sorted by the time customers said they would come. */
export function TodayOrdersScreen() {
  const [tab, setTab] = useState<Tab>("waiting");
  const query = useTodayOrders();
  const now = useNow(30_000);
  const data = query.data;
  const list = data ? data[tab] : [];

  return (
    <Screen gap={10} refreshing={query.isRefetching} onRefresh={() => query.refetch()} header={<View style={styles.spacer} />}>
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Đơn hôm nay</Text>
          <Text variant="small" color="stone">
            Sắp xếp theo giờ nhận
          </Text>
        </View>
        <IconButton name="camera" size={48} iconSize={22} variant="solid" onPress={() => router.push("/scanner")} accessibilityLabel="Quét mã" />
      </View>
      <SegmentedControl
        dense
        value={tab}
        onChange={setTab}
        options={[
          { key: "waiting", label: `Chờ nhận · ${data?.waiting.length ?? 0}` },
          { key: "collected", label: `Đã nhận · ${data?.collected.length ?? 0}` },
          { key: "noShow", label: "Không đến" },
        ]}
      />
      {query.isPending ? (
        <LoadingView />
      ) : query.isError ? (
        <StateView icon="wifioff" title="Chưa tải được đơn" message={errorMessage(query.error)} actionLabel="Thử lại" onAction={() => query.refetch()} />
      ) : list.length === 0 ? (
        <StateView icon="bag" title="Chưa có đơn" message={tab === "waiting" ? "Đơn mới sẽ hiện ở đây ngay khi khách thanh toán." : undefined} />
      ) : (
        list.map((o) => <StoreOrderRow key={o.id} order={o} now={now} />)
      )}
      <View style={styles.note}>
        <Icon name="lock" size={14} color="stone" />
        <Text variant="caption" color="stone">
          Chỉ hiện tên và 2 ký tự cuối của mã để bảo vệ khách.
        </Text>
      </View>
    </Screen>
  );
}

export function StoreOrderRow({ order, now }: { order: Order; now: Date }) {
  const overdue = order.status === ORDER_STATUS.PAID && minutesUntil(order.pickupEnd, now) < -NO_SHOW_GRACE_MINUTES;
  const badge =
    order.status === ORDER_STATUS.COLLECTED
      ? { label: "Đã nhận", tone: "neutral" as const }
      : order.status === ORDER_STATUS.NO_SHOW
        ? { label: "Không đến", tone: "danger" as const }
        : overdue
          ? { label: "Chưa đến", tone: "warning" as const }
          : { label: "Đã thanh toán", tone: "success" as const };
  return (
    <Card
      padding={14}
      onPress={() => router.push(overdue ? `/today-orders/${order.id}/no-show` : `/today-orders/${order.id}`)}
      accessibilityLabel={`Đơn của ${order.customerName}`}
    >
      <View style={styles.row}>
        <Avatar name={order.customerName} size={40} tone="linen" />
        <View style={styles.text}>
          <Text variant="bodyStrong">{order.customerName}</Text>
          <Text variant="caption" color="stone" numberOfLines={1}>
            {order.bagTitle.replace(" cuối ngày", "")} × {order.qty} · Mã {maskCode(order.pickupCode)}
          </Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.time}>{formatTime(order.collectedAt ?? order.plannedArrival ?? order.pickupStart)}</Text>
          <StatusBadge label={badge.label} tone={badge.tone} />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  spacer: { height: spacing.xs },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: -4, marginBottom: 8 },
  titleBlock: { gap: 2 },
  title: { fontFamily: fontFamily.heading, fontSize: 30, lineHeight: 40, color: colors.ink },
  time: { fontFamily: fontFamily.number, fontSize: 14, color: colors.ink },
  note: { flexDirection: "row", alignItems: "center", gap: 6 },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  text: { flex: 1, gap: 2 },
  right: { alignItems: "flex-end", gap: 4 },
});
