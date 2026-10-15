import type { PauseBagInput } from "@relife/shared";
import { Button, InfoNote, RadioRow, Text, colors, fontFamily } from "@relife/ui";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { Sheet } from "@/components/Sheet";
import { errorMessage } from "@/lib/queryClient";

import { useMyBags, usePauseBag } from "../../hooks/useBags";

const REASONS: { key: PauseBagInput["reason"]; label: string }[] = [
  { key: "sold_out_early", label: "Hết bánh sớm hơn dự kiến" },
  { key: "closed_unexpectedly", label: "Đóng cửa đột xuất" },
  { key: "other", label: "Lý do khác" },
];

/** B09 Quick Toggle: pause a live bag and decide what happens to paid orders. */
export function PauseBagSheet({ bagId }: { bagId: string }) {
  const bag = useMyBags().data?.find((b) => b.id === bagId);
  const pause = usePauseBag();
  const [reason, setReason] = useState<PauseBagInput["reason"]>("sold_out_early");
  const [paidOrders, setPaidOrders] = useState<PauseBagInput["paidOrders"]>("keep");
  const paid = bag?.openPaidOrders ?? 0;

  return (
    <Sheet
      gap={14}
      footer={
        <>
          {pause.isError && (
            <Text variant="caption" color="terracotta" align="center">
              {errorMessage(pause.error)}
            </Text>
          )}
          <Button
            title="Tạm dừng túi"
            variant="dangerSolid"
            loading={pause.isPending}
            onPress={() => pause.mutate({ bagId, reason, paidOrders }, { onSuccess: () => router.back() })}
          />
        </>
      }
    >
      <Text style={styles.title}>Tạm dừng túi này?</Text>
      {paid > 0 && (
        <InfoNote icon="users" tone="warning">{`${paid} khách đã thanh toán túi này. Họ sẽ được báo ngay khi bạn tạm dừng.`}</InfoNote>
      )}
      <Text style={styles.label}>Lý do</Text>
      <View style={styles.list}>
        {REASONS.map((r) => (
          <RadioRow key={r.key} label={r.label} selected={reason === r.key} onPress={() => setReason(r.key)} />
        ))}
      </View>
      {paid > 0 && (
        <>
          <Text style={styles.label}>Với {paid} đơn đã thanh toán</Text>
          <View style={styles.list}>
            <RadioRow label="Vẫn giữ đơn, khách đến nhận" selected={paidOrders === "keep"} onPress={() => setPaidOrders("keep")} />
            <RadioRow label="Huỷ và hoàn tiền 100%" selected={paidOrders === "refund"} onPress={() => setPaidOrders("refund")} />
          </View>
        </>
      )}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  list: { gap: 14 },
  title: { fontFamily: fontFamily.heading, fontSize: 24, lineHeight: 32, color: colors.ink },
  label: { fontFamily: fontFamily.bodySemiBold, fontSize: 14, color: colors.ink },
});
