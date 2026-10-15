import { formatVndShort } from "@relife/shared";
import { Avatar, Card, Divider, Icon, IconButton, ListRow, LoadingView, Text, colors, fontFamily, radius } from "@relife/ui";
import { router } from "expo-router";
import { Pressable, Share, StyleSheet, View } from "react-native";

import { Screen } from "@/components/Screen";
import { sessionStore } from "@/features/auth";

import { useProfile } from "../hooks/useProfile";

/** A27 Account. */
export function AccountScreen() {
  const query = useProfile();
  if (!query.data) return <LoadingView />;
  const p = query.data;
  const kg = String(p.impact.foodKg).replace(".", ",");

  return (
    <Screen withTabBar gap={10}>
      <View style={styles.top}>
        <Avatar name={p.name} size={64} />
        <View style={styles.flex}>
          <Text style={styles.name}>{p.name}</Text>
          <Text variant="small" color="stone">
            +84 {p.phone.replace(/(\d{3})(?=\d)/g, "$1 ")}
          </Text>
        </View>
        <IconButton name="settings" size={40} iconSize={18} onPress={() => router.push("/account/edit")} accessibilityLabel="Sửa thông tin" />
      </View>

      <Card variant="dark" gap={10} style={styles.impact}>
        <View style={styles.overlineRow}>
          <Icon name="heart" size={16} color="champagne" />
          <Text style={styles.overline}>MY IMPACT</Text>
        </View>
        <View style={styles.stats}>
          <Stat value={String(p.impact.bagsSaved)} label="túi bánh đã cứu" />
          <Stat value={`${kg} kg`} label="thực phẩm giữ lại" />
          <Stat value={formatVndShort(p.impact.moneySaved)} label="đã tiết kiệm" />
        </View>
        <Pressable
          accessibilityRole="button"
          style={styles.share}
          onPress={() => Share.share({ message: `Mình đã cứu ${p.impact.bagsSaved} túi bánh (${kg} kg thực phẩm) cùng Relife!` })}
        >
          <Text style={styles.shareText}>Chia sẻ thành tích của bạn</Text>
          <Icon name="share" size={16} color="champagne" />
        </Pressable>
      </Card>

      <Card gap={12}>
        <ListRow icon="user" iconVariant="soft" title="Thông tin cá nhân" onPress={() => router.push("/account/edit")} />
        <Divider />
        <ListRow icon="bell" iconVariant="soft" title="Thông báo" onPress={() => router.push("/notifications")} />
        <Divider />
        <ListRow icon="help" iconVariant="soft" title="Trợ giúp và câu hỏi" onPress={() => router.push("/account/help")} />
        <Divider />
        <ListRow icon="file" iconVariant="soft" title="Điều khoản và quyền riêng tư" onPress={() => router.push("/account/terms")} />
      </Card>

      <View style={styles.actions}>
        <Pressable accessibilityRole="button" style={styles.action} onPress={() => sessionStore.signOut()}>
          <Text variant="labelStrong" color="ink">
            Đăng xuất
          </Text>
        </Pressable>
        <Pressable accessibilityRole="button" style={[styles.action, styles.delete]} onPress={() => router.push("/account/delete")}>
          <Text variant="labelStrong" color="terracotta">
            Xoá tài khoản
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text variant="caption" color="sageLight">
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 14 },
  flex: { flex: 1, gap: 3 },
  name: { fontFamily: fontFamily.heading, fontSize: 22, lineHeight: 29, color: colors.ink },
  impact: { borderRadius: 24 },
  overlineRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  overline: { fontFamily: fontFamily.bodySemiBold, fontSize: 11, letterSpacing: 1.54, color: colors.champagne },
  stats: { flexDirection: "row", gap: 22 },
  stat: { gap: 0 },
  statValue: { fontFamily: fontFamily.number, fontSize: 31, lineHeight: 38, letterSpacing: -0.62, color: colors.cream },
  shareText: { fontFamily: fontFamily.bodySemiBold, fontSize: 13, color: colors.champagne },
  share: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  actions: { flexDirection: "row", gap: 13, marginTop: 10 },
  delete: { backgroundColor: colors.terracottaSoft },
  action: {
    flex: 1,
    height: 44,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
});
