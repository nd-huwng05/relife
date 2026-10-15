import { formatDuration, formatWindow, minutesUntil } from "@relife/shared";
import { Avatar, Button, Card, Icon, LoadingView, StateView, StatusBadge, Text, colors, fontFamily, type IconName } from "@relife/ui";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

import { BottomBar } from "@/components/BottomBar";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useNow } from "@/lib/clock";
import { errorMessage } from "@/lib/queryClient";

import { NO_SHOW_GRACE_MINUTES } from "../../api";
import { useMarkNoShow, useOrder } from "../../hooks/usePickup";

const NEXT: { icon: IconName; text: string }[] = [
  { icon: "check", text: "Tiệm vẫn nhận đủ tiền của đơn" },
  { icon: "check", text: "Bạn có thể bán hoặc tặng lại túi này" },
  { icon: "info", text: "Khách không được hoàn tiền theo quy định" },
];

/** B16 Mark As No Show: only after the 15 minute grace period (`markNoShow`). */
export function NoShowScreen({ orderId }: { orderId: string }) {
  const query = useOrder(orderId);
  const mark = useMarkNoShow();
  const now = useNow(15_000);

  if (query.isPending) return <LoadingView />;
  if (query.isError) return <StateView icon="alert" title="Không mở được đơn" message={errorMessage(query.error)} />;

  const order = query.data;
  const late = -minutesUntil(order.pickupEnd, now);
  const allowed = late >= NO_SHOW_GRACE_MINUTES;

  return (
    <Screen
      gap={12}
      header={<ScreenHeader title="Khách không đến" />}
      footer={
        <BottomBar plain>
          {mark.isError && (
            <Text variant="caption" color="terracotta" align="center">
              {errorMessage(mark.error)}
            </Text>
          )}
          <Button
            title="Đánh dấu không đến"
            variant="dangerSolid"
            disabled={!allowed}
            loading={mark.isPending}
            onPress={() => mark.mutate(orderId, { onSuccess: () => router.back() })}
          />
        </BottomBar>
      }
    >
      <Card padding={14}>
        <View style={styles.row}>
          <Avatar name={order.customerName} size={40} tone="linen" />
          <View style={styles.text}>
            <Text variant="bodyStrong">
              {order.customerName} · {order.bagTitle.replace(" cuối ngày", "")} × {order.qty}
            </Text>
            <Text variant="caption" color="stone">
              Khung nhận {formatWindow(order.pickupStart, order.pickupEnd)}
            </Text>
          </View>
          <StatusBadge label="Chưa đến" tone="warning" />
        </View>
      </Card>
      <Card gap={6} style={styles.late}>
        <View style={styles.inline}>
          <Icon name="clock" size={18} color="amber" />
          <Text variant="bodyStrong" color="amber">
            {late > 0 ? `Đã qua giờ nhận ${formatDuration(late)}` : "Chưa hết khung giờ nhận"}
          </Text>
        </View>
        <Text variant="small" color="stone">
          Chỉ được đánh dấu sau {NO_SHOW_GRACE_MINUTES} phút ân hạn. Khách đã được nhắc 2 lần.
        </Text>
      </Card>
      <Card gap={10}>
        <Text variant="bodyStrong" style={styles.label14}>
          Điều gì xảy ra tiếp theo
        </Text>
        {NEXT.map((n) => (
          <View key={n.text} style={styles.inline}>
            <Icon name={n.icon} size={14} color={n.icon === "check" ? "success" : "stone"} />
            <Text variant="small" color={n.icon === "check" ? "ink" : "stone"}>
              {n.text}
            </Text>
          </View>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  text: { flex: 1, gap: 2 },
  inline: { flexDirection: "row", alignItems: "center", gap: 8 },
  late: { backgroundColor: colors.amberSoft, borderWidth: 0 },
  label14: { fontFamily: fontFamily.bodySemiBold, fontSize: 14, lineHeight: 18 },
});
