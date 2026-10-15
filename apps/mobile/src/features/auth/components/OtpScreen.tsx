import { formatCountdown } from "@relife/shared";
import { Button, CodeInput, Icon, Text, colors, fontFamily } from "@relife/ui";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ScreenHeader } from "@/components/ScreenHeader";
import { errorMessage } from "@/lib/queryClient";

import { useSendOtp, useVerifyOtp } from "../hooks/useAuthActions";
import { useSessionState } from "../store";

const RESEND_SECONDS = 42;

/** A06 OTP Entry with the system number pad (SMS autofill works). Demo accounts use OTP 123456. */
export function OtpScreen() {
  const { pendingPhone } = useSessionState();
  const [code, setCode] = useState("");
  const [wait, setWait] = useState(RESEND_SECONDS);
  const verify = useVerifyOtp();
  const resend = useSendOtp();

  useEffect(() => {
    if (wait <= 0) return;
    const id = setTimeout(() => setWait(wait - 1), 1000);
    return () => clearTimeout(id);
  }, [wait]);

  const display = pendingPhone ? `+84 ${pendingPhone.replace(/(\d{3})(?=\d)/g, "$1 ")}` : "số của bạn";
  // TODO(S1): with real SMS, also listen for the iOS one-time-code autofill.
  const submit = () =>
    verify.mutate(
      { phone: pendingPhone, code },
      { onSuccess: (res) => res.isNewUser && router.replace("/profile-setup") },
    );

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <SafeAreaView edges={["top", "bottom"]} style={styles.flex}>
        <ScreenHeader />
        <View style={styles.content}>
          <Text style={styles.title}>
            Nhập mã <Text style={styles.titleNumber}>6</Text> số
          </Text>
          <View style={styles.sentRow}>
            <Text style={styles.sent}>Đã gửi tới {display}</Text>
            <Pressable accessibilityRole="button" onPress={() => router.back()} hitSlop={8}>
              <Text style={styles.change}>Đổi số</Text>
            </Pressable>
          </View>
          <View style={styles.boxes}>
            <CodeInput value={code} onChange={setCode} error={verify.isError} accessibilityLabel="Mã xác nhận" />
          </View>
          {verify.isError && <Text style={styles.error}>{errorMessage(verify.error)}</Text>}
          <View style={styles.resend}>
            <Icon name="clock" size={16} color="stone" />
            {wait > 0 ? (
              <Text style={styles.resendText}>
                Gửi lại mã sau <Text style={styles.resendTime}>{formatCountdown(wait)}</Text>
              </Text>
            ) : (
              <Pressable
                accessibilityRole="button"
                onPress={() => pendingPhone && resend.mutate(pendingPhone, { onSuccess: () => setWait(RESEND_SECONDS) })}
              >
                <Text style={styles.resendNow}>Gửi lại mã</Text>
              </Pressable>
            )}
          </View>
          <View style={styles.note}>
            <Icon name="info" size={18} color="amber" />
            <Text style={styles.noteText}>SMS đôi khi đến chậm hơn 30 giây. Mã sẽ tự điền khi tin nhắn tới.</Text>
          </View>
          <View style={styles.flex} />
          <Button title="Xác nhận" disabled={code.length < 6} loading={verify.isPending} onPress={submit} />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.linen },
  flex: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, paddingBottom: 16 },
  title: { fontFamily: fontFamily.heading, fontSize: 30, lineHeight: 40, color: colors.ink, marginTop: 12 },
  titleNumber: { fontFamily: fontFamily.number, fontSize: 28 },
  sentRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 },
  sent: { fontFamily: fontFamily.body, fontSize: 15, color: colors.stone },
  change: { fontFamily: fontFamily.bodySemiBold, fontSize: 15, color: colors.forest },
  boxes: { marginTop: 30 },
  error: { fontFamily: fontFamily.body, fontSize: 12, color: colors.terracotta, marginTop: 8 },
  resend: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 24 },
  resendText: { fontFamily: fontFamily.body, fontSize: 14, color: colors.stone },
  resendTime: { fontFamily: fontFamily.bodySemiBold, color: colors.ink },
  resendNow: { fontFamily: fontFamily.bodySemiBold, fontSize: 14, color: colors.forest },
  note: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 23,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "rgba(239, 227, 203, 0.6)",
  },
  noteText: { flex: 1, fontFamily: fontFamily.body, fontSize: 13, lineHeight: 19, color: colors.ink },
});
