import { DEFAULT_BAG_FILTERS, type BagFilters } from "@relife/shared";
import { Button, IconButton, RadioRow, SelectChip, Slider, Text, colors, fontFamily } from "@relife/ui";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { Sheet } from "@/components/Sheet";

import { useBagCount } from "../hooks/useDiscover";
import { CATEGORIES, SLOTS } from "../labels";
import { filterStore } from "../store";

const PRICES: { key: NonNullable<BagFilters["priceRange"]>; label: string }[] = [
  { key: "under40", label: "Dưới 40k" },
  { key: "40to70", label: "40k – 70k" },
  { key: "over70", label: "Trên 70k" },
];

const SORTS: { key: BagFilters["sort"]; label: string }[] = [
  { key: "nearest", label: "Gần nhất" },
  { key: "endingSoon", label: "Sắp hết giờ nhận" },
  { key: "cheapest", label: "Giá thấp nhất" },
  { key: "topRated", label: "Đánh giá cao" },
];

/** A09 Filter And Sort. Edits a draft and applies it to Discover on confirm. */
export function FilterSheet() {
  const [draft, setDraft] = useState<BagFilters>(filterStore.get());
  const count = useBagCount(draft);
  const patch = (p: Partial<BagFilters>) => setDraft((d) => ({ ...d, ...p }));

  return (
    <Sheet
      footer={
        <View style={styles.footer}>
          <Pressable accessibilityRole="button" onPress={() => setDraft(DEFAULT_BAG_FILTERS)} hitSlop={8}>
            <Text style={styles.clear}>Xoá bộ lọc</Text>
          </Pressable>
          <Button
            title={count.data === undefined ? "Xem túi bánh" : `Xem ${count.data} túi bánh`}
            fullWidth={false}
            style={styles.apply}
            onPress={() => {
              filterStore.set(draft);
              router.back();
            }}
          />
        </View>
      }
    >
      <View style={styles.titleRow}>
        <Text style={styles.title}>Bộ lọc</Text>
        <IconButton name="x" size={38} iconSize={17} onPress={() => router.back()} accessibilityLabel="Đóng" />
      </View>

      <View style={styles.group}>
        <View style={styles.between}>
          <Text style={styles.label}>Khoảng cách</Text>
          <Text style={[styles.label, styles.value]}>Trong {draft.maxDistanceKm} km</Text>
        </View>
        <Slider value={draft.maxDistanceKm} min={1} max={10} onChange={(v) => patch({ maxDistanceKm: v })} accessibilityLabel="Khoảng cách tối đa" />
        <View style={[styles.between, styles.tight]}>
          <Text variant="caption" color="stone">
            1 km
          </Text>
          <Text variant="caption" color="stone">
            10 km
          </Text>
        </View>
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Khung giờ nhận</Text>
        <View style={styles.chips}>
          {SLOTS.map((s) => (
            <SelectChip key={s.key} label={s.label} selected={draft.pickupSlot === s.key} onPress={() => patch({ pickupSlot: draft.pickupSlot === s.key ? null : s.key })} />
          ))}
        </View>
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Loại đồ ăn</Text>
        <View style={styles.chips}>
          {CATEGORIES.map((c) => (
            <SelectChip
              key={c.key}
              label={c.label}
              selected={draft.categories.includes(c.key)}
              onPress={() =>
                patch({ categories: draft.categories.includes(c.key) ? draft.categories.filter((x) => x !== c.key) : [...draft.categories, c.key] })
              }
            />
          ))}
        </View>
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Mức giá</Text>
        <View style={styles.chips}>
          {PRICES.map((p) => (
            <SelectChip key={p.key} label={p.label} selected={draft.priceRange === p.key} onPress={() => patch({ priceRange: draft.priceRange === p.key ? null : p.key })} />
          ))}
        </View>
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Sắp xếp theo</Text>
        <View style={styles.sorts}>
          {SORTS.map((s) => (
            <RadioRow key={s.key} label={s.label} selected={draft.sort === s.key} onPress={() => patch({ sort: s.key })} />
          ))}
        </View>
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  titleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: -4, marginBottom: 4 },
  title: { fontFamily: fontFamily.heading, fontSize: 24, color: colors.ink },
  label: { fontFamily: fontFamily.bodySemiBold, fontSize: 14, color: colors.ink },
  value: { color: colors.forest },
  clear: { fontFamily: fontFamily.bodySemiBold, fontSize: 15, color: colors.stone },
  group: { gap: 10 },
  between: { flexDirection: "row", justifyContent: "space-between" },
  tight: { marginTop: -2 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  sorts: { gap: 14, marginTop: 2 },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  apply: { width: 210 },
});
