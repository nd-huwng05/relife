import { formatDayMonth, formatTime, formatWeekday } from "@relife/shared";
import { Card, HeroIcon, Icon, LoadingView, Text, Timeline, colors, fontFamily } from "@relife/ui";
import { Pressable, StyleSheet, View } from "react-native";

import { Screen } from "@/components/Screen";

import { useCharityApplication } from "../hooks/useCharity";

/** C02 Pending Approval: stricter checks than stores, including a call with the representative. */
export function CharityPendingScreen() {
  const app = useCharityApplication().data;
  if (!app) return <LoadingView />;
  const call = app.verificationCall;
  const firstOpen = app.checks.findIndex((c) => !c.done);

  return (
    <Screen edges={["top", "bottom"]} gap={12}>
      <HeroIcon name="users" size={92} tone="soft" style={styles.hero} />
      <Text style={styles.title}>Đang xác minh tổ chức</Text>
      <Text style={styles.body}>Vì thực phẩm được tặng miễn phí, Relife xác minh kỹ hơn, gồm một cuộc gọi với người đại diện.</Text>
      <Card style={styles.steps}>
        <Timeline dense steps={app.checks.map((c, i) => ({ title: c.label, state: c.done ? "done" : i === firstOpen ? "current" : "pending" }))} />
      </Card>
      {call && (
        <Card variant="dark" gap={6}>
          <View style={styles.inline}>
            <Icon name="phone" size={16} color="champagne" />
            <Text style={styles.overline}>CUỘC GỌI XÁC MINH</Text>
          </View>
          <Text style={styles.callTitle}>
            {formatWeekday(call.at)} <Text style={styles.callNumber}>{formatDayMonth(call.at)}</Text> ·{" "}
            <Text style={styles.callNumber}>{formatTime(call.at)}</Text>
          </Text>
          <Text variant="small" color="sageLight">
            Với {call.contactName} · {call.contactRole}
          </Text>
          {/* TODO(S9): reschedule the call. */}
          <Pressable accessibilityRole="button" hitSlop={8}>
            <Text variant="labelStrong" color="champagne">
              Đổi lịch
            </Text>
          </Pressable>
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { marginTop: 30 },
  title: { fontFamily: fontFamily.heading, fontSize: 26, lineHeight: 34, color: colors.ink, textAlign: "center", marginTop: 4 },
  body: { fontFamily: fontFamily.body, fontSize: 15, lineHeight: 22, color: colors.stone, textAlign: "center", paddingHorizontal: 12 },
  steps: { marginTop: 8 },
  inline: { flexDirection: "row", alignItems: "center", gap: 6 },
  overline: { fontFamily: fontFamily.bodySemiBold, fontSize: 11, letterSpacing: 1.32, color: colors.champagne },
  callTitle: { fontFamily: fontFamily.heading, fontSize: 22, lineHeight: 29, color: colors.cream },
  callNumber: { fontFamily: fontFamily.number, fontSize: 20 },
});
