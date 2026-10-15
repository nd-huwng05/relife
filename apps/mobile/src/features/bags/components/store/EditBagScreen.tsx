import { formatTime, formatVnd } from "@relife/shared";
import { Button, Card, Icon, InfoNote, LoadingView, SelectChip, StateView, Stepper, Text, TextField, spacing } from "@relife/ui";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { BottomBar } from "@/components/BottomBar";
import { Photo } from "@/components/Photo";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { errorMessage } from "@/lib/queryClient";

import { bagFormOptions, type MyBag } from "../../api";
import { useMyBags, useUpdateBag } from "../../hooks/useBags";
import { BagStatusBadge } from "./BagStatusBadge";

/** B08 Edit Bag. Price is locked after the first paid order; stock never goes below sold. */
export function EditBagScreen({ bagId }: { bagId: string }) {
  const query = useMyBags();
  const bag = query.data?.find((b) => b.id === bagId);

  if (query.isPending) return <LoadingView />;
  if (!bag) return <StateView icon="alert" title="Không tìm thấy túi" actionLabel="Quay lại" onAction={() => router.back()} />;
  return <EditBagForm bag={bag} />;
}

function EditBagForm({ bag }: { bag: MyBag }) {
  const update = useUpdateBag();
  const locked = bag.paidOrders > 0;
  const [price, setPrice] = useState(bag.price);
  const [stock, setStock] = useState(bag.stock);
  const [window, setWindow] = useState<[string, string]>([formatTime(bag.pickupStart), formatTime(bag.pickupEnd)]);
  const [picking, setPicking] = useState(false);
  const windowChanged = window[0] !== formatTime(bag.pickupStart) || window[1] !== formatTime(bag.pickupEnd);

  return (
    <Screen
      gap={14}
      header={<ScreenHeader title="Sửa túi" />}
      footer={
        <BottomBar plain>
          {update.isError && (
            <Text variant="caption" color="terracotta" align="center">
              {errorMessage(update.error)}
            </Text>
          )}
          <Button
            title="Lưu thay đổi"
            loading={update.isPending}
            onPress={() =>
              update.mutate(
                { bagId: bag.id, price: locked ? undefined : price, stock, pickupStart: window[0], pickupEnd: window[1] },
                { onSuccess: () => router.back() },
              )
            }
          />
        </BottomBar>
      }
    >
      <Card>
        <View style={styles.row}>
          <Photo photo={bag.photos[0]} width={56} height={56} radius={14} />
          <View style={styles.text}>
            <Text variant="bodyStrong">{bag.title}</Text>
            <BagStatusBadge status={bag.status} />
          </View>
        </View>
      </Card>

      <View style={styles.group}>
        <TextField
          label="Giá bán"
          value={formatVnd(price)}
          editable={!locked}
          locked={locked}
          onChangeText={(t) => setPrice(Number(t.replace(/\D/g, "") || 0))}
          keyboardType="number-pad"
          right={locked ? <Icon name="lock" size={18} color="stone" /> : undefined}
        />
        {locked && (
          <View style={styles.lockNote}>
            <Icon name="lock" size={14} color="amber" />
            <Text variant="caption" color="amber">
              Giá đã khoá vì có {bag.paidOrders} đơn đã thanh toán.
            </Text>
          </View>
        )}
      </View>

      <Card>
        <View style={styles.qty}>
          <View style={styles.text}>
            <Text variant="bodyStrong" style={styles.label14}>
              Số lượng còn lại
            </Text>
            <Text variant="caption" color="stone">
              Đã bán {bag.sold} · không thể giảm dưới {bag.sold}
            </Text>
          </View>
          <Stepper value={stock} onChange={setStock} min={Math.max(1, bag.sold)} max={50} size={38} label="số lượng" />
        </View>
      </Card>

      <View style={styles.group}>
        <Text variant="label" color="stone">
          Khung giờ nhận
        </Text>
        <Pressable accessibilityRole="button" onPress={() => setPicking(!picking)}>
          <View pointerEvents="none">
            <TextField value={`${window[0]} – ${window[1]}`} editable={false} right={<Icon name="down" size={18} color="stone" />} />
          </View>
        </Pressable>
        {picking && (
          <View style={styles.chips}>
            {bagFormOptions.pickupWindows.map(([s, e]) => (
              <SelectChip key={s} label={`${s} – ${e}`} selected={window[0] === s} onPress={() => { setWindow([s, e]); setPicking(false); }} />
            ))}
          </View>
        )}
        <Text variant="caption" color={windowChanged ? "terracotta" : "stone"}>
          Đổi giờ sẽ báo tới {bag.openPaidOrders} khách đã đặt.
        </Text>
      </View>
      <InfoNote tone="plain">Thêm hoặc bớt số lượng an toàn khi khách đang đặt.</InfoNote>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  text: { flex: 1, gap: 4 },
  label14: { fontSize: 14, lineHeight: 18 },
  lockNote: { flexDirection: "row", alignItems: "center", gap: 6 },
  group: { gap: 6 },
  qty: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
});
