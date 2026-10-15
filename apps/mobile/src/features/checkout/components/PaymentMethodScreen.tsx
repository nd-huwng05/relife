import { ORDER_STATUS, PAYMENT_METHOD, formatVnd, type PaymentMethod } from "@relife/shared";
import { Button, Icon, LoadingView, Radio, StateView, Text, colors, fontFamily, spacing } from "@relife/ui";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { BottomBar, ButtonRow } from "@/components/BottomBar";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";

import { useCancelHold, useCheckoutOrder } from "../hooks/useCheckout";
import { useHoldTimer } from "../hooks/useHoldTimer";
import { HoldChip } from "./HoldChip";

const METHODS: { key: PaymentMethod; badge: string; title: string; subtitle: string; available: boolean }[] = [
  { key: PAYMENT_METHOD.VIETQR, badge: "QR", title: "Chuyển khoản VietQR", subtitle: "Mọi ngân hàng · Xác nhận tự động", available: true },
  { key: PAYMENT_METHOD.MOMO, badge: "MoMo", title: "Ví MoMo", subtitle: "Sẽ bật khi cổng thanh toán sẵn sàng", available: false },
  { key: PAYMENT_METHOD.ZALOPAY, badge: "Zalo", title: "ZaloPay", subtitle: "Sẽ bật khi cổng thanh toán sẵn sàng", available: false },
];

/** A15 Payment Method. */
export function PaymentMethodScreen({ orderId }: { orderId: string }) {
  const query = useCheckoutOrder(orderId);
  const cancel = useCancelHold();
  const seconds = useHoldTimer(query.data?.holdExpiresAt);
  const [method, setMethod] = useState<PaymentMethod>(PAYMENT_METHOD.VIETQR);
  const expired = !!query.data && seconds === 0;

  const status = query.data?.status;

  useEffect(() => {
    if (expired) router.replace(`/checkout/failed/${orderId}?reason=hold_expired`);
  }, [expired, orderId]);

  // Coming back to this screen after paying (or after the hold ended) must not offer payment again.
  useEffect(() => {
    if (status === ORDER_STATUS.PAID) router.replace(`/pickup/${orderId}`);
    else if (status && status !== ORDER_STATUS.HELD) router.replace(`/order/${orderId}`);
  }, [status, orderId]);

  if (query.isPending) return <LoadingView />;
  if (query.isError) return <StateView icon="alert" title="Không tìm thấy đơn" actionLabel="Về Khám phá" onAction={() => router.replace("/(customer)/(tabs)")} />;
  const order = query.data;

  return (
    <Screen
      gap={14}
      header={<ScreenHeader title="Thanh toán" />}
      footer={
        <BottomBar>
          <ButtonRow>
            <Button
              title="Huỷ đơn"
              variant="dangerOutline"
              fullWidth={false}
              loading={cancel.isPending}
              style={styles.cancel}
              onPress={() => cancel.mutate(orderId, { onSuccess: () => router.replace(`/bag/${order.bagId}`) })}
            />
            <Button title={`Thanh toán ${formatVnd(order.amount)}`} style={styles.flex} onPress={() => router.push(`/checkout/pay/${orderId}`)} />
          </ButtonRow>
        </BottomBar>
      }
    >
      <HoldChip seconds={seconds} />
      <View style={styles.summary}>
        <Text style={[styles.summaryText, styles.flex]} numberOfLines={1}>
          {order.bagTitle} × {order.qty} · {order.storeName}
        </Text>
        <Text style={styles.summaryAmount}>{formatVnd(order.amount)}</Text>
      </View>
      <Text variant="section">Chọn cách thanh toán</Text>
      {METHODS.map((m) => {
        const selected = method === m.key;
        return (
          <Pressable
            key={m.key}
            accessibilityRole="radio"
            accessibilityState={{ selected, disabled: !m.available }}
            disabled={!m.available}
            onPress={() => setMethod(m.key)}
            style={[styles.method, selected && styles.methodOn, !m.available && styles.methodOff]}
          >
            <View style={[styles.badge, m.available && styles.badgeOn]}>
              <Text style={[styles.badgeText, m.available && styles.badgeTextOn]}>{m.badge}</Text>
            </View>
            <View style={[styles.flex, styles.gap2]}>
              <View style={styles.inline}>
                <Text variant="bodyStrong" color={m.available ? "ink" : "stone"}>
                  {m.title}
                </Text>
                {!m.available && (
                  <View style={styles.soon}>
                    <Text style={styles.soonText}>Sắp có</Text>
                  </View>
                )}
              </View>
              <Text variant="caption" color="stone">
                {m.subtitle}
              </Text>
            </View>
            {m.available && <Radio selected={selected} size={22} />}
          </Pressable>
        );
      })}
      <View style={styles.note}>
        <Icon name="info" size={18} color="amber" />
        <Text style={styles.noteText}>Chuyển đúng số tiền và nội dung để đơn được xác nhận tự động.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  cancel: { width: 110 },
  flex: { flex: 1 },
  summary: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  summaryText: { fontFamily: fontFamily.body, fontSize: 14, color: colors.stone },
  summaryAmount: { fontFamily: fontFamily.number, fontSize: 16, color: colors.ink },
  method: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
  },
  methodOn: { backgroundColor: colors.white, borderColor: colors.forest, borderWidth: 1.5 },
  methodOff: { opacity: 0.7 },
  badge: { width: 48, height: 36, borderRadius: 10, backgroundColor: colors.stoneSoft, alignItems: "center", justifyContent: "center" },
  badgeOn: { backgroundColor: colors.forest },
  badgeText: { fontFamily: fontFamily.number, fontSize: 13, color: colors.stone },
  badgeTextOn: { color: colors.cream },
  gap2: { gap: 2 },
  inline: { flexDirection: "row", alignItems: "center", gap: 6 },
  soon: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 999, backgroundColor: colors.stoneSoft },
  soonText: { fontFamily: fontFamily.bodySemiBold, fontSize: 10, color: colors.stone },
  note: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  noteText: { flex: 1, fontFamily: fontFamily.body, fontSize: 13, lineHeight: 19, color: colors.ink },
});
