import { BAG_KIND, discountPercent, formatDuration, formatVnd, formatWindow, minutesUntil } from "@relife/shared";
import { Avatar, Button, Card, Chip, Icon, IconButton, InfoNote, LoadingView, PageDots, Price, StateView, Text, colors, radius, spacing } from "@relife/ui";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Share, StyleSheet, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BottomBar } from "@/components/BottomBar";
import { Photo } from "@/components/Photo";
import { useNow } from "@/lib/clock";
import { errorMessage } from "@/lib/queryClient";

import { useBag, useToggleSaveBag } from "../hooks/useBags";
import { formatKm } from "./BagRow";

const PHOTO_HEIGHT = 390;

/** A12 Bag Detail. */
export function BagDetailScreen({ bagId }: { bagId: string }) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const query = useBag(bagId);
  const toggleSave = useToggleSaveBag();
  const now = useNow(30_000);
  const [page, setPage] = useState(0);

  if (query.isPending) return <LoadingView />;
  if (query.isError) return <StateView icon="alert" title="Không mở được túi bánh" message={errorMessage(query.error)} actionLabel="Thử lại" onAction={() => query.refetch()} />;

  const { bag, store, saved } = query.data;
  const left = bag.stock - bag.sold;
  const closesIn = minutesUntil(bag.pickupEnd, now);
  const ended = closesIn <= 0;
  const discount = discountPercent(bag.price, bag.value);

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={{ height: PHOTO_HEIGHT }}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / width))}
          >
            {bag.photos.map((p) => (
              <Photo key={p} photo={p} width={width} height={PHOTO_HEIGHT} radius={0} />
            ))}
          </ScrollView>
          <LinearGradient colors={["rgba(0,0,0,0.35)", "rgba(0,0,0,0)"]} style={styles.shade} pointerEvents="none" />
          {bag.photos.length > 1 && (
            <View style={styles.dots}>
              <PageDots total={bag.photos.length} index={page} tone="light" size={6} />
            </View>
          )}
        </View>

        <View style={styles.sheet}>
          <View style={styles.chips}>
            {bag.kind === BAG_KIND.SURPRISE && <Chip label="Túi bất ngờ" icon="bag" />}
            <Chip label={bag.categoryLabel} tone="white" />
          </View>
          <Text variant="title">{bag.title}</Text>

          <Pressable accessibilityRole="button" onPress={() => router.push(`/store/${store.id}`)} style={styles.storeRow}>
            <Avatar name={store.name} size={42} tone="dark" />
            <View style={styles.flex}>
              <Text variant="bodyStrong">{store.name}</Text>
              <View style={styles.inline}>
                <Icon name="star" size={13} color="champagne" filled />
                <Text variant="small" color="stone" numberOfLines={1}>
                  {store.rating.toFixed(1)} ({store.reviewCount}) · {formatKm(store.distanceKm)} · {store.address.split(",")[0]}
                </Text>
              </View>
            </View>
            <Icon name="right" size={18} color="stone" />
          </Pressable>

          <View style={styles.inline}>
            <Price amount={bag.price} originalValue={bag.value} size="lg" />
            {discount > 0 && <Chip label={`Tiết kiệm ${discount}%`} tone="dangerSoft" />}
          </View>

          <View style={styles.infoRow}>
            <Card padding={14} gap={10} style={styles.info}>
              <IconButton name="clock" size={36} iconSize={17} variant="soft" accessibilityLabel="" />
              <View style={styles.infoText}>
                <Text variant="caption" color="stone">
                  Nhận hôm nay
                </Text>
                <Text variant="bodyStrong">{formatWindow(bag.pickupStart, bag.pickupEnd)}</Text>
                <Text variant="label" color={ended ? "stone" : "terracotta"}>
                  {ended ? "Đã hết giờ nhận" : `Đóng sau ${formatDuration(closesIn, "long")}`}
                </Text>
              </View>
            </Card>
            <Card padding={14} gap={10} style={styles.info}>
              <IconButton name="bag" size={36} iconSize={17} variant="soft" accessibilityLabel="" />
              <View style={styles.infoText}>
                <Text variant="caption" color="stone">
                  Số lượng
                </Text>
                <Text variant="bodyStrong" color={left <= 3 ? "terracotta" : "ink"}>
                  {left === 0 ? "Đã hết túi" : left <= 3 ? `Chỉ còn ${left} túi` : `Còn ${left} túi`}
                </Text>
                <Text variant="label" color="stone">
                  {left === 0 ? "Bật chuông ở trang tiệm" : left <= 3 ? "Nhanh tay kẻo hết" : `Tối đa ${bag.maxPerCustomer} túi mỗi người`}
                </Text>
              </View>
            </Card>
          </View>

          <InfoNote tone="soft">{bag.description}</InfoNote>
          {bag.allergens.length > 0 && (
            <Text variant="small" color="stone">
              Có thể chứa: {bag.allergens.join(", ")}
            </Text>
          )}
        </View>
      </ScrollView>

      <View style={[styles.topBar, { top: insets.top + 4 }]}>
        <IconButton name="left" variant="scrim" iconSize={20} onPress={() => (router.canGoBack() ? router.back() : router.replace("/(customer)/(tabs)"))} accessibilityLabel="Quay lại" />
        <View style={styles.inline}>
          <IconButton
            name="share"
            variant="scrim"
            iconSize={20}
            onPress={() => Share.share({ message: `${bag.title} tại ${store.name}: ${formatVnd(bag.price)} trên Relife` })}
            accessibilityLabel="Chia sẻ"
          />
          <IconButton
            name="heart"
            variant="scrim"
            iconSize={20}
            color={saved ? "terracotta" : "ink"}
            filled={saved}
            onPress={() => toggleSave.mutate(bag.id)}
            accessibilityLabel={saved ? "Bỏ lưu" : "Lưu túi"}
          />
        </View>
      </View>

      <BottomBar>
        <View style={styles.buyRow}>
          <View>
            <Text variant="caption" color="stone">
              Tổng cộng
            </Text>
            <Text variant="number">{formatVnd(bag.price)}</Text>
          </View>
          <Button
            title={left === 0 ? "Đã hết túi" : ended ? "Đã hết giờ" : "Đặt túi này"}
            icon="bag"
            fullWidth={false}
            disabled={left === 0 || ended}
            style={styles.buy}
            onPress={() => router.push(`/checkout/${bag.id}`)}
          />
        </View>
      </BottomBar>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.linen },
  scroll: { paddingBottom: spacing.lg },
  shade: { position: "absolute", left: 0, right: 0, top: 0, height: 150 },
  dots: { position: "absolute", top: 330, alignSelf: "center" },
  sheet: {
    marginTop: -38,
    backgroundColor: colors.linen,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  chips: { flexDirection: "row", gap: 8 },
  storeRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  flex: { flex: 1 },
  inline: { flexDirection: "row", alignItems: "center", gap: 6 },
  infoRow: { flexDirection: "row", gap: 12 },
  info: { flex: 1, borderRadius: 18 },
  infoText: { gap: 2 },
  topBar: { position: "absolute", left: 16, right: 16, flexDirection: "row", justifyContent: "space-between" },
  buyRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  buy: { width: 200 },
});
