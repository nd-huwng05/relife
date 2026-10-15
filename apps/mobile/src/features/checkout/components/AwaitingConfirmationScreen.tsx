import { ORDER_STATUS, formatTime } from "@relife/shared";
import { Card, Icon, LoadingView, Text, Timeline, colors, fontFamily } from "@relife/ui";
import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { CopyRow } from "@/components/CopyRow";
import { Screen } from "@/components/Screen";

import { useCheckoutOrder } from "../hooks/useCheckout";

const RING = 132;
const STROKE = 7;
const R = (RING - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;

/** A17 Awaiting Confirmation: polls the order until the payment webhook decides. */
export function AwaitingConfirmationScreen({ orderId }: { orderId: string }) {
  const query = useCheckoutOrder(orderId, { poll: true });
  const status = query.data?.status;

  useEffect(() => {
    if (status === ORDER_STATUS.PAID) router.replace(`/checkout/success/${orderId}`);
    if (status === ORDER_STATUS.REFUNDING) router.replace(`/checkout/failed/${orderId}?reason=late_payment`);
    if (status === ORDER_STATUS.EXPIRED || status === ORDER_STATUS.CANCELLED) router.replace(`/checkout/failed/${orderId}?reason=hold_expired`);
  }, [status, orderId]);

  if (!query.data) return <LoadingView />;
  const order = query.data;

  return (
    <Screen edges={["top", "bottom"]} gap={0}>
      <View style={styles.ring} accessibilityLabel="Đang chờ ngân hàng">
        <Svg width={RING} height={RING} style={StyleSheet.absoluteFill}>
          <Circle cx={RING / 2} cy={RING / 2} r={R} stroke={colors.stoneSoft} strokeWidth={STROKE} fill="none" />
          {/* Half arc from 12 o'clock clockwise, as drawn in the frame. */}
          <Circle
            cx={RING / 2}
            cy={RING / 2}
            r={R}
            stroke={colors.champagne}
            strokeWidth={STROKE}
            fill="none"
            strokeDasharray={`${CIRCUMFERENCE * 0.48} ${CIRCUMFERENCE}`}
            strokeLinecap="round"
            transform={`rotate(-90 ${RING / 2} ${RING / 2})`}
          />
        </Svg>
        <View style={styles.inner}>
          <Icon name="clock" size={40} color="forest" />
        </View>
      </View>

      <Text style={styles.title}>Đang xác nhận{"\n"}với ngân hàng</Text>
      <Text style={styles.body}>Việc này thường mất dưới một phút. Tiền của bạn an toàn, đơn đang được giữ.</Text>

      <Card style={styles.steps}>
        <Timeline
          size={30}
          doneColor={colors.success}
          steps={[
            { title: "Đã tạo đơn", subtitle: formatTime(order.createdAt), state: "done" },
            { title: "Chờ ngân hàng xác nhận", subtitle: "Đang kiểm tra giao dịch", state: "current" },
            { title: "Sẵn sàng nhận bánh", state: "pending" },
          ]}
        />
      </Card>
      <Card style={styles.code}>
        <CopyRow label="Mã đơn" value={order.code} />
      </Card>
      <View style={styles.flex} />
      <View style={styles.note}>
        <Icon name="bell" size={16} color="stone" />
        <Text style={styles.noteText}>Bạn có thể đóng app, Relife sẽ báo khi xong.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  ring: { width: RING, height: RING, alignSelf: "center", alignItems: "center", justifyContent: "center", marginTop: 88 },
  inner: { width: 108, height: 108, borderRadius: 54, backgroundColor: colors.goldSoft, alignItems: "center", justifyContent: "center" },
  title: { fontFamily: fontFamily.heading, fontSize: 28, lineHeight: 36, color: colors.ink, textAlign: "center", marginTop: 36 },
  body: {
    fontFamily: fontFamily.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.stone,
    textAlign: "center",
    maxWidth: 310,
    alignSelf: "center",
    marginTop: 12,
  },
  steps: { marginTop: 32 },
  code: { marginTop: 22 },
  flex: { flex: 1, minHeight: 24 },
  note: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 20 },
  noteText: { fontFamily: fontFamily.body, fontSize: 13, color: colors.stone },
});
