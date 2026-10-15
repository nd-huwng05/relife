import { formatVnd, payoutAccountSchema, type PayoutAccount } from "@relife/shared";
import { Button, Card, Chip, Icon, LoadingView, SelectChip, Text, TextField, colors, fontFamily } from "@relife/ui";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { BottomBar } from "@/components/BottomBar";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { errorMessage } from "@/lib/queryClient";

import { payoutOptions } from "../api";
import { usePayoutAccount, useSavePayoutAccount } from "../hooks/useStoreAdmin";

const EXAMPLE_SALES = 1_000_000;

/** B19 Payout Details: bank account for weekly payouts. */
export function PayoutAccountScreen() {
  const query = usePayoutAccount();
  if (!query.data) return <LoadingView />;
  return <PayoutForm initial={query.data} />;
}

function PayoutForm({ initial }: { initial: PayoutAccount }) {
  const [bankName, setBank] = useState(initial.bankName);
  const [picking, setPicking] = useState(false);
  const [accountNumber, setAccount] = useState(initial.accountNumber);
  const [confirmAccountNumber, setConfirm] = useState(initial.accountNumber);
  const [holderName, setHolder] = useState(initial.holderName);
  const save = useSavePayoutAccount();
  const input = { bankName, accountNumber, confirmAccountNumber, holderName };
  const parsed = payoutAccountSchema.safeParse(input);
  const matches = accountNumber.length > 0 && accountNumber === confirmAccountNumber;
  const fee = Math.round((EXAMPLE_SALES * payoutOptions.commissionPercent) / 100);
  const group = (v: string) => v.replace(/(\d{4})(?=\d)/g, "$1 ");

  return (
    <Screen
      gap={14}
      header={<ScreenHeader title="Tài khoản nhận tiền" />}
      footer={
        <BottomBar plain>
          {save.isError && (
            <Text variant="caption" color="terracotta" align="center">
              {errorMessage(save.error)}
            </Text>
          )}
          <Button title="Lưu tài khoản" icon="lock" disabled={!parsed.success} loading={save.isPending} onPress={() => save.mutate(input, { onSuccess: () => router.back() })} />
        </BottomBar>
      }
    >
      <Pressable accessibilityRole="button" onPress={() => setPicking(!picking)}>
        <View pointerEvents="none">
          <TextField label="Ngân hàng" value={bankName} editable={false} right={<Icon name="down" size={18} color="stone" />} />
        </View>
      </Pressable>
      {picking && (
        <View style={styles.chips}>
          {payoutOptions.banks.map((b) => (
            <SelectChip key={b} label={b} selected={b === bankName} onPress={() => { setBank(b); setPicking(false); }} />
          ))}
        </View>
      )}
      <TextField label="Số tài khoản" value={group(accountNumber)} onChangeText={(t) => setAccount(t.replace(/\D/g, ""))} keyboardType="number-pad" />
      <TextField
        label="Nhập lại số tài khoản"
        value={group(confirmAccountNumber)}
        onChangeText={(t) => setConfirm(t.replace(/\D/g, ""))}
        keyboardType="number-pad"
        success={matches}
        right={matches ? <Icon name="checkc" size={18} color="success" /> : undefined}
        helper={matches ? "Hai số tài khoản khớp nhau" : undefined}
        error={confirmAccountNumber && !matches ? "Hai số tài khoản chưa khớp" : null}
      />
      <TextField
        label="Chủ tài khoản"
        value={holderName}
        onChangeText={(t) => setHolder(t.toUpperCase())}
        autoCapitalize="characters"
        right={<Chip label="Tự điền" tone="success" size="sm" />}
      />
      <Card variant="dark" gap={8}>
        <View style={styles.inline}>
          <Icon name="calendar" size={16} color="champagne" />
          <Text style={styles.overline}>CHU KỲ TRẢ TIỀN</Text>
        </View>
        <Text style={styles.cycle}>Mỗi thứ Hai, Relife chuyển doanh thu của tuần trước.</Text>
        <View style={styles.between}>
          <Text style={styles.kvLabel}>Bán được</Text>
          <Text style={styles.kvValue}>{formatVnd(EXAMPLE_SALES)}</Text>
        </View>
        <View style={styles.between}>
          <Text style={styles.kvLabel}>Phí Relife {payoutOptions.commissionPercent}%</Text>
          <Text style={styles.kvValue}>− {formatVnd(fee)}</Text>
        </View>
        <View style={styles.between}>
          <Text style={styles.netLabel}>Bạn nhận</Text>
          <Text style={styles.netValue}>{formatVnd(EXAMPLE_SALES - fee)}</Text>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  inline: { flexDirection: "row", alignItems: "center", gap: 6 },
  between: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  overline: { fontFamily: fontFamily.bodySemiBold, fontSize: 11, letterSpacing: 1.32, color: colors.champagne },
  cycle: { fontFamily: fontFamily.bodySemiBold, fontSize: 15, lineHeight: 21, color: colors.cream },
  kvLabel: { fontFamily: fontFamily.body, fontSize: 13, color: colors.sageLight },
  kvValue: { fontFamily: fontFamily.body, fontSize: 13, color: colors.cream },
  netLabel: { fontFamily: fontFamily.bodySemiBold, fontSize: 14, color: colors.champagne },
  netValue: { fontFamily: fontFamily.number, fontSize: 17, color: colors.champagne },
});
