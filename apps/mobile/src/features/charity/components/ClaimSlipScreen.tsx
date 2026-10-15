import { formatWindow } from "@relife/shared";
import { Button, Card, KeyValueRow, LoadingView, StateView, StatusBadge, Text, colors, fontFamily, radius, shadows } from "@relife/ui";
import { Share, StyleSheet, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

import { BottomBar } from "@/components/BottomBar";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { errorMessage } from "@/lib/queryClient";

import { useClaim } from "../hooks/useCharity";

/** C05 Claim Slip: same code format and store scanner as customer orders. */
export function ClaimSlipScreen({ claimId }: { claimId: string }) {
  const query = useClaim(claimId);
  if (query.isPending) return <LoadingView />;
  if (query.isError) return <StateView icon="alert" title="Không mở được phiếu" message={errorMessage(query.error)} />;
  const c = query.data;
  const code = `${c.code.slice(0, 3)}  ${c.code.slice(3)}`;

  return (
    <Screen
      gap={12}
      header={<ScreenHeader title="Phiếu nhận" leading="close" />}
      footer={
        <BottomBar plain>
          <Button
            title="Chia sẻ cho tình nguyện viên"
            icon="share"
            variant="white"
            onPress={() => Share.share({ message: `Phiếu nhận Relife: ${c.units} phần tại ${c.storeName}, ${formatWindow(c.pickupStart, c.pickupEnd)}. Mã ${code}` })}
          />
        </BottomBar>
      }
    >
      <StatusBadge label="Sẵn sàng nhận · miễn phí" tone="success" style={styles.center} />
      <View style={styles.qr}>
        <QRCode value={`relife:pickup:${c.code}`} size={220} color={colors.deepForest} backgroundColor={colors.white} />
      </View>
      <Text style={styles.code} selectable>
        {code}
      </Text>
      <Text variant="caption" color="stone" align="center">
        Cùng định dạng mã và máy quét như đơn của khách
      </Text>
      <Card gap={10} style={styles.details}>
        <KeyValueRow label="Nguồn" value={c.storeName} />
        <View style={styles.between}>
          <Text variant="body" color="stone" style={styles.t14}>
            Số phần
          </Text>
          <Text variant="bodyStrong" style={styles.t14}>
            {c.units} phần
          </Text>
        </View>
        <KeyValueRow label="Khung nhận" value={formatWindow(c.pickupStart, c.pickupEnd)} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { alignSelf: "center" },
  code: { fontFamily: fontFamily.number, fontSize: 35, lineHeight: 42, letterSpacing: 4.2, color: colors.deepForest, textAlign: "center", marginTop: 4 },
  details: { marginTop: 4 },
  between: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  t14: { fontSize: 14, lineHeight: 18 },
  qr: { alignSelf: "center", padding: 18, borderRadius: radius.sheet, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, ...shadows.card },
});
