import { ORDER_STATUS, formatWindow, minutesUntil } from "@relife/shared";
import { Avatar, Button, Card, Icon, IconButton, KeyValueRow, LoadingView, StateView, Text, colors, fontFamily, spacing } from "@relife/ui";
import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { BottomBar } from "@/components/BottomBar";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useNow } from "@/lib/clock";
import { errorMessage } from "@/lib/queryClient";

import { NO_SHOW_GRACE_MINUTES } from "../../api";
import { useOrder } from "../../hooks/usePickup";
import { maskCode } from "../../orderStatus";

/** B11 Order Detail (Store Side). The store sees a masked pickup code only. */
export function StoreOrderDetailScreen({ orderId }: { orderId: string }) {
  const query = useOrder(orderId);
  const now = useNow(30_000);

  if (query.isPending) return <LoadingView />;
  if (query.isError) return <StateView icon="alert" title="Không mở được đơn" message={errorMessage(query.error)} />;

  const order = query.data;
  const paid = order.status === ORDER_STATUS.PAID;
  const collected = order.status === ORDER_STATUS.COLLECTED;
  const canNoShow = paid && minutesUntil(order.pickupEnd, now) < -NO_SHOW_GRACE_MINUTES;

  return (
    <Screen
      gap={12}
      header={<ScreenHeader title={`Đơn của ${order.customerName}`} />}
      footer={
        paid ? (
          <BottomBar plain>
            <Button title="Quét mã của khách" icon="camera" onPress={() => router.push("/scanner")} />
            <Button title="Nhập mã bằng tay" variant="white" onPress={() => router.push("/scanner/manual")} />
            {canNoShow && (
              <Pressable accessibilityRole="button" onPress={() => router.push(`/today-orders/${order.id}/no-show`)} style={styles.link}>
                <Text variant="labelStrong" color="terracotta" align="center">
                  Đánh dấu không đến
                </Text>
              </Pressable>
            )}
          </BottomBar>
        ) : undefined
      }
    >
      <Card variant="danger" padding={16} style={(paid || collected) && styles.ok}>
        <View style={styles.row}>
          <Icon name={paid || collected ? "checkc" : "alert"} size={24} color={paid || collected ? "success" : "terracotta"} />
          <View style={styles.text}>
            <Text style={[styles.statusTitle, { color: paid || collected ? colors.success : colors.terracotta }]}>
              {collected ? "Đã giao túi" : paid ? "Đơn đã thanh toán" : "Đơn không còn hiệu lực"}
            </Text>
            <Text variant="small" color={paid || collected ? "success" : "terracotta"}>
              {paid || collected ? "Không thu thêm tiền của khách" : "Không đưa túi cho đơn này"}
            </Text>
          </View>
        </View>
      </Card>
      <Card gap={12}>
        <KeyValueRow label="Túi" value={order.bagTitle.replace(/^Túi /, "").replace(/^./, (c) => c.toUpperCase())} />
        <View style={styles.between}>
          <Text variant="body" color="stone" style={styles.kv}>
            Số lượng
          </Text>
          <Text variant="bodyStrong" style={styles.kv}>
            {order.qty} túi
          </Text>
        </View>
        <KeyValueRow label="Khung nhận" value={formatWindow(order.pickupStart, order.pickupEnd)} />
        <KeyValueRow label="Mã đơn" value={order.code} />
        <KeyValueRow label="Mã nhận" value={`••• ${maskCode(order.pickupCode)}`} />
      </Card>
      <Card padding={14}>
        <View style={styles.row}>
          <Avatar name={order.customerName} size={40} tone="linen" />
          <View style={styles.text}>
            <Text variant="bodyStrong">{order.customerName}</Text>
            <Text variant="caption" color="stone">
              Khách lần thứ {order.customerVisitCount} tại tiệm
            </Text>
          </View>
          {/* TODO(S5): call the customer through a masked number provided by the server. */}
          <IconButton name="phone" size={40} iconSize={18} variant="soft" accessibilityLabel="Gọi khách" />
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  text: { flex: 1, gap: 2 },
  link: { paddingVertical: spacing.xs },
  ok: { backgroundColor: colors.successSoft },
  statusTitle: { fontFamily: fontFamily.bodySemiBold, fontSize: 16, lineHeight: 20 },
  between: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  kv: { fontSize: 14, lineHeight: 18 },
});
