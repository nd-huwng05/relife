import { formatVnd, formatWindow } from "@relife/shared";
import { Button, Card, CheckboxRow, Chip, Divider, Icon, InfoNote, KeyValueRow, LoadingView, StateView, Stepper, Text, colors, fontFamily, spacing } from "@relife/ui";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { BottomBar } from "@/components/BottomBar";
import { Photo } from "@/components/Photo";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { sessionStore, useSession } from "@/features/auth";
import { newIdempotencyKey } from "@/lib/functions";
import { errorMessage } from "@/lib/queryClient";

import { useCheckoutBag, useCreateOrder } from "../hooks/useCheckout";

/** A14 Quantity And Confirm. Creating the order holds the stock for 15 minutes. */
export function ConfirmOrderScreen({ bagId }: { bagId: string }) {
  const session = useSession();
  const query = useCheckoutBag(bagId);
  const create = useCreateOrder();
  const [qty, setQty] = useState(1);
  const [agreed, setAgreed] = useState(false);
  // Same key for every retry of this checkout, so a double tap never books twice.
  const [idempotencyKey] = useState(newIdempotencyKey);

  if (query.isPending) return <LoadingView />;
  if (query.isError) return <StateView icon="alert" title="Không mở được túi" message={errorMessage(query.error)} actionLabel="Quay lại" onAction={() => router.back()} />;

  const bag = query.data;
  const left = bag.stock - bag.sold;
  const max = Math.max(1, Math.min(bag.maxPerCustomer, left));
  const total = bag.price * qty;

  return (
    <Screen
      gap={12}
      header={<ScreenHeader title="Xác nhận đặt túi" />}
      footer={
        <BottomBar>
          {session.isGuest ? (
            <>
              <Text variant="small" color="stone" align="center">
                Đăng nhập để giữ túi và nhận mã nhận bánh.
              </Text>
              <Button title="Đăng nhập để đặt túi" onPress={() => sessionStore.signOut()} />
            </>
          ) : (
            <>
              {create.isError && (
                <Text variant="caption" color="terracotta" align="center">
                  {errorMessage(create.error)}
                </Text>
              )}
              <Button
                title={`Tiếp tục thanh toán · ${formatVnd(total)}`}
                disabled={!agreed || left === 0}
                loading={create.isPending}
                onPress={() =>
                  create.mutate(
                    { bagId, qty, acceptedSelfPickup: true, idempotencyKey },
                    { onSuccess: (order) => router.replace(`/checkout/method/${order.id}`) },
                  )
                }
              />
            </>
          )}
        </BottomBar>
      }
    >
      <View style={styles.bagRow}>
        <Photo photo={bag.photos[0]} width={64} height={64} radius={16} />
        <View style={styles.flex}>
          <Text style={styles.bagTitle}>{bag.title}</Text>
          <Text style={styles.store}>{bag.storeName}</Text>
          <Chip label={left > 0 ? `Còn ${left} túi` : "Đã hết túi"} tone="dangerSoft" size="sm" />
        </View>
      </View>

      <Card>
        <View style={styles.between}>
          <View style={styles.gap2}>
            <Text variant="bodyStrong">Số lượng</Text>
            <Text variant="caption" color="stone">
              Tối đa {bag.maxPerCustomer} túi mỗi người
            </Text>
          </View>
          <Stepper value={qty} onChange={setQty} min={1} max={max} label="số lượng túi" />
        </View>
      </Card>

      <Card gap={10}>
        <KeyValueRow label={`${formatVnd(bag.price)} × ${qty}`} value={formatVnd(total)} />
        <KeyValueRow label="Phí dịch vụ" value="0đ" />
        <Divider />
        <KeyValueRow label="Tổng cộng" value={formatVnd(total)} strong />
      </Card>

      <Card variant="dark" gap={6}>
        <View style={styles.inline}>
          <Icon name="clock" size={16} color="champagne" />
          <Text style={styles.overline}>NHẬN HÔM NAY</Text>
        </View>
        <Text style={styles.window}>{formatWindow(bag.pickupStart, bag.pickupEnd)}</Text>
        <Text style={styles.address}>
          {bag.storeName} · {bag.storeAddress}
        </Text>
      </Card>

      <InfoNote icon="alert" tone="danger">
        Bạn tự đến lấy tại tiệm trong khung giờ trên. Relife không giao hàng và không hoàn tiền nếu bạn không đến lấy.
      </InfoNote>
      <CheckboxRow label="Tôi sẽ tự đến lấy trong khung giờ này" checked={agreed} onPress={() => setAgreed(!agreed)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  bagRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  flex: { flex: 1, gap: 3, alignItems: "flex-start" },
  gap2: { gap: 2 },
  bagTitle: { fontFamily: fontFamily.bodySemiBold, fontSize: 15, color: colors.ink },
  store: { fontFamily: fontFamily.body, fontSize: 13, color: colors.stone },
  inline: { flexDirection: "row", alignItems: "center", gap: 6 },
  overline: { fontFamily: fontFamily.bodySemiBold, fontSize: 11, letterSpacing: 1.32, color: colors.champagne },
  window: { fontFamily: fontFamily.number, fontSize: 28, lineHeight: 34, letterSpacing: -0.56, color: colors.cream },
  address: { fontFamily: fontFamily.body, fontSize: 14, color: colors.mist },
  between: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm },
});
