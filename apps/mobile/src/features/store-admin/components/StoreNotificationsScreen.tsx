import type { StoreNotificationPrefs } from "@relife/shared";
import { Card, Divider, Icon, ListRow, LoadingView, Text, Toggle, colors, fontFamily, type IconName } from "@relife/ui";
import { Fragment } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";

import { useStorePrefs, useUpdateStorePrefs } from "../hooks/useStoreAdmin";

type ToggleKey = Exclude<keyof StoreNotificationPrefs, "postingReminderAt">;

const ROWS: { key: ToggleKey; icon: IconName; title: string; subtitle?: string }[] = [
  { key: "newOrder", icon: "bag", title: "Có đơn mới", subtitle: "Mỗi lần khách thanh toán" },
  { key: "customerArriving", icon: "clock", title: "Khách sắp đến", subtitle: "15 phút trước giờ nhận" },
  { key: "noShow", icon: "alert", title: "Khách không đến", subtitle: "Sau giờ ân hạn" },
  { key: "payoutSent", icon: "dollar", title: "Đã chuyển tiền", subtitle: "Mỗi kỳ chi trả" },
  { key: "newReview", icon: "star", title: "Đánh giá mới" },
];

const REMINDER_TIMES = ["17:00", "17:30", "18:00", "18:30"];

/** B21 Store Notifications. */
export function StoreNotificationsScreen() {
  const query = useStorePrefs();
  const update = useUpdateStorePrefs();
  if (!query.data) return <LoadingView />;
  const prefs = query.data;
  const nextTime = REMINDER_TIMES[(REMINDER_TIMES.indexOf(prefs.postingReminderAt) + 1) % REMINDER_TIMES.length] ?? "17:30";

  return (
    <Screen gap={12} header={<ScreenHeader title="Thông báo cửa hàng" />}>
      <Card gap={10} style={styles.reminder}>
        <View style={styles.inline}>
          <Icon name="bell" size={16} color="forest" />
          <Text style={styles.overline}>NHẮC ĐĂNG TÚI</Text>
        </View>
        <View style={styles.between}>
          <Text variant="bodyStrong">Nhắc lúc</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityHint="Đổi giờ nhắc"
            onPress={() => update.mutate({ postingReminderAt: nextTime })}
            style={styles.time}
          >
            <Icon name="clock" size={15} color="forest" />
            <Text variant="labelStrong" color="forest">
              {prefs.postingReminderAt} mỗi ngày
            </Text>
          </Pressable>
        </View>
        <Text variant="caption" color="stone">
          Chỉ nhắc khi tiệm chưa đăng túi nào trong ngày.
        </Text>
      </Card>
      <Card gap={12}>
        {ROWS.map((r, i) => (
          <Fragment key={r.key}>
            {i > 0 && <Divider />}
            <ListRow
              icon={r.icon}
              title={r.title}
              subtitle={r.subtitle}
              right={<Toggle value={prefs[r.key]} onValueChange={(v) => update.mutate({ [r.key]: v })} accessibilityLabel={r.title} />}
            />
          </Fragment>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  between: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  reminder: { backgroundColor: colors.goldSoft, borderWidth: 0 },
  inline: { flexDirection: "row", alignItems: "center", gap: 6 },
  overline: { fontFamily: fontFamily.bodySemiBold, fontSize: 11, letterSpacing: 1.32, color: colors.forest },
  time: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999 },
});
