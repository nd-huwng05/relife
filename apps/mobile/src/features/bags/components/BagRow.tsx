import { formatWindow, type Bag } from "@relife/shared";
import { Icon, Price, Text, colors, radius } from "@relife/ui";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { Photo } from "@/components/Photo";

interface BagRowProps {
  bag: Bag;
  /** Second line; defaults to "Store · 0,8 km". */
  subtitle?: string;
  /** Third line; defaults to "Nhận 19:00 – 20:30". */
  meta?: string;
  metaColor?: "stone" | "terracotta";
  right?: ReactNode;
  onPress?: () => void;
}

export function formatKm(km: number | undefined) {
  return km === undefined ? "" : `${String(km).replace(".", ",")} km`;
}

/** Compact bag row used in Search, Map, Store page and Saved (Figma "Bag row"). */
export function BagRow({ bag, subtitle, meta, metaColor = "stone", right, onPress }: BagRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${bag.title}, ${bag.storeName}`}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <Photo photo={bag.photos[0]} width={76} height={76} radius={16} />
      <View style={styles.text}>
        <Text variant="bodyStrong" numberOfLines={1}>
          {bag.title}
        </Text>
        <Text variant="small" color="stone" numberOfLines={1}>
          {subtitle ?? [bag.storeName, formatKm(bag.distanceKm)].filter(Boolean).join(" · ")}
        </Text>
        <View style={styles.meta}>
          <Icon name="clock" size={13} color={metaColor} />
          <Text variant="caption" color={metaColor}>
            {meta ?? `Nhận ${formatWindow(bag.pickupStart, bag.pickupEnd)}`}
          </Text>
        </View>
        <Price amount={bag.price} originalValue={bag.value} size="sm" />
      </View>
      {right}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 10,
    borderRadius: radius.xl,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
  },
  pressed: { opacity: 0.85 },
  text: { flex: 1, gap: 3 },
  meta: { flexDirection: "row", alignItems: "center", gap: 4 },
});
