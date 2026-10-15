import { bagSchema, discountPercent, formatVnd } from "@relife/shared";
import { Button, Chip, SelectChip, Stepper, Text, TextField, colors, fontFamily } from "@relife/ui";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { BottomBar } from "@/components/BottomBar";
import { Photo } from "@/components/Photo";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { newIdempotencyKey } from "@/lib/functions";
import { errorMessage } from "@/lib/queryClient";

import { bagFormOptions } from "../../api";
import { usePublishBag } from "../../hooks/useBags";

const digits = (v: string) => Number(v.replace(/\D/g, "") || 0);

/** B06 Create Bag. Validated with the shared `bagSchema`, then sent to `publishBag`. */
export function CreateBagScreen() {
  const [photo, setPhoto] = useState(bagFormOptions.lastPhoto);
  const [title, setTitle] = useState("Túi bánh ngọt cuối ngày");
  const [price, setPrice] = useState(59000);
  const [value, setValue] = useState(180000);
  const [stock, setStock] = useState(8);
  const [windowIndex, setWindowIndex] = useState(1);
  const [allergens, setAllergens] = useState<string[]>(["Gluten", "Sữa", "Trứng"]);
  const [idempotencyKey] = useState(newIdempotencyKey);
  const publish = usePublishBag();

  const window = bagFormOptions.pickupWindows[windowIndex] ?? ["19:00", "20:30"];
  const input = {
    title,
    price,
    value,
    stock,
    maxPerCustomer: 2,
    pickupStart: window[0],
    pickupEnd: window[1],
    allergens,
    photo,
    idempotencyKey,
  };
  const parsed = bagSchema.safeParse(input);
  const issue = (path: string) => (parsed.success ? null : parsed.error.issues.find((i) => i.path[0] === path)?.message ?? null);

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    const result = perm.granted
      ? await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.7 })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, aspect: [1, 1], quality: 0.7 });
    // TODO(S2): upload to Storage `stores/{id}/bags/` and keep the Storage path instead.
    if (!result.canceled && result.assets[0]) setPhoto(result.assets[0].uri);
  };

  return (
    <Screen
      gap={14}
      header={<ScreenHeader title="Tạo túi bánh" />}
      footer={
        <BottomBar plain>
          {publish.isError && (
            <Text variant="caption" color="terracotta" align="center">
              {errorMessage(publish.error)}
            </Text>
          )}
          <Button
            title="Đăng túi ngay"
            icon="package"
            disabled={!parsed.success}
            loading={publish.isPending}
            onPress={() => publish.mutate(input, { onSuccess: () => router.back() })}
          />
        </BottomBar>
      }
    >
      <View style={styles.photoRow}>
        <Photo photo={photo} width={84} height={84} radius={18} />
        <View style={styles.photoText}>
          <Text style={styles.label14}>Ảnh túi</Text>
          <Pressable accessibilityRole="button" onPress={() => setPhoto(bagFormOptions.lastPhoto)}>
            <Text variant="caption" color="success">
              Dùng lại ảnh lần trước
            </Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={takePhoto}>
            <Text variant="labelStrong" color="forest">
              Chụp ảnh mới
            </Text>
          </Pressable>
        </View>
      </View>

      <TextField label="Tên túi" value={title} onChangeText={setTitle} error={title ? issue("title") : null} />

      <View style={styles.twoCols}>
        <View style={styles.flex}>
          <TextField
            label="Giá bán"
            value={formatVnd(price)}
            onChangeText={(t) => setPrice(digits(t))}
            keyboardType="number-pad"
            error={issue("price")}
          />
        </View>
        <View style={styles.flex}>
          <TextField
            label="Giá gốc"
            value={formatVnd(value)}
            onChangeText={(t) => setValue(digits(t))}
            keyboardType="number-pad"
            right={discountPercent(price, value) > 0 ? <Chip label={`-${discountPercent(price, value)}%`} size="sm" /> : undefined}
            error={issue("value")}
          />
        </View>
      </View>

      <View style={styles.qtyRow}>
        <View style={styles.qtyText}>
          <Text style={styles.label14}>Số lượng</Text>
          <Text variant="caption" color="stone">
            Tối đa 2 túi mỗi khách
          </Text>
        </View>
        <Stepper value={stock} onChange={setStock} min={1} max={50} size={38} label="số lượng" />
      </View>

      <View style={styles.group}>
        <Text variant="label" color="stone">
          Khung giờ nhận · theo giờ mở cửa
        </Text>
        <View style={styles.chips}>
          {bagFormOptions.pickupWindows.map(([s, e], i) => (
            <SelectChip key={s} size="sm" label={`${s} – ${e}`} selected={i === windowIndex} onPress={() => setWindowIndex(i)} />
          ))}
        </View>
      </View>

      <View style={styles.group}>
        <Text variant="label" color="stone">
          Có thể chứa
        </Text>
        <View style={styles.chips}>
          {bagFormOptions.allergens.map((a) => (
            <SelectChip
              key={a}
              size="sm"
              label={a}
              selected={allergens.includes(a)}
              onPress={() => setAllergens(allergens.includes(a) ? allergens.filter((x) => x !== a) : [...allergens, a])}
            />
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  photoRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  photoText: { gap: 4 },
  label14: { fontFamily: fontFamily.bodySemiBold, fontSize: 14, color: colors.ink },
  qtyText: { gap: 2 },
  twoCols: { flexDirection: "row", gap: 13 },
  flex: { flex: 1 },
  qtyRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  group: { gap: 8 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
});
