import { STORE_STATUS, formatDayMonth, formatTime } from "@relife/shared";
import { Button, Card, HeroIcon, Icon, IconButton, LoadingView, Overline, Text, Timeline, colors, fontFamily, spacing } from "@relife/ui";
import { router } from "expo-router";
import { Fragment } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { BottomBar } from "@/components/BottomBar";
import { Screen } from "@/components/Screen";
import { sessionStore } from "@/features/auth";

import { storeContent } from "../api";
import { useApplication, useDevSetApplicationStatus } from "../hooks/useStoreAdmin";
import { RegistrationScreen } from "./RegistrationScreen";

/** B02 Pending Approval. */
export function PendingApprovalScreen() {
  const app = useApplication().data;
  const dev = useDevSetApplicationStatus();
  if (!app) return <LoadingView />;

  return (
    <Screen edges={["top", "bottom"]} gap={12}>
      <HeroIcon name="clock" size={96} tone="soft" style={styles.pendingHero} />
      <Text style={styles.title}>Hồ sơ đang được duyệt</Text>
      <Text style={styles.body}>Relife thường phản hồi trong 1 đến 2 ngày làm việc. Bạn sẽ nhận thông báo khi có kết quả.</Text>
      <Card style={styles.steps}>
        <Timeline
          dense
          steps={[
            {
              title: "Đã gửi hồ sơ",
              subtitle: app.submittedAt ? `${formatDayMonth(app.submittedAt)} · ${formatTime(app.submittedAt)}` : undefined,
              state: "done",
            },
            {
              title: "Relife kiểm tra giấy tờ và vị trí",
              subtitle: app.expectedBy ? `Dự kiến xong trước ${formatDayMonth(app.expectedBy)}` : undefined,
              state: "current",
            },
            { title: "Kích hoạt, bắt đầu đăng túi", state: "pending" },
          ]}
        />
      </Card>
      <Overline>{`TRONG LÚC CHỜ · ${storeContent.guides.length} BÀI HƯỚNG DẪN NGẮN`}</Overline>
      {storeContent.guides.map((g, i) => (
        <Card key={g.title} padding={14} onPress={() => router.push(`/training?card=${i}`)} accessibilityLabel={g.title}>
          <View style={styles.row}>
            <IconButton name={g.icon} size={36} iconSize={16} variant="soft" accessibilityLabel="" />
            <View style={styles.flex}>
              <Text variant="bodyStrong" style={styles.guideTitle}>
                {g.title}
              </Text>
              <Text variant="caption" color="stone">
                {g.minutes} phút đọc
              </Text>
            </View>
            <Icon name="right" size={16} color="stone" />
          </View>
        </Card>
      ))}
      {__DEV__ && (
        <DevActions
          onApprove={() => dev.mutate(STORE_STATUS.APPROVED)}
          onReject={() => dev.mutate(STORE_STATUS.REJECTED)}
        />
      )}
    </Screen>
  );
}

/** B03 Rejected: only the sections that need fixing must be redone. */
export function RejectedScreen() {
  const app = useApplication().data;
  if (!app) return <LoadingView />;

  return (
    <Screen
      edges={["top"]}
      gap={12}
      footer={
        <BottomBar plain>
          <Button title="Sửa và gửi lại" icon="edit" onPress={() => router.push("/register?step=2")} />
        </BottomBar>
      }
    >
      <HeroIcon name="alert" size={88} tone="danger" style={styles.pendingHero} />
      <Text style={styles.title}>Hồ sơ cần bổ sung</Text>
      <Text style={styles.body}>Chỉ cần sửa mục bên dưới, các câu trả lời khác được giữ nguyên.</Text>
      <Card variant="danger" gap={8} style={styles.reason}>
        <View style={styles.inlineSmall}>
          <Icon name="msg" size={16} color="terracotta" />
          <Text style={styles.reasonLabel}>LÝ DO TỪ RELIFE</Text>
        </View>
        <Text style={styles.reasonText}>
          “{app.rejectReason}”
        </Text>
        {app.reviewedAt && (
          <Text variant="caption" color="stone">
            {app.reviewedBy} · {formatDayMonth(app.reviewedAt)} · {formatTime(app.reviewedAt)}
          </Text>
        )}
      </Card>
      <Card gap={12}>
        {app.sections.map((s) => (
          <Fragment key={s.key}>
            <View style={styles.sectionRow}>
              <View style={[styles.sectionIcon, { backgroundColor: s.needsFix ? colors.terracottaSoft : colors.successSoft }]}>
                <Icon name={s.needsFix ? "alert" : "check"} size={15} color={s.needsFix ? "terracotta" : "success"} />
              </View>
              <Text style={[styles.flex, s.needsFix ? styles.sectionFix : styles.sectionOk]}>{s.label}</Text>
              {s.needsFix ? (
                <Pressable accessibilityRole="button" onPress={() => router.push("/register?step=2")} hitSlop={8}>
                  <Text variant="labelStrong" color="terracotta" style={styles.fix}>
                    Sửa
                  </Text>
                </Pressable>
              ) : (
                <Text variant="caption" color="stone">
                  Giữ nguyên
                </Text>
              )}
            </View>
          </Fragment>
        ))}
      </Card>
    </Screen>
  );
}

/** Dev-only shortcuts while there is no admin app (Relife Admin is sprint S6). */
function DevActions({ onApprove, onReject }: { onApprove: () => void; onReject: () => void }) {
  return (
    <Card variant="soft" gap={8}>
      <Text variant="captionStrong" color="stone">
        CHỈ CÓ TRONG BẢN DEV · GIẢ LẬP KẾT QUẢ DUYỆT
      </Text>
      <View style={styles.devRow}>
        <Button title="Duyệt" size="sm" variant="secondary" fullWidth={false} onPress={onApprove} />
        <Button title="Từ chối" size="sm" variant="secondary" fullWidth={false} onPress={onReject} />
        <Button title="Đăng xuất" size="sm" variant="ghost" fullWidth={false} onPress={() => sessionStore.signOut()} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  pendingHero: { marginTop: 30 },
  title: { fontFamily: fontFamily.heading, fontSize: 26, lineHeight: 34, color: colors.ink, textAlign: "center", marginTop: 4 },
  body: { fontFamily: fontFamily.body, fontSize: 15, lineHeight: 22, color: colors.stone, textAlign: "center", paddingHorizontal: 12 },
  steps: { marginTop: 4, marginBottom: 2 },
  guideTitle: { fontSize: 14, lineHeight: 18 },
  reason: { marginTop: 10 },
  inlineSmall: { flexDirection: "row", alignItems: "center", gap: 6 },
  reasonLabel: { fontFamily: fontFamily.bodySemiBold, fontSize: 11, letterSpacing: 1.32, color: colors.terracotta },
  reasonText: { fontFamily: fontFamily.body, fontSize: 15, lineHeight: 22, color: colors.ink },
  sectionRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  sectionIcon: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  sectionFix: { fontFamily: fontFamily.bodySemiBold, fontSize: 14, color: colors.ink },
  sectionOk: { fontFamily: fontFamily.body, fontSize: 14, color: colors.ink },
  fix: { fontSize: 14 },
  hero: { marginTop: spacing.xl },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  flex: { flex: 1, gap: 2 },
  devRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
});

/** Picks B01, B02 or B03 from the application status. */
export function ApplicationStatusScreen() {
  const status = useApplication().data?.status;
  if (!status) return <LoadingView />;
  if (status === STORE_STATUS.PENDING) return <PendingApprovalScreen />;
  if (status === STORE_STATUS.REJECTED) return <RejectedScreen />;
  return <RegistrationScreen />;
}
