import { CANCEL_REASONS, formatVnd, type CancelOrderInput } from "@relife/shared";
import { Button, Card, Icon, RadioRow, StatusBadge, Text, colors, fontFamily, spacing } from "@relife/ui";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { ButtonRow } from "@/components/BottomBar";
import { Sheet } from "@/components/Sheet";
import { errorMessage } from "@/lib/queryClient";

import { useCancelOrder, useRefundPreview } from "../hooks/usePickup";

/** A23 Cancel Order. Refund rules come from the server (100% before 18:00). */
export function CancelOrderSheet({ orderId }: { orderId: string }) {
  const refund = useRefundPreview(orderId);
  const cancel = useCancelOrder();
  const [reason, setReason] = useState<CancelOrderInput["reason"]>("changed_plans");

  return (
    <Sheet
      gap={16}
      footer={
        <>
          {cancel.isError && (
            <Text variant="caption" color="terracotta" align="center">
              {errorMessage(cancel.error)}
            </Text>
          )}
          <ButtonRow>
            <Button title="Giữ đơn" variant="secondary" fullWidth={false} style={styles.keep} onPress={() => router.back()} />
            <Button
              title="Xác nhận huỷ"
              variant="dangerSolid"
              style={styles.flex}
              loading={cancel.isPending}
              onPress={() => cancel.mutate({ orderId, reason }, { onSuccess: () => router.dismissTo("/(customer)/(tabs)/orders") })}
            />
          </ButtonRow>
        </>
      }
    >
      <Text style={styles.title}>Huỷ đơn này?</Text>
      <Card gap={8} style={styles.policy}>
        <View style={styles.inline}>
          <Icon name="info" size={18} color="ink" />
          <Text style={styles.label}>Quy định hoàn tiền</Text>
        </View>
        <Text variant="small" color="stone">
          Huỷ trước 18:00 được hoàn 100%. Sau 18:00 tiệm đã chuẩn bị bánh nên không hoàn tiền.
        </Text>
        {refund.data !== undefined && (
          <View style={styles.inline}>
            <StatusBadge
              label={refund.data > 0 ? `Bạn được hoàn ${formatVnd(refund.data)}` : "Không được hoàn tiền"}
              tone={refund.data > 0 ? "success" : "danger"}
            />
            {refund.data > 0 && (
              <Text variant="caption" color="stone">
                trong 1–3 ngày
              </Text>
            )}
          </View>
        )}
      </Card>
      <Text style={styles.label}>Lý do huỷ</Text>
      <View style={styles.list}>
        {CANCEL_REASONS.map((r) => (
          <RadioRow key={r.key} label={r.label} selected={reason === r.key} onPress={() => setReason(r.key)} />
        ))}
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  inline: { flexDirection: "row", alignItems: "center", gap: 8 },
  title: { fontFamily: fontFamily.heading, fontSize: 26, lineHeight: 34, color: colors.ink },
  policy: { backgroundColor: colors.goldSoft, borderWidth: 0 },
  label: { fontFamily: fontFamily.bodySemiBold, fontSize: 14, color: colors.ink },
  list: { gap: spacing.md },
  keep: { width: 130 },
  flex: { flex: 1 },
});
