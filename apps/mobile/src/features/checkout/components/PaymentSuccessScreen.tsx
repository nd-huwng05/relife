import { formatTime, formatVnd, formatWindow } from "@relife/shared";
import { Button, Icon, LoadingView, Text, colors, fontFamily, spacing } from "@relife/ui";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { Screen } from "@/components/Screen";

import { useCheckoutOrder, useImpact } from "../hooks/useCheckout";

/** A18 Payment Successful. Shown only after the order is `paid` on the server. */
export function PaymentSuccessScreen({ orderId }: { orderId: string }) {
  const query = useCheckoutOrder(orderId);
  const impact = useImpact();
  const [reminderNote, setReminderNote] = useState(false);

  if (!query.data) return <LoadingView />;
  const order = query.data;
  const reminderAt = formatTime(new Date(new Date(order.pickupStart).getTime() - 15 * 60000).toISOString());

  return (
    <Screen edges={["top", "bottom"]} background="deepForest" gap={0}>
      <StatusBar style="light" />
      <View style={styles.halo}>
        <View style={styles.hero}>
          <Icon name="check" size={44} color="deepForest" />
        </View>
      </View>
      <Text style={styles.title}>Đặt túi thành công!</Text>
      <Text style={styles.body}>Đã nhận {formatVnd(order.amount)}. Túi bánh đang chờ bạn.</Text>

      <View style={styles.card}>
        <View style={styles.inline}>
          <Icon name="bag" size={18} color="champagne" />
          <Text style={styles.bag}>
            {order.bagTitle} × {order.qty}
          </Text>
        </View>
        <Text style={styles.address}>
          {order.storeName} · {order.storeAddress}
        </Text>
        <View style={styles.divider} />
        <Text style={styles.overline}>NHẬN HÔM NAY</Text>
        <Text style={styles.window}>{formatWindow(order.pickupStart, order.pickupEnd)}</Text>
      </View>

      <View style={styles.flex} />
      <View style={styles.impact}>
        <Icon name="heart" size={18} color="deepForest" />
        <Text style={styles.impactText}>
          Bạn vừa cứu {order.qty} bữa ăn{impact.data ? ` · Tổng cộng ${impact.data.bagsSaved} túi` : ""}
        </Text>
      </View>
      <Button
        title="Xem mã nhận bánh"
        variant="light"
        style={styles.cta}
        onPress={() => {
          // Close the checkout screens so Back from the code goes to Orders, not to payment.
          router.dismissTo("/(customer)/(tabs)/orders");
          router.push(`/pickup/${order.id}`);
        }}
      />
      {/* TODO(S7): add the reminder with expo-calendar or a local notification. */}
      <Pressable accessibilityRole="button" style={styles.reminder} onPress={() => setReminderNote(true)}>
        <Icon name="calendar" size={16} color="champagne" />
        <Text style={styles.reminderText}>{reminderNote ? "Nhắc lịch sẽ có trong bản tới" : `Thêm nhắc lịch ${reminderAt}`}</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  halo: {
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(201, 169, 110, 0.12)",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: -50,
  },
  hero: { width: 104, height: 104, borderRadius: 52, backgroundColor: colors.champagne, alignItems: "center", justifyContent: "center" },
  title: { fontFamily: fontFamily.heading, fontSize: 30, lineHeight: 40, color: colors.cream, textAlign: "center" },
  body: { fontFamily: fontFamily.body, fontSize: 15, lineHeight: 20, color: colors.mist, textAlign: "center", marginTop: 8 },
  card: {
    marginTop: 30,
    gap: 8,
    padding: 16,
    borderRadius: 20,
    backgroundColor: colors.forestCard,
    borderWidth: 1,
    borderColor: colors.forestLine,
  },
  inline: { flexDirection: "row", alignItems: "center", gap: 8 },
  bag: { fontFamily: fontFamily.bodySemiBold, fontSize: 15, color: colors.cream, flexShrink: 1 },
  address: { fontFamily: fontFamily.body, fontSize: 13, color: colors.sageLight },
  divider: { height: 1, backgroundColor: "rgba(255, 255, 255, 0.12)" },
  overline: { fontFamily: fontFamily.bodySemiBold, fontSize: 11, letterSpacing: 1.32, color: colors.champagne },
  window: { fontFamily: fontFamily.number, fontSize: 28, lineHeight: 34, letterSpacing: -0.56, color: colors.cream },
  flex: { flex: 1, minHeight: spacing.lg },
  impact: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: colors.goldSoft,
  },
  impactText: { fontFamily: fontFamily.bodySemiBold, fontSize: 14, color: colors.deepForest },
  cta: { marginTop: 14 },
  reminder: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 18 },
  reminderText: { fontFamily: fontFamily.bodySemiBold, fontSize: 14, color: colors.champagne },
});
