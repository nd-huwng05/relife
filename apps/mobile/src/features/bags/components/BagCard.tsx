import { discountPercent, formatDuration, formatWindow, minutesUntil, type Bag } from "@relife/shared";
import { Chip, Icon, IconButton, Price, Text, colors, fontFamily, radius, shadows } from "@relife/ui";
import { Pressable, StyleSheet, View } from "react-native";

import { Photo } from "@/components/Photo";
import { useNow } from "@/lib/clock";

import { formatKm } from "./BagRow";

interface BagCardProps {
  bag: Bag;
  saved: boolean;
  onPress: () => void;
  onToggleSave: () => void;
}

/** Large "Gần bạn" card on Discover (A08). */
export function BagCard({ bag, saved, onPress, onToggleSave }: BagCardProps) {
  const left = bag.stock - bag.sold;
  const discount = discountPercent(bag.price, bag.value);
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${bag.title}, ${bag.storeName}`} onPress={onPress} style={styles.card}>
      <Photo photo={bag.photos[0]} height={160} radius={18}>
        {left > 0 && left <= 3 && <Chip label={`Còn ${left} túi`} tone="danger" style={styles.leftChip} />}
        {left === 0 && <Chip label="Hết túi" tone="white" style={styles.leftChip} />}
        <IconButton
          name="heart"
          size={36}
          iconSize={18}
          variant="scrim"
          color={saved ? "terracotta" : "ink"}
          filled={saved}
          style={styles.heart}
          onPress={onToggleSave}
          accessibilityLabel={saved ? "Bỏ lưu" : "Lưu túi"}
        />
      </Photo>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text variant="headline" numberOfLines={1} style={styles.flex}>
            {bag.storeName}
          </Text>
          <Icon name="star" size={14} color="champagne" filled />
          <Text variant="labelStrong">{bag.storeRating.toFixed(1)}</Text>
        </View>
        <View style={styles.metaRow}>
          <Icon name="clock" size={14} color="stone" />
          <Text variant="small" color="stone">
            Nhận {formatWindow(bag.pickupStart, bag.pickupEnd)}
          </Text>
          <Text variant="small" color="stone">
            ·
          </Text>
          <Icon name="nav" size={14} color="stone" />
          <Text variant="small" color="stone">
            {formatKm(bag.distanceKm)}
          </Text>
        </View>
        <View style={styles.priceRow}>
          <Price amount={bag.price} originalValue={bag.value} />
          {discount > 0 && <Chip label={`-${discount}%`} tone="gold" />}
        </View>
      </View>
    </Pressable>
  );
}

/** Horizontal "Sắp hết giờ" card with a countdown chip (A08). */
export function ClosingSoonCard({ bag, onPress }: { bag: Bag; onPress: () => void }) {
  const now = useNow(30_000);
  const minutes = minutesUntil(bag.pickupEnd, now);
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${bag.storeName}, còn ${minutes} phút`} onPress={onPress} style={styles.small}>
      <Photo photo={bag.photos[0]} width={212} height={124} radius={16}>
        <View style={[styles.leftChip, styles.timeChip]}>
          <Icon name="clock" size={14} color="terracotta" />
          <Text style={styles.timeText}>Còn {formatDuration(minutes)}</Text>
        </View>
      </Photo>
      <View style={styles.smallBody}>
        <Text variant="bodyStrong" numberOfLines={1}>
          {bag.storeName}
        </Text>
        <Price amount={bag.price} originalValue={bag.value} size="sm" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: radius.xxl, padding: 10, gap: 12, ...shadows.card },
  leftChip: { position: "absolute", left: 12, top: 12 },
  heart: { position: "absolute", right: 12, top: 12 },
  body: { gap: 8 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  flex: { flex: 1 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  priceRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  small: { width: 228, backgroundColor: colors.card, borderRadius: 22, padding: 8, gap: 10, ...shadows.card, shadowOffset: { width: 0, height: 8 }, shadowRadius: 11, shadowOpacity: 0.07 },
  timeChip: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 8, paddingVertical: 5, borderRadius: radius.full, backgroundColor: "rgba(255, 255, 255, 0.94)" },
  timeText: { fontFamily: fontFamily.bodySemiBold, fontSize: 11, color: colors.terracotta },
  smallBody: { gap: 4, paddingLeft: 6, paddingBottom: 6 },
});
