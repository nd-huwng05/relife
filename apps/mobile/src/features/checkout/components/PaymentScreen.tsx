import { formatVnd } from "@relife/shared";
import { Button, Card, Icon, LoadingView, StateView, Text, colors, fontFamily } from "@relife/ui";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

import { BottomBar, ButtonRow } from "@/components/BottomBar";
import { CopyRow } from "@/components/CopyRow";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { errorMessage } from "@/lib/queryClient";

import { useCheckoutOrder, usePaymentInstructions, useReportTransfer } from "../hooks/useCheckout";
import { useHoldTimer } from "../hooks/useHoldTimer";
import { HoldChip } from "./HoldChip";

/** A16 Payment: VietQR transfer details. "Tôi đã chuyển khoản" only reports the transfer. */
export function PaymentScreen({ orderId }: { orderId: string }) {
  const order = useCheckoutOrder(orderId);
  const payment = usePaymentInstructions(orderId);
  const report = useReportTransfer();
  const seconds = useHoldTimer(order.data?.holdExpiresAt);
  const [bankHint, setBankHint] = useState(false);
  const expired = !!order.data && seconds === 0 && !order.data.transferReportedAt;

  useEffect(() => {
    if (expired) router.replace(`/checkout/failed/${orderId}?reason=hold_expired`);
  }, [expired, orderId]);

  if (payment.isPending || order.isPending) return <LoadingView label="Đang tạo mã VietQR…" />;
  if (payment.isError)
    return <StateView icon="alert" title="Chưa tạo được mã thanh toán" message={errorMessage(payment.error)} actionLabel="Thử lại" onAction={() => payment.refetch()} />;
  const p = payment.data;

  return (
    <Screen
      gap={12}
      header={<ScreenHeader title="Chuyển khoản VietQR" />}
      footer={
        <BottomBar>
          {bankHint && (
            <Text variant="caption" color="stone" align="center">
              Mở app ngân hàng của bạn và quét mã QR ở trên.
            </Text>
          )}
          <ButtonRow>
            {/* TODO(S4): open the bank app with the deeplink returned by the gateway. */}
            <Button
              title="Mở app ngân hàng"
              variant="secondary"
              labelStyle={[styles.label, styles.bankLabel]}
              fullWidth={false}
              style={styles.bank}
              onPress={() => setBankHint(true)}
            />
            <Button
              title="Tôi đã chuyển khoản"
              labelStyle={styles.label}
              style={styles.flex}
              loading={report.isPending}
              onPress={() => report.mutate(orderId, { onSuccess: () => router.replace(`/checkout/awaiting/${orderId}`) })}
            />
          </ButtonRow>
        </BottomBar>
      }
    >
      <HoldChip seconds={seconds} />
      <Card variant="plain" style={styles.qrCard}>
        <View style={styles.inline}>
          <Text style={styles.brand}>VIETQR</Text>
          <Text style={styles.caption}>·  napas 247</Text>
        </View>
        <QRCode value={p.qrPayload} size={196} color={colors.deepForest} backgroundColor={colors.white} />
        <Text style={styles.caption}>Quét bằng app ngân hàng bất kỳ</Text>
      </Card>
      <Card gap={12}>
        <CopyRow label="Số tiền" value={formatVnd(p.amount)} copyValue={String(p.amount)} large />
        <CopyRow label={`Số tài khoản · ${p.bankName}`} value={p.accountNumber.replace(/(\d{4})(\d{4})(\d+)/, "$1 $2 $3")} copyValue={p.accountNumber} />
        <CopyRow label="Nội dung chuyển khoản" value={p.transferNote} valueColor="terracotta" />
        <View style={styles.inline}>
          <Icon name="alert" size={16} color="terracotta" />
          <Text style={styles.warning}>Bắt buộc ghi đúng nội dung để đơn tự xác nhận.</Text>
        </View>
      </Card>
      {report.isError && (
        <Text variant="caption" color="terracotta" align="center">
          {errorMessage(report.error)}
        </Text>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  bank: { width: 160 },
  label: { fontSize: 14, lineHeight: 18 },
  bankLabel: { color: colors.forest },
  qrCard: { alignItems: "center", gap: 10 },
  inline: { flexDirection: "row", alignItems: "center", gap: 6 },
  brand: { fontFamily: fontFamily.number, fontSize: 13, letterSpacing: 1.3, color: colors.terracotta },
  caption: { fontFamily: fontFamily.body, fontSize: 12, color: colors.stone },
  warning: { flex: 1, fontFamily: fontFamily.body, fontSize: 12, color: colors.terracotta },
});
