import { ORDER_STATUS, formatTime, formatVnd, type Order } from "@relife/shared";
import { Button, Card, Divider, IconButton, KeyValueRow, LoadingView, StateView, StatusBadge, Text, Timeline, colors, fontFamily, spacing, type TimelineStep } from "@relife/ui";
import { router } from "expo-router";
import { Linking, Pressable, StyleSheet, View } from "react-native";

import { BottomBar } from "@/components/BottomBar";
import { CopyRow } from "@/components/CopyRow";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { formatKm } from "@/features/bags";
import { errorMessage } from "@/lib/queryClient";

import { useOrder } from "../hooks/usePickup";
import { orderStatusView } from "../orderStatus";

function steps(order: Order): TimelineStep[] {
  const paid = !!order.paidAt;
  const collected = order.status === ORDER_STATUS.COLLECTED;
  return [
    { title: "Đã đặt túi", meta: formatTime(order.createdAt), state: "done" },
    {
      title: paid ? "Đã thanh toán VietQR" : order.transferReportedAt ? "Chờ ngân hàng xác nhận" : "Chờ thanh toán",
      meta: order.paidAt ? formatTime(order.paidAt) : undefined,
      state: paid ? "done" : "current",
    },
    { title: "Chờ bạn đến nhận", meta: `đến ${formatTime(order.pickupEnd)}`, state: collected ? "done" : paid ? "current" : "pending" },
    { title: "Đã nhận túi", meta: order.collectedAt ? formatTime(order.collectedAt) : undefined, state: collected ? "done" : "pending" },
  ];
}

/** A22 Order Detail. */
export function OrderDetailScreen({ orderId }: { orderId: string }) {
  const query = useOrder(orderId);

  if (query.isPending) return <LoadingView />;
  if (query.isError) return <StateView icon="alert" title="Không mở được đơn" message={errorMessage(query.error)} actionLabel="Thử lại" onAction={() => query.refetch()} />;

  const order = query.data;
  const status = orderStatusView(order);
  const paid = order.status === ORDER_STATUS.PAID;
  const canCancel = paid || order.status === ORDER_STATUS.HELD;
  const canReview = order.status === ORDER_STATUS.COLLECTED && !order.reviewed;
  const stopped = order.status !== ORDER_STATUS.PAID && order.status !== ORDER_STATUS.HELD && order.status !== ORDER_STATUS.COLLECTED;

  return (
    <Screen
      gap={12}
      header={<ScreenHeader title="Chi tiết đơn" />}
      footer={
        paid || canReview || canCancel ? (
          <BottomBar plain>
            {paid && <Button title="Xem mã nhận bánh" onPress={() => router.push(`/pickup/${order.id}`)} />}
            {canReview && <Button title="Đánh giá túi bánh" icon="star" onPress={() => router.push(`/order/${order.id}/review`)} />}
            {order.status === ORDER_STATUS.HELD && !order.transferReportedAt && (
              <Button title="Tiếp tục thanh toán" onPress={() => router.push(`/checkout/pay/${order.id}`)} />
            )}
            {canCancel && (
              <Pressable accessibilityRole="button" onPress={() => router.push(`/order/${order.id}/cancel`)} style={styles.cancel}>
                <Text style={styles.cancelText}>Huỷ đơn</Text>
              </Pressable>
            )}
          </BottomBar>
        ) : undefined
      }
    >
      <Card gap={12}>
        <View style={styles.between}>
          <View style={styles.flex}>
            <Text variant="headline">{order.bagTitle}</Text>
            <Text style={styles.store}>{order.storeName}</Text>
          </View>
          <StatusBadge label={status.label} tone={status.tone} />
        </View>
        <Divider />
        {stopped ? (
          <Text variant="small" color="stone">
            {order.refundAmount ? `Hoàn ${formatVnd(order.refundAmount)} về tài khoản trong 1 đến 3 ngày làm việc.` : "Đơn này đã đóng."}
          </Text>
        ) : (
          <Timeline steps={steps(order)} dense doneColor={colors.success} />
        )}
      </Card>

      <Card gap={10}>
        <KeyValueRow label="Số lượng" value={`${order.qty} túi`} />
        <KeyValueRow label="Đơn giá" value={formatVnd(order.unitPrice)} />
        <KeyValueRow label="Thanh toán" value={order.bankName ? `VietQR · ${order.bankName}` : "VietQR"} />
        <Divider />
        <View style={styles.between}>
          <Text style={styles.totalLabel}>Tổng cộng</Text>
          <Text style={styles.totalValue}>{formatVnd(order.amount)}</Text>
        </View>
      </Card>

      <Card padding={14}>
        <CopyRow label="Mã đơn" value={order.code} compact />
      </Card>

      <Card padding={14}>
        <View style={styles.between}>
          <View style={styles.flex}>
            <Text variant="bodyStrong">Liên hệ tiệm</Text>
            <Text variant="caption" color="stone">
              {order.storeAddress.split(",")[0]} · {formatKm(order.storeDistanceKm)}
            </Text>
          </View>
          <View style={styles.inline}>
            <IconButton name="phone" size={40} iconSize={18} variant="soft" onPress={() => Linking.openURL(`tel:${order.storePhone.replace(/\s/g, "")}`)} accessibilityLabel="Gọi tiệm" />
            <IconButton
              name="nav"
              size={40}
              iconSize={18}
              variant="solid"
              onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.storeAddress)}`)}
              accessibilityLabel="Chỉ đường"
            />
          </View>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  between: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm },
  flex: { flex: 1, gap: 3 },
  inline: { flexDirection: "row", gap: 8 },
  cancel: { paddingVertical: spacing.xs },
  cancelText: { fontFamily: fontFamily.bodySemiBold, fontSize: 14, color: colors.terracotta, textAlign: "center" },
  store: { fontFamily: fontFamily.body, fontSize: 13, color: colors.stone },
  totalLabel: { fontFamily: fontFamily.body, fontSize: 14, color: colors.stone },
  totalValue: { fontFamily: fontFamily.bodySemiBold, fontSize: 14, color: colors.ink },
});
