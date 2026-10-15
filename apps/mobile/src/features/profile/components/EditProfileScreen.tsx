import { profileUpdateSchema } from "@relife/shared";
import { Avatar, Button, Chip, IconButton, LoadingView, Text, TextField, colors, spacing } from "@relife/ui";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { BottomBar } from "@/components/BottomBar";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { errorMessage } from "@/lib/queryClient";

import { useProfile, useUpdateProfile } from "../hooks/useProfile";

/** A28 Edit Profile. */
export function EditProfileScreen() {
  const query = useProfile();
  if (!query.data) return <LoadingView />;
  return <EditProfileForm name={query.data.name} email={query.data.email} phone={query.data.phone} verified={query.data.phoneVerified} />;
}

function EditProfileForm(props: { name: string; email: string | null; phone: string; verified: boolean }) {
  const [name, setName] = useState(props.name);
  const [email, setEmail] = useState(props.email ?? "");
  const save = useUpdateProfile();
  const input = { name, email: email.trim() ? email.trim() : null };
  const parsed = profileUpdateSchema.safeParse(input);
  const issue = (key: string) => (parsed.success ? null : parsed.error.issues.find((i) => i.path[0] === key)?.message ?? null);

  return (
    <Screen
      gap={18}
      header={<ScreenHeader title="Thông tin cá nhân" />}
      footer={
        <BottomBar plain>
          {save.isError && (
            <Text variant="caption" color="terracotta" align="center">
              {errorMessage(save.error)}
            </Text>
          )}
          <Button title="Lưu thay đổi" disabled={!parsed.success} loading={save.isPending} onPress={() => save.mutate(input, { onSuccess: () => router.back() })} />
        </BottomBar>
      }
    >
      <View style={styles.avatar}>
        <View>
          <Avatar name={name || "?"} size={104} />
          {/* TODO(S8): pick and upload an avatar. */}
          <IconButton name="camera" size={36} iconSize={16} variant="solid" style={styles.camera} accessibilityLabel="Ảnh đại diện" />
        </View>
        <Text variant="labelStrong" color="forest" style={styles.change}>
          Đổi ảnh đại diện
        </Text>
      </View>
      <TextField label="Tên hiển thị" value={name} onChangeText={setName} error={issue("name")} autoCapitalize="words" />
      <TextField
        label="Số điện thoại"
        labelAccessory={props.verified ? <Chip label="Đã xác minh" tone="success" size="sm" /> : undefined}
        value={`+84 ${props.phone.replace(/(\d{3})(?=\d)/g, "$1 ")}`}
        editable={false}
        helper="Đổi số sẽ cần xác minh lại bằng mã OTP."
      />
      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        helper="Liên kết với tài khoản Google"
        error={issue("email")}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  avatar: { alignItems: "center", gap: spacing.sm, marginTop: 2, marginBottom: 6 },
  camera: { position: "absolute", right: -4, bottom: -2, borderWidth: 3, borderColor: colors.linen },
  change: { fontSize: 14, lineHeight: 18 },
});
