import type { PaymentFailureReason } from "@relife/shared";
import { Button, Card, HeroIcon, LoadingView, Text, colors, fontFamily, spacing } from "@relife/ui";
import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { CopyRow } from "@/components/CopyRow";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";

import { useCheckoutBag, useCheckoutOrder } from "../hooks/useCheckout";

const COPY: Record<PaymentFailureReason, { title: string; body: string }> = {
  hold_expired: {
    title: "Bạn chưa bị trừ tiền",
    body: "Thời gian giữ túi 15 phút đã hết nên túi được trả lại cho tiệm. Không có khoản nào bị trừ.",
  },
  abandoned: {
    title: "Thanh toán chưa hoàn tất",
    body: "Bạn đã thoát trước khi chuyển khoản xong. Chưa có khoản nào bị trừ.",
  },
  late_payment: {
    title: "Tiền đến sau khi hết giờ",
    body: "Relife đã nhận tiền nhưng đơn đã đóng. Hoàn tiền về tài khoản trong 1 đến 3 ngày làm việc.",
  },
};

/** A19 Payment Failed: one screen for every reason the payment did not complete. */
export function PaymentFailedScreen({ orderId, reason }: { orderId: string; reason: PaymentFailureReason }) {
  const order = useCheckoutOrder(orderId);
  const bag = useCheckoutBag(order.data?.bagId ?? "");
  const copy = COPY[reason] ?? COPY.hold_expired;

  if (!order.data) return <LoadingView />;
  const left = bag.data ? bag.data.stock - bag.data.sold : 0;

  return (
    <Screen edges={["top", "bottom"]} gap={0} header={<ScreenHeader leading="close" onLeadingPress={() => router.replace("/(customer)/(tabs)")} />}>
      <HeroIcon name="info" size={88} tone="warning" />
      <Text style={styles.title}>{copy.title}</Text>
      <Text style={styles.body}>{copy.body}</Text>
      <Card padding={14} style={styles.ref}>
        <CopyRow label="Mã tham chiếu" value={order.data.code} compact />
      </Card>
      <View style={styles.flex} />
      <Button
        title={left > 0 ? `Thử lại · còn ${left} túi` : "Túi đã hết"}
        icon="refresh"
        disabled={left === 0}
        onPress={() => router.replace(`/checkout/${order.data.bagId}`)}
      />
      <Pressable accessibilityRole="button" style={styles.link} onPress={() => router.replace(`/store/${order.data.storeId}`)}>
        <Text style={styles.linkText}>Xem túi khác ở {order.data.storeName}</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fontFamily.heading, fontSize: 28, lineHeight: 37, color: colors.ink, textAlign: "center", marginTop: 18 },
  body: { fontFamily: fontFamily.body, fontSize: 15, lineHeight: 22, color: colors.stone, textAlign: "center", marginTop: 8, paddingHorizontal: 12 },
  ref: { marginTop: 26 },
  flex: { flex: 1, minHeight: spacing.lg },
  link: { paddingVertical: 16, alignItems: "center" },
  linkText: { fontFamily: fontFamily.bodySemiBold, fontSize: 14, color: colors.forest },
});
