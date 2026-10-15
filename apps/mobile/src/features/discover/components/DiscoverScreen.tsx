import { Avatar, Chip, Icon, LoadingView, SectionHeader, StateView, Text, colors, fontFamily } from "@relife/ui";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { Screen } from "@/components/Screen";
import { BagCard, ClosingSoonCard, useToggleSaveBag } from "@/features/bags";
import { errorMessage } from "@/lib/queryClient";

import { useDiscoverFeed } from "../hooks/useDiscover";
import { activeFilterCount, useFilters } from "../store";

const FILTER_BUTTON = require("@/assets/images/ui/filter-button.svg");

/** A08 Discover. Spacing follows the Figma frame (24pt sides). */
export function DiscoverScreen() {
  const filters = useFilters();
  const feed = useDiscoverFeed(filters);
  const toggleSave = useToggleSaveBag();
  const filterCount = activeFilterCount(filters);

  return (
    <Screen withTabBar gap={0} refreshing={feed.isRefetching} onRefresh={() => feed.refetch()}>
      <View style={styles.top}>
        <View style={styles.location}>
          <Text style={styles.locLabel}>Vị trí của bạn</Text>
          <Pressable accessibilityRole="button" style={styles.inline} onPress={() => router.push("/map")}>
            <Icon name="nav" size={16} color="forest" />
            <Text style={styles.locText}>{feed.data?.areaLabel ?? "Đang tìm vị trí…"}</Text>
            <Icon name="down" size={16} color="ink" />
          </Pressable>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Tài khoản" onPress={() => router.push("/profile")}>
          <Avatar name={feed.data?.userName ?? "R"} size={44} />
        </Pressable>
      </View>

      <Text style={styles.headline}>{"Tối nay giải cứu\nmón gì nhỉ?"}</Text>

      <View style={styles.searchRow}>
        <Pressable accessibilityRole="search" onPress={() => router.push("/search")} style={styles.search}>
          <Icon name="search" size={20} color="stone" />
          <Text style={styles.searchText}>Tìm tiệm bánh, món bánh…</Text>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Bộ lọc" onPress={() => router.push("/filter")}>
          <Image source={FILTER_BUTTON} style={styles.filter} contentFit="contain" />
          {filterCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{filterCount}</Text>
            </View>
          )}
        </Pressable>
      </View>

      {feed.data && (
        <Pressable accessibilityRole="button" onPress={() => router.push("/profile")} style={styles.impact}>
          <View style={styles.impactText}>
            <Text style={styles.impactLabel}>TÁC ĐỘNG HÔM NAY</Text>
            <Text style={styles.impactLine}>
              <Text style={styles.impactNumber}>{feed.data.bagsSavedToday.toLocaleString("vi-VN")}</Text> túi bánh đã được cứu
            </Text>
          </View>
          <View style={styles.impactIcon}>
            <Icon name="heart" size={20} color="deepForest" />
          </View>
        </Pressable>
      )}

      {feed.isPending ? (
        <LoadingView />
      ) : feed.isError ? (
        <StateView icon="wifioff" title="Chưa tải được túi bánh" message={errorMessage(feed.error)} actionLabel="Thử lại" onAction={() => feed.refetch()} />
      ) : (
        <>
          {feed.data.closingSoon.length > 0 && (
            <View style={styles.section}>
              <SectionHeader
                title="Sắp hết giờ"
                accessory={<Chip label="Dưới 90 phút" tone="dangerSoft" size="sm" />}
                actionLabel="Xem tất cả"
                onAction={() => router.push("/search")}
              />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bleed} contentContainerStyle={styles.strip}>
                {feed.data.closingSoon.map((b) => (
                  <ClosingSoonCard key={b.id} bag={b} onPress={() => router.push(`/bag/${b.id}`)} />
                ))}
              </ScrollView>
            </View>
          )}
          <View style={styles.nearby}>
            <SectionHeader title="Gần bạn" actionLabel="Xem tất cả" onAction={() => router.push("/map")} />
            {feed.data.nearby.length === 0 ? (
              <StateView icon="search" title="Không có túi phù hợp" message="Thử nới khoảng cách hoặc bỏ bớt bộ lọc." actionLabel="Đổi bộ lọc" onAction={() => router.push("/filter")} />
            ) : (
              feed.data.nearby.map((b) => (
                <BagCard
                  key={b.id}
                  bag={b}
                  saved={feed.data.savedBagIds.includes(b.id)}
                  onPress={() => router.push(`/bag/${b.id}`)}
                  onToggleSave={() => toggleSave.mutate(b.id)}
                />
              ))
            )}
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: -4 },
  location: { gap: 3 },
  locLabel: { fontFamily: fontFamily.body, fontSize: 12, color: colors.stone },
  inline: { flexDirection: "row", alignItems: "center", gap: 6 },
  locText: { fontFamily: fontFamily.bodySemiBold, fontSize: 16, color: colors.ink },
  headline: { fontFamily: fontFamily.heading, fontSize: 28, lineHeight: 34, color: colors.ink, marginTop: 16 },
  searchRow: { flexDirection: "row", gap: 10, marginTop: 14 },
  search: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingLeft: 18,
  },
  searchText: { fontFamily: fontFamily.body, fontSize: 15, color: colors.stone },
  filter: { width: 52, height: 52 },
  badge: {
    position: "absolute",
    right: -2,
    top: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.terracotta,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: { fontFamily: fontFamily.bodySemiBold, fontSize: 11, color: colors.white },
  impact: {
    marginTop: 16,
    backgroundColor: colors.deepForest,
    borderRadius: 22,
    paddingVertical: 16,
    paddingLeft: 20,
    paddingRight: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  impactText: { gap: 4, flex: 1 },
  impactLabel: { fontFamily: fontFamily.bodySemiBold, fontSize: 10, letterSpacing: 1.2, color: colors.champagne },
  impactLine: { fontFamily: fontFamily.heading, fontSize: 18, color: colors.cream },
  impactNumber: { fontFamily: fontFamily.number, fontSize: 17 },
  impactIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: "rgba(201, 169, 110, 0.95)", alignItems: "center", justifyContent: "center" },
  section: { gap: 16, marginTop: 32 },
  bleed: { marginHorizontal: -24 },
  strip: { paddingHorizontal: 24, gap: 12, paddingBottom: 16 },
  nearby: { gap: 14, marginTop: 0 },
});
