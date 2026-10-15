import { phoneSchema } from "@relife/shared";
import { Button, Text, TextField, colors, fontFamily } from "@relife/ui";
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ScreenHeader } from "@/components/ScreenHeader";
import { errorMessage } from "@/lib/queryClient";

import { useSendOtp } from "../hooks/useAuthActions";

/** Groups digits as "912 345 678". */
function formatLocal(digits: string) {
  return digits.replace(/(\d{3})(?=\d)/g, "$1 ");
}

/** A05 Phone Number Entry, typed with the system number pad. */
export function PhoneEntryScreen() {
  const [phone, setPhone] = useState("");
  const send = useSendOtp();
  const valid = phoneSchema.safeParse(phone).success;

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <SafeAreaView edges={["top", "bottom"]} style={styles.flex}>
        <ScreenHeader />
        <View style={styles.content}>
          <Text style={styles.title}>{"Số điện thoại\ncủa bạn"}</Text>
          <Text style={styles.body}>Relife gửi mã xác nhận qua SMS. Số này dùng cho mã nhận bánh và thông báo đơn hàng.</Text>
          <View style={styles.field}>
            <TextField
              prefix="+84"
              value={formatLocal(phone)}
              onChangeText={(t) => setPhone(t.replace(/\D/g, "").slice(0, 10))}
              placeholder="912 345 678"
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              autoComplete="tel"
              autoFocus
              maxLength={13}
              helper="Hiện Relife chỉ hỗ trợ số điện thoại Việt Nam."
              error={send.isError ? errorMessage(send.error) : null}
              accessibilityLabel="Số điện thoại"
            />
          </View>
          <View style={styles.flex} />
          <Button
            title="Gửi mã xác nhận"
            disabled={!valid}
            loading={send.isPending}
            onPress={() => send.mutate(phone, { onSuccess: () => router.push("/otp") })}
          />
          <Text style={styles.note}>Mỗi SMS có phí, nút sẽ khoá trong lúc đang gửi.</Text>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.linen },
  flex: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, paddingBottom: 12 },
  title: { fontFamily: fontFamily.heading, fontSize: 30, lineHeight: 38, color: colors.ink, marginTop: 12 },
  body: { fontFamily: fontFamily.body, fontSize: 15, lineHeight: 22, color: colors.stone, marginTop: 8, maxWidth: 340 },
  field: { marginTop: 22 },
  note: { fontFamily: fontFamily.body, fontSize: 12, color: colors.stone, textAlign: "center", marginTop: 10 },
});
