import { Icon, LoadingView, SegmentedControl, StateView, Text, colors, fontFamily } from "@relife/ui";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { Screen } from "@/components/Screen";
import { BagRow, formatKm, useToggleFollowStore, useToggleSaveBag } from "@/features/bags";

import { useSaved } from "../hooks/useDiscover";

/** Store avatars cycle through these backgrounds, as in the A26 frame. */
const AVATAR_COLORS = [colors.forest, colors.cocoa, colors.caramel] as const;

/** A26 Saved And Following. */
export function SavedScreen() {
  const [tab, setTab] = useState<"stores" | "bags">("stores");
  const query = useSaved();
  const unfollow = useToggleFollowStore();
  const unsave = useToggleSaveBag();
  const stores = query.data?.stores ?? [];
  const bags = query.data?.bags ?? [];

  return (
    <Screen withTabBar gap={14} refreshing={query.isRefetching} onRefresh={() => query.refetch()}>
      <Text style={styles.title}>Đã lưu</Text>
      <SegmentedControl
        value={tab}
        onChange={setTab}
        options={[
          { key: "stores", label: `Tiệm theo dõi · ${stores.length}` },
          { key: "bags", label: `Túi đã lưu · ${bags.length}` },
        ]}
      />
      {query.isPending ? (
        <LoadingView />
      ) : tab === "stores" ? (
        stores.length === 0 ? (
          <StateView icon="bell" title="Chưa theo dõi tiệm nào" message="Theo dõi tiệm để biết khi họ đăng túi mới." />
        ) : (
          <>
            {stores.map((s, i) => (
              <Pressable
                key={s.id}
                accessibilityRole="button"
                accessibilityLabel={s.name}
                onPress={() => router.push(`/store/${s.id}`)}
                style={styles.card}
              >
                <View style={[styles.avatar, { backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] }]}>
                  <Text style={styles.initial}>{s.name.charAt(0)}</Text>
                </View>
                <View style={styles.flex}>
                  <Text style={styles.name} numberOfLines={1}>
                    {s.name}
                  </Text>
                  <Text style={styles.meta} numberOfLines={1}>
                    {s.category} · {formatKm(s.distanceKm)}
                  </Text>
                  <View style={styles.inline}>
                    <Icon name="clock" size={14} color="champagne" />
                    <Text style={styles.usual}>Thường đăng lúc {s.usualPostTime}</Text>
                  </View>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Bỏ theo dõi ${s.name}`}
                  onPress={() => unfollow.mutate(s.id)}
                  hitSlop={6}
                  style={styles.bell}
                >
                  <Icon name="bell" size={20} color="ink" />
                </Pressable>
              </Pressable>
            ))}
            <View style={styles.note}>
              <Icon name="bell" size={16} color="stone" />
              <Text style={styles.noteText}>Bật chuông để nhận thông báo khi tiệm đăng túi mới.</Text>
            </View>
          </>
        )
      ) : bags.length === 0 ? (
        <StateView icon="heart" title="Chưa lưu túi nào" message="Nhấn trái tim trên túi bánh để lưu lại." />
      ) : (
        bags.map((b) => (
          <BagRow
            key={b.id}
            bag={b}
            onPress={() => router.push(`/bag/${b.id}`)}
            right={
              <Pressable accessibilityRole="button" accessibilityLabel="Bỏ lưu" onPress={() => unsave.mutate(b.id)} hitSlop={8}>
                <Icon name="heart" size={20} color="terracotta" filled />
              </Pressable>
            }
          />
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fontFamily.heading, fontSize: 30, lineHeight: 40, color: colors.ink, marginTop: 2 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
  },
  avatar: { width: 52, height: 52, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  initial: { fontFamily: fontFamily.heading, fontSize: 20, color: colors.champagne },
  flex: { flex: 1, gap: 3 },
  name: { fontFamily: fontFamily.bodySemiBold, fontSize: 15, color: colors.ink },
  meta: { fontFamily: fontFamily.body, fontSize: 13, color: colors.stone },
  inline: { flexDirection: "row", alignItems: "center", gap: 4 },
  usual: { fontFamily: fontFamily.bodyMedium, fontSize: 12, color: colors.champagne },
  bell: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.goldSoft, alignItems: "center", justifyContent: "center" },
  note: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  noteText: { flex: 1, fontFamily: fontFamily.body, fontSize: 13, color: colors.stone },
});
