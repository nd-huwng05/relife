import { formatWindow } from "@relife/shared";
import { Icon, IconButton, LoadingView, StateView, Text, colors, fontFamily } from "@relife/ui";
import { router } from "expo-router";
import { Pressable, ScrollView, Share, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Photo } from "@/components/Photo";
import { errorMessage } from "@/lib/queryClient";

import { useStorePage, useToggleFollowStore } from "../hooks/useBags";
import { BagRow } from "./BagRow";

/** A13 Store Page. */
export function StorePageScreen({ storeId }: { storeId: string }) {
  const insets = useSafeAreaInsets();
  const query = useStorePage(storeId);
  const follow = useToggleFollowStore();

  if (query.isPending) return <LoadingView />;
  if (query.isError) return <StateView icon="alert" title="Không mở được trang tiệm" message={errorMessage(query.error)} actionLabel="Thử lại" onAction={() => query.refetch()} />;

  const { store, bags, following } = query.data;
  const todayCount = bags.reduce((n, b) => n + Math.max(0, b.stock - b.sold), 0);

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Photo photo={store.coverPhoto} height={250} radius={0} />
        <View style={styles.identity}>
          <View style={styles.avatar}>
            <Text style={styles.initial}>{store.name.charAt(0)}</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => follow.mutate(store.id)}
            style={[styles.follow, following && styles.following]}
          >
            <Icon name="bell" size={20} color={following ? "forest" : "cream"} />
            <Text style={[styles.followText, following && styles.followingText]}>{following ? "Đang theo dõi" : "Theo dõi"}</Text>
          </Pressable>
        </View>

        <View style={styles.content}>
          <View style={styles.gap4}>
            <Text style={styles.name}>{store.name}</Text>
            <View style={styles.inline}>
              <Text style={styles.meta}>{store.category}</Text>
              <Text style={styles.meta}>·</Text>
              <Icon name="star" size={14} color="champagne" filled />
              <Text style={styles.meta}>
                {store.rating.toFixed(1)} · {store.reviewCount} đánh giá
              </Text>
            </View>
          </View>
          <Text style={styles.description}>{store.description}</Text>

          <View style={styles.usual}>
            <Icon name="clock" size={20} color="champagne" />
            <View style={styles.gap2}>
              <Text style={styles.usualTitle}>Thường đăng bánh lúc {store.usualPostTime}</Text>
              <Text style={styles.usualSub}>Tính từ 30 ngày gần nhất</Text>
            </View>
          </View>

          <View style={styles.sectionRow}>
            <Text style={styles.section}>Hôm nay đang bán</Text>
            <View style={styles.countChip}>
              <Text style={styles.countText}>{todayCount} túi</Text>
            </View>
          </View>
          {bags.length === 0 ? (
            <StateView icon="bell" title="Hôm nay chưa có túi" message="Bật Theo dõi để được báo khi tiệm đăng túi mới." />
          ) : (
            bags.map((b) => {
              const left = b.stock - b.sold;
              return (
                <BagRow
                  key={b.id}
                  bag={b}
                  subtitle={`Nhận ${formatWindow(b.pickupStart, b.pickupEnd)}`}
                  meta={left > 0 ? `Còn ${left} túi` : "Đã hết túi"}
                  onPress={() => router.push(`/bag/${b.id}`)}
                />
              );
            })
          )}

          <View style={styles.hours}>
            {store.hours.map((h) => {
              const open = h.open && h.close;
              return (
                <View key={h.label} style={styles.hourRow}>
                  <Text style={[styles.hourLabel, h.isToday && styles.today]}>{h.isToday ? `${h.label} (hôm nay)` : h.label}</Text>
                  <Text style={[styles.hourValue, h.isToday && styles.today, !open && styles.closed]}>
                    {open ? `${h.open} – ${h.close}` : "Đóng cửa"}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
      <View style={[styles.topBar, { top: insets.top + 4 }]}>
        <IconButton name="left" variant="scrim" iconSize={20} onPress={() => router.back()} accessibilityLabel="Quay lại" />
        <IconButton
          name="share"
          variant="scrim"
          iconSize={20}
          onPress={() => Share.share({ message: `${store.name} trên Relife: túi bánh cuối ngày giá tốt.` })}
          accessibilityLabel="Chia sẻ"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.linen },
  scroll: { paddingBottom: 48 },
  identity: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", paddingHorizontal: 24, marginTop: -38 },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: colors.forest,
    borderWidth: 4,
    borderColor: colors.linen,
    alignItems: "center",
    justifyContent: "center",
  },
  initial: { fontFamily: fontFamily.heading, fontSize: 30, color: colors.champagne },
  follow: {
    height: 44,
    minWidth: 124,
    paddingHorizontal: 16,
    borderRadius: 22,
    backgroundColor: colors.forest,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 4,
  },
  following: { backgroundColor: colors.goldSoft },
  followText: { fontFamily: fontFamily.bodySemiBold, fontSize: 14, color: colors.cream },
  followingText: { color: colors.forest },
  content: { paddingHorizontal: 24, paddingTop: 12, gap: 14 },
  gap4: { gap: 4 },
  gap2: { gap: 2 },
  name: { fontFamily: fontFamily.heading, fontSize: 26, color: colors.ink },
  inline: { flexDirection: "row", alignItems: "center", gap: 6 },
  meta: { fontFamily: fontFamily.body, fontSize: 14, color: colors.stone },
  description: { fontFamily: fontFamily.body, fontSize: 14, lineHeight: 21, color: colors.stone },
  usual: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderRadius: 18, backgroundColor: colors.deepForest },
  usualTitle: { fontFamily: fontFamily.bodySemiBold, fontSize: 15, color: colors.cream },
  usualSub: { fontFamily: fontFamily.body, fontSize: 12, color: colors.champagne },
  sectionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  section: { fontFamily: fontFamily.heading, fontSize: 18, color: colors.ink },
  countChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: colors.successSoft },
  countText: { fontFamily: fontFamily.bodySemiBold, fontSize: 12, color: colors.success },
  hours: { gap: 10, paddingHorizontal: 16, paddingVertical: 14, borderRadius: 18, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line },
  hourRow: { flexDirection: "row", justifyContent: "space-between" },
  hourLabel: { fontFamily: fontFamily.body, fontSize: 14, color: colors.ink },
  hourValue: { fontFamily: fontFamily.body, fontSize: 14, color: colors.stone },
  today: { fontFamily: fontFamily.bodySemiBold, color: colors.forest },
  closed: { color: colors.terracotta },
  topBar: { position: "absolute", left: 16, right: 16, flexDirection: "row", justifyContent: "space-between" },
});
