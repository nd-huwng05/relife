import { formatTime, type ScanResult } from "@relife/shared";
import { Button, Icon, Text, colors, fontFamily, spacing } from "@relife/ui";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useOrder } from "../../hooks/usePickup";

const AUTO_BACK_SECONDS = 4;

/** B13 Scan Valid: green screen, hand over the bag. Returns to the scanner by itself. */
export function ScanValidScreen({ orderId }: { orderId: string }) {
  const order = useOrder(orderId).data;
  const [left, setLeft] = useState(AUTO_BACK_SECONDS);

  useEffect(() => {
    if (left <= 0) {
      router.back();
      return;
    }
    const id = setTimeout(() => setLeft(left - 1), 1000);
    return () => clearTimeout(id);
  }, [left]);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.success }]}>
      <View style={styles.body}>
        <View style={[styles.hero, styles.heroValid]}>
          <Icon name="check" size={50} color="success" />
        </View>
        <Text style={styles.title}>Mã hợp lệ</Text>
        <Text style={[styles.lead, { color: colors.successMist }]}>Đưa cho {order?.customerName ?? "khách"}</Text>
        <Text style={styles.qty} accessibilityLabel={`${order?.qty ?? 1} túi`}>
          {order?.qty ?? 1}
        </Text>
        <Text style={styles.bagName}>{(order?.bagTitle ?? "Túi bánh").replace(" cuối ngày", "").toUpperCase()}</Text>
        <Text style={styles.paid}>Đã thanh toán · Không thu thêm tiền</Text>
      </View>
      <View style={styles.footer}>
        <Button title="Xong · Quét tiếp" variant="secondary" style={styles.whiteBtn} labelStyle={{ color: colors.success }} onPress={() => router.back()} />
        <Text variant="caption" color="successMist" align="center">
          Tự quay lại màn quét sau {left} giây
        </Text>
      </View>
    </SafeAreaView>
  );
}

type FailReason = Extract<ScanResult, { ok: false }>["reason"];

const FAIL_COPY: Record<FailReason, { title: string; detail: (t?: string) => string; say: (t?: string) => string }> = {
  already_used: {
    title: "Mã đã được dùng",
    detail: (t) => `Túi này đã giao lúc ${t ?? "--:--"} hôm nay.`,
    say: (t) => `“Mã này đã được nhận lúc ${t ?? "--:--"}. Bạn kiểm tra giúp mình đúng đơn trong mục Đơn hàng nhé.”`,
  },
  other_store: {
    title: "Mã của tiệm khác",
    detail: () => "Đơn này được đặt ở một tiệm khác.",
    say: () => "“Mã này thuộc tiệm khác. Bạn mở mục Đơn hàng để xem đúng địa chỉ tiệm nhé.”",
  },
  cancelled: {
    title: "Đơn đã huỷ",
    detail: () => "Đơn này đã được huỷ hoặc hoàn tiền.",
    say: () => "“Đơn này đã huỷ nên mình chưa đưa túi được. Bạn có thể đặt túi khác trong app nhé.”",
  },
  too_early: {
    title: "Chưa đến giờ nhận",
    detail: () => "Khung giờ nhận của đơn này chưa bắt đầu.",
    say: () => "“Túi của bạn chưa đến giờ nhận. Bạn quay lại trong khung giờ đã đặt giúp mình nhé.”",
  },
  window_closed: {
    title: "Đã hết giờ nhận",
    detail: () => "Khung giờ nhận đã kết thúc.",
    say: () => "“Khung giờ nhận đã qua nên đơn đã đóng. Bạn liên hệ Relife trong app nếu cần hỗ trợ nhé.”",
  },
  not_found: {
    title: "Mã không tồn tại",
    detail: () => "Không tìm thấy đơn nào với mã này.",
    say: () => "“Mình chưa tìm thấy mã này. Bạn mở lại mã trong mục Đơn hàng giúp mình nhé.”",
  },
};

/** B14 Scan Invalid: red screen with the exact sentence to read to the customer. */
export function ScanInvalidScreen({ reason, usedAt }: { reason: FailReason; usedAt?: string }) {
  const copy = FAIL_COPY[reason] ?? FAIL_COPY.not_found;
  const time = usedAt ? formatTime(usedAt) : undefined;
  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.terracotta }]}>
      <View style={styles.body}>
        <View style={[styles.hero, styles.heroInvalid]}>
          <Icon name="xc" size={48} color="terracotta" />
        </View>
        <Text style={styles.title}>{copy.title}</Text>
        <Text style={[styles.detail, { color: colors.terracottaMist }]}>{copy.detail(time)}</Text>
        <View style={styles.say}>
          <Text style={styles.sayLabel}>NÓI VỚI KHÁCH</Text>
          <Text style={styles.sayText}>{copy.say(time)}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Button title="Quét lại" variant="secondary" style={styles.whiteBtn} labelStyle={{ color: colors.terracotta }} onPress={() => router.back()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  body: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: 60, gap: 8 },
  hero: { alignSelf: "center", backgroundColor: colors.white, alignItems: "center", justifyContent: "center", marginBottom: 18 },
  heroValid: { width: 120, height: 120, borderRadius: 60, marginTop: 10 },
  heroInvalid: { width: 110, height: 110, borderRadius: 55 },
  title: { fontFamily: fontFamily.heading, fontSize: 30, lineHeight: 40, color: colors.white, textAlign: "center" },
  lead: { fontFamily: fontFamily.body, fontSize: 18, textAlign: "center" },
  detail: { fontFamily: fontFamily.body, fontSize: 16, textAlign: "center" },
  qty: { fontFamily: fontFamily.number, fontSize: 129, lineHeight: 150, letterSpacing: -2.58, color: colors.white, textAlign: "center", marginTop: 10 },
  bagName: { fontFamily: fontFamily.bodySemiBold, fontSize: 15, letterSpacing: 3, color: colors.successMist, textAlign: "center" },
  paid: { fontFamily: fontFamily.bodySemiBold, fontSize: 14, color: colors.white, textAlign: "center", marginTop: 60 },
  say: { marginTop: 22, padding: 16, gap: 8, borderRadius: 20, backgroundColor: colors.white },
  sayLabel: { fontFamily: fontFamily.bodySemiBold, fontSize: 11, letterSpacing: 1.32, color: colors.terracotta },
  sayText: { fontFamily: fontFamily.body, fontSize: 15, lineHeight: 22, color: colors.ink },
  whiteBtn: { borderWidth: 0 },
  footer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, gap: spacing.xs },
});
