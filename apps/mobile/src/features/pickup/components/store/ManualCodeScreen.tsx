import { Button, CodeInput, Icon, Text, colors, fontFamily } from "@relife/ui";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ScreenHeader } from "@/components/ScreenHeader";
import { errorMessage } from "@/lib/queryClient";

import { useRedeemPickup } from "../../hooks/usePickup";
import { openScanResult } from "./scanResult";

/** B15 Manual Code Entry. Same server check as scanning, with a limit against guessing. */
export function ManualCodeScreen() {
  const [code, setCode] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(4);
  const redeem = useRedeemPickup();

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <SafeAreaView edges={["top", "bottom"]} style={styles.flex}>
        <ScreenHeader title="Nhập mã bằng tay" />
        <View style={styles.content}>
          <Text style={styles.title}>
            Nhập <Text style={styles.titleNumber}>6</Text> ký tự khách đọc cho bạn
          </Text>
          <Text style={styles.body}>Không phân biệt chữ hoa, chữ thường. Máy chủ vẫn kiểm tra như khi quét.</Text>
          <View style={styles.boxes}>
            <CodeInput value={code} onChange={setCode} kind="text" error={redeem.isError} accessibilityLabel="Mã nhận bánh" />
          </View>
          <View style={styles.note}>
            <Icon name="info" size={16} color="stone" />
            <Text style={styles.noteText}>Còn {attemptsLeft} lần thử trong 10 phút để chống dò mã.</Text>
          </View>
          {redeem.isError && (
            <Text variant="caption" color="terracotta">
              {errorMessage(redeem.error)}
            </Text>
          )}
          <Button
            title="Kiểm tra mã"
            disabled={code.length < 6}
            loading={redeem.isPending}
            style={styles.cta}
            onPress={() =>
              redeem.mutate(
                { code, source: "manual" },
                {
                  onSuccess: (res) => {
                    if (!res.ok && res.attemptsLeft !== undefined) setAttemptsLeft(res.attemptsLeft);
                    setCode("");
                    openScanResult(res);
                  },
                },
              )
            }
          />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.linen },
  flex: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 10 },
  title: { fontFamily: fontFamily.heading, fontSize: 24, lineHeight: 30, color: colors.ink },
  titleNumber: { fontFamily: fontFamily.number, fontSize: 22 },
  body: { fontFamily: fontFamily.body, fontSize: 14, lineHeight: 20, color: colors.stone, marginTop: 8 },
  boxes: { marginTop: 26 },
  note: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 20 },
  noteText: { flex: 1, fontFamily: fontFamily.body, fontSize: 13, color: colors.stone },
  cta: { marginTop: 36 },
});
