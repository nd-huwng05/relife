import { NOTIFICATION_KIND, formatTime, formatWeekdayShort, isSameVnDay, type AppNotification, type NotificationKind } from "@relife/shared";
import { Card, Icon, LoadingView, StateView, Text, colors, fontFamily, spacing, type ColorName, type IconName } from "@relife/ui";
import { router, type Href } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useNow } from "@/lib/clock";

import { useMarkAllRead, useMarkRead, useNotifications } from "../hooks/useProfile";

const ICONS: Record<NotificationKind, { icon: IconName; bg: string; fg: ColorName }> = {
  [NOTIFICATION_KIND.PICKUP]: { icon: "bag", bg: colors.successSoft, fg: "success" },
  [NOTIFICATION_KIND.ORDER]: { icon: "clock", bg: colors.terracottaSoft, fg: "terracotta" },
  [NOTIFICATION_KIND.STORE]: { icon: "bell", bg: colors.goldSoft, fg: "ink" },
  [NOTIFICATION_KIND.PAYOUT]: { icon: "dollar", bg: colors.amberSoft, fg: "amber" },
  [NOTIFICATION_KIND.REVIEW]: { icon: "star", bg: colors.goldSoft, fg: "ink" },
  [NOTIFICATION_KIND.PROMO]: { icon: "heart", bg: colors.goldSoft, fg: "terracotta" },
};

const DAY_MS = 86_400_000;

/** A25 Notifications. */
export function NotificationsScreen() {
  const query = useNotifications();
  const markAll = useMarkAllRead();
  const markRead = useMarkRead();
  const now = useNow(60_000);
  const list = query.data ?? [];
  const today = list.filter((n) => isSameVnDay(n.createdAt, now.toISOString()));
  const yesterdayIso = new Date(now.getTime() - DAY_MS).toISOString();
  const yesterday = list.filter((n) => isSameVnDay(n.createdAt, yesterdayIso));
  const earlier = list.filter((n) => !isSameVnDay(n.createdAt, now.toISOString()) && !isSameVnDay(n.createdAt, yesterdayIso));

  const open = (n: AppNotification) => {
    markRead.mutate(n.id);
    if (n.link) router.push(n.link as Href);
  };

  return (
    <Screen
      gap={10}
      header={
        <ScreenHeader
          title="Thông báo"
          right={
            <Pressable accessibilityRole="button" onPress={() => markAll.mutate()} hitSlop={8}>
              <Text style={styles.readAll}>Đọc hết</Text>
            </Pressable>
          }
        />
      }
    >
      {query.isPending ? (
        <LoadingView />
      ) : list.length === 0 ? (
        <StateView icon="bell" title="Chưa có thông báo" />
      ) : (
        <>
          {today.length > 0 && <Text style={styles.group}>HÔM NAY</Text>}
          {today.map((n) => (
            <NotificationRow key={n.id} n={n} time={formatTime(n.createdAt)} onPress={() => open(n)} />
          ))}
          {yesterday.length > 0 && <Text style={styles.group}>HÔM QUA</Text>}
          {yesterday.map((n) => (
            <NotificationRow key={n.id} n={n} time={formatWeekdayShort(n.createdAt)} onPress={() => open(n)} />
          ))}
          {earlier.length > 0 && <Text style={styles.group}>TRƯỚC ĐÓ</Text>}
          {earlier.map((n) => (
            <NotificationRow key={n.id} n={n} time={formatWeekdayShort(n.createdAt)} onPress={() => open(n)} />
          ))}
        </>
      )}
      <Pressable accessibilityRole="button" onPress={() => router.push("/account/notifications")} style={styles.settings}>
        <Text variant="labelStrong" color="forest" align="center">
          Cài đặt thông báo
        </Text>
      </Pressable>
    </Screen>
  );
}

function NotificationRow({ n, time, onPress }: { n: AppNotification; time: string; onPress: () => void }) {
  return (
    <Card padding={14} onPress={onPress} accessibilityLabel={n.title} style={[styles.card, !n.read && styles.unread]}>
      <View style={styles.row}>
        <View style={[styles.icon, { backgroundColor: ICONS[n.kind].bg }]}>
          <Icon name={ICONS[n.kind].icon} size={20} color={ICONS[n.kind].fg} />
        </View>
        <View style={styles.text}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, styles.flex]} numberOfLines={1}>
              {n.title}
            </Text>
            <Text variant="caption" color="stone">
              {time}
            </Text>
          </View>
          <Text style={styles.body}>{n.body}</Text>
        </View>
        {!n.read && <View style={styles.dot} />}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 18 },
  unread: { backgroundColor: colors.white },
  icon: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center" },
  title: { fontFamily: fontFamily.bodySemiBold, fontSize: 14, color: colors.ink },
  body: { fontFamily: fontFamily.body, fontSize: 13, lineHeight: 18, color: colors.stone },
  group: { fontFamily: fontFamily.bodySemiBold, fontSize: 13, letterSpacing: 1.3, color: colors.stone },
  readAll: { fontFamily: fontFamily.bodySemiBold, fontSize: 14, color: colors.forest },
  row: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  text: { flex: 1, gap: 3 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  flex: { flex: 1 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.terracotta, marginTop: 2 },
  settings: { paddingVertical: spacing.sm },
});
