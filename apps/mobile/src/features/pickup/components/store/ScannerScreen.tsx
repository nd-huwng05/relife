import { Button, IconButton, LoadingView, StateView, Text, colors, spacing } from "@relife/ui";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { errorMessage } from "@/lib/queryClient";

import { useRedeemPickup } from "../../hooks/usePickup";
import { openScanResult } from "./scanResult";

const FRAME = 260;

/** B12 Scan Code. The server checks every code; the app never decides validity on its own. */
export function ScannerScreen() {
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const redeem = useRedeemPickup();
  const busy = useRef(false);
  const [active, setActive] = useState(true);

  // Pause scanning while a result screen is on top, resume when coming back.
  useFocusEffect(
    useCallback(() => {
      busy.current = false;
      setActive(true);
      return () => setActive(false);
    }, []),
  );

  const onScan = (data: string) => {
    if (busy.current) return;
    busy.current = true;
    redeem.mutate(
      { code: data, source: "scan" },
      {
        onSuccess: openScanResult,
        onError: () => {
          busy.current = false;
        },
      },
    );
  };

  if (!permission) return <LoadingView />;
  if (!permission.granted) {
    return (
      <View style={[styles.permission, { paddingTop: insets.top + spacing.xl }]}>
        <StateView
          icon="camera"
          title="Cho phép dùng camera"
          message="Relife cần camera để quét mã nhận bánh của khách."
          actionLabel={permission.canAskAgain ? "Cho phép" : undefined}
          onAction={requestPermission}
        />
        <Button title="Nhập mã bằng tay" variant="secondary" onPress={() => router.push("/scanner/manual")} />
        <Button title="Đóng" variant="ghost" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {active && (
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={(r) => onScan(r.data)}
        />
      )}
      <View style={styles.dim} pointerEvents="none" />
      <View style={[styles.top, { top: insets.top + spacing.xs }]}>
        <IconButton name="x" variant="scrim" iconSize={20} style={styles.glass} onPress={() => router.back()} accessibilityLabel="Đóng" />
        <Text variant="headline" color="white">
          Quét mã nhận bánh
        </Text>
        <View style={styles.side} />
      </View>

      <View style={styles.center} pointerEvents="none">
        <View style={styles.frame}>
          <View style={[styles.corner, styles.tl]} />
          <View style={[styles.corner, styles.tr]} />
          <View style={[styles.corner, styles.bl]} />
          <View style={[styles.corner, styles.br]} />
          <View style={styles.line} />
          {redeem.isPending && <ActivityIndicator color={colors.white} size="large" />}
        </View>
        <Text variant="button" color="white" align="center" style={styles.hint}>
          Đưa mã QR của khách vào khung
        </Text>
        <Text variant="small" color="sageLight" align="center">
          Relife kiểm tra mã với máy chủ, xong sẽ tự quay lại.
        </Text>
        {redeem.isError && (
          <Text variant="caption" color="white" align="center">
            {errorMessage(redeem.error)}
          </Text>
        )}
      </View>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + spacing.md }]}>
        <IconButton name="info" size={48} iconSize={22} variant="scrim" style={[styles.info, styles.glass]} onPress={() => router.push("/training")} accessibilityLabel="Hướng dẫn quét mã" />
        <Button title="Nhập mã bằng tay" icon="edit" variant="secondary" style={styles.manual} labelStyle={styles.manualLabel} onPress={() => router.push("/scanner/manual")} />
      </View>
    </View>
  );
}

const corner = { position: "absolute" as const, width: 40, height: 40, borderColor: colors.champagne };

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.deepForest },
  dim: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0, backgroundColor: "rgba(14, 21, 18, 0.55)" },
  permission: { flex: 1, backgroundColor: colors.linen, paddingHorizontal: spacing.lg, gap: spacing.sm },
  top: { position: "absolute", left: 16, right: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  side: { width: 44 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: spacing.xl, gap: 8 },
  frame: { width: FRAME, height: FRAME, alignItems: "center", justifyContent: "center", marginBottom: spacing.lg },
  corner,
  tl: { left: 0, top: 0, borderLeftWidth: 5, borderTopWidth: 5, borderTopLeftRadius: 3 },
  tr: { right: 0, top: 0, borderRightWidth: 5, borderTopWidth: 5, borderTopRightRadius: 3 },
  bl: { left: 0, bottom: 0, borderLeftWidth: 5, borderBottomWidth: 5, borderBottomLeftRadius: 3 },
  br: { right: 0, bottom: 0, borderRightWidth: 5, borderBottomWidth: 5, borderBottomRightRadius: 3 },
  line: {
    position: "absolute",
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: "rgba(201, 169, 110, 0.9)",
    shadowColor: colors.champagne,
    shadowOpacity: 0.8,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  glass: { backgroundColor: "rgba(255, 255, 255, 0.15)" },
  manual: { borderWidth: 0 },
  manualLabel: { color: colors.deepForest },
  hint: { marginTop: spacing.xs },
  bottom: { paddingHorizontal: spacing.lg, gap: spacing.md },
  info: { alignSelf: "flex-end" },
});
