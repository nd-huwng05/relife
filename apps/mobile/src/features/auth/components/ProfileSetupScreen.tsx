import { USER_ROLE, profileSetupSchema, type UserRole } from "@relife/shared";
import { Button, Icon, Radio, Text, TextField, colors, fontFamily, type IconName } from "@relife/ui";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { errorMessage } from "@/lib/queryClient";

import { useCompleteProfile } from "../hooks/useAuthActions";

type SignupRole = Extract<UserRole, "customer" | "store" | "charity">;

const ROLES: { role: SignupRole; icon: IconName; title: string; body: string }[] = [
  { role: USER_ROLE.CUSTOMER, icon: "bag", title: "Mua bánh cuối ngày", body: "Tìm và đặt túi bánh giá tốt quanh bạn." },
  { role: USER_ROLE.STORE, icon: "package", title: "Tôi có tiệm bánh, F&B", body: "Đăng bánh dư và nhận khách mỗi tối." },
  { role: USER_ROLE.CHARITY, icon: "users", title: "Tổ chức từ thiện", body: "Nhận thực phẩm dư miễn phí cho bếp ăn, mái ấm." },
];

/** A07 First Time Profile: display name and role. "store" leads to store registration (B01), "charity" to the charity screens. */
export function ProfileSetupScreen() {
  const [name, setName] = useState("Hưng Nguyễn");
  const [role, setRole] = useState<SignupRole>(USER_ROLE.CUSTOMER);
  const save = useCompleteProfile();
  const parsed = profileSetupSchema.safeParse({ name, role });
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Chào mừng tới Relife</Text>
        <Text style={styles.sub}>Chỉ cần tên và vai trò là bạn có thể đặt bánh.</Text>

        <View style={styles.avatarRow}>
          <View>
            <View style={styles.avatar}>
              <Text style={styles.initial}>{initial}</Text>
            </View>
            {/* TODO(S8): pick an avatar with expo-image-picker and upload to Storage. */}
            <View style={styles.camera}>
              <Icon name="camera" size={15} color="cream" />
            </View>
          </View>
          <View style={styles.avatarText}>
            <Text style={styles.avatarTitle}>Ảnh đại diện</Text>
            <Text style={styles.avatarSub}>Không bắt buộc · Bỏ qua</Text>
          </View>
        </View>

        <View style={styles.field}>
          <TextField
            label="Tên hiển thị"
            value={name}
            onChangeText={setName}
            placeholder="Nhập tên của bạn"
            helper="Lấy từ tài khoản Google, bạn có thể sửa."
            error={name.length > 0 && !parsed.success ? parsed.error.issues[0]?.message : null}
            autoCapitalize="words"
          />
        </View>

        <Text style={styles.roleLabel}>Bạn dùng Relife để</Text>
        {ROLES.map((r) => {
          const selected = r.role === role;
          return (
            <Pressable
              key={r.role}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => setRole(r.role)}
              style={[styles.roleCard, selected ? styles.roleOn : styles.roleOff]}
            >
              <View style={[styles.roleIcon, { backgroundColor: selected ? colors.forest : colors.goldSoft }]}>
                <Icon name={r.icon} size={22} color={selected ? "cream" : "forest"} />
              </View>
              <View style={styles.roleText}>
                <Text style={styles.roleTitle}>{r.title}</Text>
                <Text style={styles.roleBody}>{r.body}</Text>
              </View>
              <Radio selected={selected} size={22} />
            </Pressable>
          );
        })}
        <View style={styles.info}>
          <Icon name="info" size={16} color="stone" />
          <Text style={styles.infoText}>Bạn có thể đổi vai trò sau trong Cài đặt.</Text>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        {save.isError && <Text style={styles.error}>{errorMessage(save.error)}</Text>}
        <Button title="Vào Relife" disabled={!parsed.success} loading={save.isPending} onPress={() => save.mutate({ name, role })} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.linen },
  scroll: { paddingHorizontal: 24, paddingBottom: 24 },
  title: { fontFamily: fontFamily.heading, fontSize: 28, lineHeight: 37, color: colors.ink, marginTop: 18 },
  sub: { fontFamily: fontFamily.body, fontSize: 15, color: colors.stone, marginTop: 5 },
  avatarRow: { flexDirection: "row", alignItems: "center", gap: 20, marginTop: 28 },
  avatar: { width: 92, height: 92, borderRadius: 46, backgroundColor: colors.goldSoft, alignItems: "center", justifyContent: "center" },
  initial: { fontFamily: fontFamily.heading, fontSize: 34, color: colors.forest },
  camera: {
    position: "absolute",
    left: 62,
    top: 60,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.forest,
    borderWidth: 3,
    borderColor: colors.linen,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { gap: 3 },
  avatarTitle: { fontFamily: fontFamily.bodySemiBold, fontSize: 15, color: colors.ink },
  avatarSub: { fontFamily: fontFamily.body, fontSize: 13, color: colors.stone },
  field: { marginTop: 24 },
  roleLabel: { fontFamily: fontFamily.bodySemiBold, fontSize: 15, color: colors.ink, marginTop: 19, marginBottom: 14 },
  roleCard: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16, borderRadius: 22, marginBottom: 8 },
  roleOn: { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.forest },
  roleOff: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line },
  roleIcon: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  roleText: { flex: 1, gap: 3 },
  roleTitle: { fontFamily: fontFamily.bodySemiBold, fontSize: 16, color: colors.ink },
  roleBody: { fontFamily: fontFamily.body, fontSize: 13, lineHeight: 18, color: colors.stone },
  info: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6 },
  infoText: { fontFamily: fontFamily.body, fontSize: 13, color: colors.stone },
  footer: { paddingHorizontal: 24, paddingBottom: 20, gap: 8 },
  error: { fontFamily: fontFamily.body, fontSize: 12, color: colors.terracotta, textAlign: "center" },
});
