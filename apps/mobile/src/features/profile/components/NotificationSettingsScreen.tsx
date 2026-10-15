import type { CustomerNotificationPrefs } from "@relife/shared";
import { Card, Divider, Icon, ListRow, LoadingView, Overline, Text, Toggle, colors, fontFamily, type IconName } from "@relife/ui";
import { Fragment } from "react";
import { StyleSheet, View } from "react-native";

import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";

import { useProfile, useUpdateNotificationPrefs } from "../hooks/useProfile";

type PrefKey = keyof CustomerNotificationPrefs;

const GROUPS: { title: string; rows: { key: PrefKey; icon: IconName; title: string; subtitle?: string; locked?: boolean }[] }[] = [
  {
    title: "ĐƠN HÀNG",
    rows: [
      { key: "orders", icon: "bag", title: "Đơn hàng và thanh toán", subtitle: "Luôn bật để không lỡ mã nhận", locked: true },
      { key: "pickupReminder", icon: "clock", title: "Nhắc giờ nhận bánh", subtitle: "30 phút trước khi đóng" },
    ],
  },
  {
    title: "KHÁM PHÁ",
    rows: [
      { key: "followedStores", icon: "bell", title: "Tiệm theo dõi đăng túi", subtitle: "Khi tiệm bạn theo dõi có túi mới" },
      { key: "nearbyDeals", icon: "heart", title: "Túi gần bạn giá tốt", subtitle: "Tối đa 1 lần mỗi ngày" },
      { key: "reviewReminder", icon: "star", title: "Nhắc đánh giá", subtitle: "Sau khi nhận túi" },
    ],
  },
  { title: "KHÁC", rows: [{ key: "news", icon: "msg", title: "Tin tức và ưu đãi Relife" }] },
];

/** A29 Notification Settings: one switch per type, no global "off". */
export function NotificationSettingsScreen() {
  const query = useProfile();
  const update = useUpdateNotificationPrefs();
  if (!query.data) return <LoadingView />;
  const prefs = query.data.notificationPrefs;

  return (
    <Screen gap={10} header={<ScreenHeader title="Cài đặt thông báo" />}>
      <Text style={styles.intro}>Mỗi loại thông báo có công tắc riêng, không có một nút tắt tất cả.</Text>
      {GROUPS.map((g) => (
        <Fragment key={g.title}>
          <Overline>{g.title}</Overline>
          <Card gap={12}>
            {g.rows.map((r, i) => (
              <Fragment key={r.key}>
                {i > 0 && <Divider />}
                <ListRow
                  icon={r.icon}
                  title={r.title}
                  subtitle={r.subtitle}
                  right={
                    <Toggle
                      value={r.locked ? true : prefs[r.key]}
                      // Order notifications stay on; the switch shows on but ignores taps.
                      onValueChange={(v) => !r.locked && update.mutate({ [r.key]: v })}
                      accessibilityLabel={r.title}
                    />
                  }
                />
              </Fragment>
            ))}
          </Card>
        </Fragment>
      ))}
      <View style={styles.note}>
        <Icon name="clock" size={16} color="stone" />
        <Text style={styles.noteText}>Giờ yên lặng 22:00 – 07:00 luôn được tôn trọng.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { fontFamily: fontFamily.body, fontSize: 14, lineHeight: 20, color: colors.stone },
  note: { flexDirection: "row", alignItems: "center", gap: 8 },
  noteText: { flex: 1, fontFamily: fontFamily.body, fontSize: 13, color: colors.stone },
});
