import { ORDER_STATUS, formatDuration, formatWindow, isSameVnDay, minutesUntil } from "@relife/shared";
import { Card, Chip, Icon, IconButton, LoadingView, StateView, StatusBadge, Text, colors, radius, shadows, spacing } from "@relife/ui";
import { router } from "expo-router";
import { Linking, StyleSheet, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { formatKm } from "@/features/bags";
import { useNow } from "@/lib/clock";
import { errorMessage } from "@/lib/queryClient";

import { pickupQrPayload } from "../api";
import { useOrder } from "../hooks/usePickup";
import { orderStatusView, splitCode } from "../orderStatus";

/** A20 Pickup Code: QR and the six-character code the store scans or types. */
export function PickupCodeScreen({ orderId }: { orderId: string }) {
  const query = useOrder(orderId);
  const now = useNow(15_000);

  if (query.isPending) return <LoadingView />;
  if (query.isError) return <StateView icon="alert" title="Không mở được mã" message={errorMessage(query.error)} actionLabel="Thử lại" onAction={() => query.refetch()} />;

  const order = query.data;
  const status = orderStatusView(order);
  const ready = order.status === ORDER_STATUS.PAID;
  const left = minutesUntil(order.pickupEnd, now);
  const notStarted = minutesUntil(order.pickupStart, now) > 0;

  return (
    <Screen header={<ScreenHeader title="Mã nhận bánh" leading="close" />} gap={12}>
      <StatusBadge label={status.label} tone={status.tone} style={styles.center} />
      <View style={[styles.qrCard, !ready && styles.dim]}>
        <QRCode value={pickupQrPayload(order)} size={236} color={colors.deepForest} backgroundColor={colors.white} />
      </View>
      <Text variant="numberXL" color="deepForest" align="center" selectable>
        {splitCode(order.pickupCode)}
      </Text>
      <Text variant="small" color="stone" align="center">
        Nói với nhân viên: “Mình nhận túi Relife, mã {splitCode(order.pickupCode).replace("  ", " ")}”
      </Text>

      <View style={styles.cards}>
        {ready && (
          <Card variant="danger" padding={14}>
            <View style={styles.between}>
              <View style={styles.inline}>
                <Icon name="clock" size={20} color="terracotta" />
                <View>
                  <Text variant="bodyStrong" color="terracotta">
                    {left <= 0 ? "Đã hết giờ nhận" : notStarted ? `Mở nhận lúc ${formatWindow(order.pickupStart, order.pickupEnd).split(" – ")[0]}` : `Còn ${formatDuration(left)} để nhận`}
                  </Text>
                  <Text variant="caption" color="stone">
                    Khung giờ {formatWindow(order.pickupStart, order.pickupEnd)}
                  </Text>
                </View>
              </View>
              {isSameVnDay(order.pickupStart, now.toISOString()) && <Chip label="Hôm nay" tone="dangerSoft" />}
            </View>
          </Card>
        )}

        <Card padding={14}>
          <View style={styles.between}>
            <View style={styles.flex}>
              <Text variant="bodyStrong">{order.storeName}</Text>
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
      </View>

      <View style={[styles.inline, styles.center, styles.offline]}>
        <Icon name="wifioff" size={16} color="stone" />
        {/* TODO(S5): cache the latest code in MMKV so it opens offline, and raise brightness with expo-brightness. */}
        <Text variant="caption" color="stone">
          Đưa mã này cho nhân viên khi đến tiệm
        </Text>
      </View>
      {!ready && (
        <Text variant="caption" color="stone" align="center" onPress={() => router.push(`/order/${order.id}`)}>
          Mã chỉ dùng được khi đơn ở trạng thái Sẵn sàng nhận.
        </Text>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { alignSelf: "center" },
  qrCard: {
    alignSelf: "center",
    padding: 18,
    borderRadius: radius.sheet,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadows.card,
  },
  dim: { opacity: 0.35 },
  between: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  inline: { flexDirection: "row", alignItems: "center", gap: 10 },
  flex: { flex: 1, gap: 2 },
  cards: { gap: 10, marginTop: 12 },
  offline: { marginTop: spacing.xl, gap: 6 },
});
