import { PAYOUT_STATUS, formatDate, formatDayMonth, formatVnd, formatWeekday } from "@relife/shared";
import { Card, Divider, Icon, LoadingView, Overline, StatusBadge, Text, colors, fontFamily } from "@relife/ui";
import { Fragment } from "react";
import { StyleSheet, View } from "react-native";

import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";

import { usePayouts } from "../hooks/useStoreAdmin";

/** B18 Reconciliation And Payout. */
export function PayoutsScreen() {
  const query = usePayouts();
  if (!query.data) return <LoadingView />;
  const p = query.data;

  return (
    <Screen gap={12} header={<ScreenHeader title="Đối soát và chi trả" />}>
      <Card variant="dark" gap={6} style={styles.holding}>
        <Text style={styles.overline}>RELIFE ĐANG GIỮ CHO BẠN</Text>
        <Text style={styles.amount}>{formatVnd(p.holding)}</Text>
        <View style={styles.inline}>
          <Icon name="calendar" size={16} color="champagne" />
          <Text variant="small" color="mist" numberOfLines={1} style={styles.flexText}>
            Chuyển vào {formatWeekday(p.nextPayoutAt).toLowerCase()} {formatDayMonth(p.nextPayoutAt)} · {p.bankLabel}
          </Text>
        </View>
      </Card>
      <View style={styles.note}>
        <Icon name="info" size={14} color="stone" />
        <Text variant="caption" color="stone">
          Con số này trùng khớp với báo cáo Relife Admin.
        </Text>
      </View>

      <Overline>LỊCH SỬ CHI TRẢ</Overline>
      <Card gap={12}>
        {p.history.map((h, i) => (
          <Fragment key={h.id}>
            {i > 0 && <Divider />}
            <View style={styles.between}>
              <View style={styles.flex}>
                <Text variant="bodyStrong" style={styles.t14}>
                  {h.paidAt ? formatDate(h.paidAt) : "Đang xử lý"}
                </Text>
                <Text variant="caption" color="stone">
                  Kỳ {formatDayMonth(h.periodStart)} – {formatDayMonth(h.periodEnd)} · {h.orderCount} đơn
                </Text>
              </View>
              <View style={styles.right}>
                <Text style={styles.money14}>{formatVnd(h.amount)}</Text>
                <StatusBadge label={h.status === PAYOUT_STATUS.PAID ? "Đã chuyển" : "Đang xử lý"} tone={h.status === PAYOUT_STATUS.PAID ? "success" : "warning"} />
              </View>
            </View>
          </Fragment>
        ))}
      </Card>

      <Overline>CHI TIẾT KỲ NÀY</Overline>
      <Card gap={12}>
        {p.lines.map((l, i) => (
          <Fragment key={l.orderCode + i}>
            {i > 0 && <Divider />}
            <View style={styles.between}>
              <View style={styles.flex}>
                <Text variant="labelStrong">{l.orderCode}</Text>
                <Text style={styles.small11}>
                  {formatDayMonth(l.date)} · {l.description}
                </Text>
              </View>
              <Text variant="labelStrong" color="ink">
                {l.amount > 0 ? `+ ${formatVnd(l.amount)}` : `− ${formatVnd(Math.abs(l.amount))}`}
              </Text>
            </View>
          </Fragment>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  inline: { flexDirection: "row", alignItems: "center", gap: 8 },
  holding: { borderRadius: 24 },
  overline: { fontFamily: fontFamily.bodySemiBold, fontSize: 11, letterSpacing: 1.32, color: colors.champagne },
  amount: { fontFamily: fontFamily.number, fontSize: 29, lineHeight: 36, letterSpacing: -0.58, color: colors.cream },
  flexText: { flexShrink: 1 },
  note: { flexDirection: "row", alignItems: "center", gap: 6 },
  t14: { fontSize: 14, lineHeight: 18 },
  money14: { fontFamily: fontFamily.number, fontSize: 14, color: colors.ink },
  small11: { fontFamily: fontFamily.body, fontSize: 11, color: colors.stone },
  between: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  flex: { flex: 1, gap: 2 },
  right: { alignItems: "flex-end", gap: 4 },
});
