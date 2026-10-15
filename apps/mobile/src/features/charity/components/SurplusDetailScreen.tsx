import { formatWindow } from "@relife/shared";
import { Button, Card, Icon, IconButton, KeyValueRow, LoadingView, StateView, Stepper, Text, colors, fontFamily, spacing } from "@relife/ui";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BottomBar } from "@/components/BottomBar";
import { Photo } from "@/components/Photo";
import { formatKm } from "@/features/bags";
import { errorMessage } from "@/lib/queryClient";

import { useClaimSurplus, useSurplus } from "../hooks/useCharity";

/** C04 Surplus Detail: claim some or all portions, free of charge. */
export function SurplusDetailScreen({ surplusId }: { surplusId: string }) {
  const insets = useSafeAreaInsets();
  const query = useSurplus(surplusId);
  const claim = useClaimSurplus();
  const [units, setUnits] = useState(8);

  if (query.isPending) return <LoadingView />;
  if (query.isError) return <StateView icon="alert" title="Nguồn này không còn" message={errorMessage(query.error)} actionLabel="Quay lại" onAction={() => router.back()} />;
  const s = query.data;
  const qty = Math.min(units, s.unitsLeft);

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Photo photo={s.photo} height={280} radius={0} />
        <View style={styles.sheet}>
          <View style={styles.gap4}>
            <Text style={styles.title}>{s.title}</Text>
            <Text variant="small" color="stone">
              {s.storeName} · {formatKm(s.distanceKm)} · {s.storeAddress}
            </Text>
          </View>
          <View style={styles.storage}>
            <Icon name="alert" size={18} color="cool" />
            <View style={styles.storageText}>
              <Text variant="bodyStrong" color="cool" style={styles.t14}>
                Yêu cầu bảo quản
              </Text>
              <Text variant="small" color="cool">
                {s.storageNote}
              </Text>
            </View>
          </View>
          <Card gap={10}>
            <View style={styles.between}>
              <Text variant="body" color="stone" style={styles.t14}>
                Còn lại
              </Text>
              <Text variant="bodyStrong" style={styles.t14}>
                {s.unitsLeft} / {s.unitsTotal} phần
              </Text>
            </View>
            <KeyValueRow label="Khung nhận" value={formatWindow(s.pickupStart, s.pickupEnd)} />
            <View style={styles.between}>
              <Text variant="body" color="stone" style={styles.t14}>
                Giá trị
              </Text>
              <Text variant="bodyStrong" color="success" style={styles.t14}>
                Miễn phí
              </Text>
            </View>
          </Card>
          <Card>
            <View style={styles.between}>
              <View style={styles.gap2}>
                <Text variant="bodyStrong">Số phần nhận</Text>
                <Text variant="caption" color="stone">
                  Có thể nhận một phần
                </Text>
              </View>
              <Stepper value={qty} onChange={setUnits} min={1} max={s.unitsLeft} size={38} label="số phần" />
            </View>
          </Card>
        </View>
      </ScrollView>
      <IconButton name="left" variant="surface" iconSize={20} style={[styles.back, { top: insets.top + 4 }]} onPress={() => router.back()} accessibilityLabel="Quay lại" />
      <BottomBar plain>
        {claim.isError && (
          <Text variant="caption" color="terracotta" align="center">
            {errorMessage(claim.error)}
          </Text>
        )}
        <Button
          title={`Nhận ${qty} phần · miễn phí`}
          icon="heart"
          disabled={s.unitsLeft === 0}
          loading={claim.isPending}
          onPress={() => claim.mutate({ surplusId, units: qty }, { onSuccess: (c) => router.replace(`/claim/${c.id}`) })}
        />
      </BottomBar>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.linen },
  scroll: { paddingBottom: spacing.lg },
  sheet: {
    marginTop: -32,
    backgroundColor: colors.linen,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: spacing.lg,
    gap: 12,
  },
  gap4: { gap: 4 },
  gap2: { gap: 2 },
  title: { fontFamily: fontFamily.heading, fontSize: 26, lineHeight: 34, color: colors.ink },
  storage: { flexDirection: "row", gap: 10, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 16, backgroundColor: colors.coolSoft },
  storageText: { flex: 1, gap: 2 },
  t14: { fontSize: 14, lineHeight: 18 },
  between: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  back: { position: "absolute", left: 16, backgroundColor: "rgba(255, 255, 255, 0.92)", borderWidth: 0 },
});
