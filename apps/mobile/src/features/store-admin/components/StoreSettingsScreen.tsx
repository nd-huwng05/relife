import { Card, Divider, ListRow, LoadingView, Overline, Text, Toggle, colors, fontFamily } from "@relife/ui";
import { router } from "expo-router";
import { StyleSheet } from "react-native";

import { Screen } from "@/components/Screen";
import { sessionStore } from "@/features/auth";

import { useSetClosed, useStoreSettings } from "../hooks/useStoreAdmin";

/** B20 Store Settings. */
export function StoreSettingsScreen() {
  const query = useStoreSettings();
  const setClosed = useSetClosed();
  if (!query.data) return <LoadingView />;
  const s = query.data;

  return (
    <Screen withTabBar gap={8}>
      <Text style={styles.title}>Cửa hàng</Text>
      <Card padding={14}>
        <ListRow
          title="Tạm đóng cửa"
          subtitle="Ẩn tiệm khỏi Khám phá, giữ đơn đã đặt"
          right={<Toggle value={s.store.temporarilyClosed} onValueChange={(v) => setClosed.mutate(v)} accessibilityLabel="Tạm đóng cửa" />}
        />
      </Card>

      <Overline>THÔNG TIN TIỆM</Overline>
      <Card gap={12}>
        <ListRow icon="clock" title="Giờ mở cửa" value={s.hoursLabel} onPress={() => router.push("/register?step=3&mode=edit")} />
        <Divider />
        <ListRow icon="nav" title="Địa chỉ và ghim" subtitle="Đổi địa chỉ cần Relife duyệt lại" onPress={() => router.push("/register?step=4&mode=edit")} />
        <Divider />
        <ListRow icon="file" title="Giới thiệu tiệm" onPress={() => router.push("/register?step=1&mode=edit")} />
      </Card>

      <Overline>VẬN HÀNH</Overline>
      <Card gap={12}>
        <ListRow icon="dollar" title="Tài khoản nhận tiền" value={s.payoutLabel} onPress={() => router.push("/payouts/account")} />
        <Divider />
        <ListRow icon="users" title="Nhân viên" value={`${s.staffCount} người`} onPress={() => router.push("/staff")} />
        <Divider />
        <ListRow icon="bell" title="Thông báo" onPress={() => router.push("/settings/notifications")} />
        <Divider />
        <ListRow icon="star" title="Đánh giá" value={`${s.store.rating.toFixed(1)}`} onPress={() => router.push("/reviews")} />
        <Divider />
        <ListRow icon="help" title="Hướng dẫn nhanh" onPress={() => router.push("/training")} />
      </Card>

      <Card padding={15}>
        <ListRow icon="logout" title="Đăng xuất" onPress={() => sessionStore.signOut()} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fontFamily.heading, fontSize: 30, lineHeight: 40, color: colors.ink, marginTop: 2 },
});
