import { Button, Card, HeroIcon, Icon, Text, TextField, colors, fontFamily, type IconName } from "@relife/ui";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { BottomBar } from "@/components/BottomBar";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { sessionStore } from "@/features/auth";
import { errorMessage } from "@/lib/queryClient";

import { useDeleteAccount, useUpcomingCount } from "../hooks/useProfile";

const CONFIRM_WORD = "XOÁ";

const EFFECTS: { icon: IconName; text: string }[] = [
  { icon: "x", text: "Xoá tên, số điện thoại, ảnh và danh sách theo dõi" },
  { icon: "x", text: "Huỷ các đơn chưa nhận theo quy định hoàn tiền" },
  { icon: "check", text: "Giữ hoá đơn đã thanh toán trong 5 năm theo luật kế toán" },
];

/** A31 Delete Account. */
export function DeleteAccountScreen() {
  const [confirm, setConfirm] = useState("");
  const upcoming = useUpcomingCount();
  const remove = useDeleteAccount();
  const blocked = (upcoming.data ?? 0) > 0;
  const ready = confirm.trim().toUpperCase() === CONFIRM_WORD && !blocked;

  return (
    <Screen
      gap={14}
      header={<ScreenHeader title="Xoá tài khoản" />}
      footer={
        <BottomBar plain>
          {remove.isError && (
            <Text variant="caption" color="terracotta" align="center">
              {errorMessage(remove.error)}
            </Text>
          )}
          <Button
            title="Xoá tài khoản"
            variant="dangerSolid"
            disabled={!ready}
            loading={remove.isPending}
            onPress={() => remove.mutate(undefined, { onSuccess: () => sessionStore.signOut() })}
          />
        </BottomBar>
      }
    >
      <HeroIcon name="trash" size={84} tone="danger" style={styles.hero} />
      <View style={styles.heading}>
        <Text style={styles.title}>Xoá vĩnh viễn tài khoản?</Text>
        <Text style={styles.subtitle}>Hành động này không thể hoàn tác sau 30 ngày.</Text>
      </View>
      <Card gap={12}>
        <Text style={styles.cardTitle}>Khi xoá, Relife sẽ</Text>
        {EFFECTS.map((e) => (
          <View key={e.text} style={styles.row}>
            <Icon name={e.icon} size={18} color={e.icon === "check" ? "success" : "terracotta"} />
            <Text style={[styles.flex, styles.effect]}>{e.text}</Text>
          </View>
        ))}
      </Card>
      {blocked && (
        <View style={styles.warning}>
          <Icon name="alert" size={18} color="amber" />
          <Text style={[styles.flex, styles.warningText]}>{`Bạn còn ${upcoming.data} đơn sắp tới. Hãy nhận bánh hoặc huỷ đơn trước.`}</Text>
        </View>
      )}
      <TextField label={`Nhập ${CONFIRM_WORD} để xác nhận`} value={confirm} onChangeText={setConfirm} autoCapitalize="characters" placeholder={CONFIRM_WORD} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  flex: { flex: 1 },
  hero: { marginTop: 2 },
  heading: { gap: 8, marginTop: 4, marginBottom: 2 },
  title: { fontFamily: fontFamily.heading, fontSize: 26, lineHeight: 34, color: colors.ink, textAlign: "center" },
  subtitle: { fontFamily: fontFamily.body, fontSize: 14, color: colors.stone, textAlign: "center" },
  cardTitle: { fontFamily: fontFamily.bodySemiBold, fontSize: 14, color: colors.ink },
  effect: { fontFamily: fontFamily.body, fontSize: 14, lineHeight: 20, color: colors.ink },
  warning: { flexDirection: "row", gap: 10, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 16, backgroundColor: colors.amberSoft },
  warningText: { fontFamily: fontFamily.body, fontSize: 13, lineHeight: 19, color: colors.ink },
});
