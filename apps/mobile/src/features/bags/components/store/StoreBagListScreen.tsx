import { BAG_STATUS, formatVnd, formatWindow } from "@relife/shared";
import { Card, Icon, IconButton, LoadingView, ProgressBar, SegmentedControl, StateView, Text, Toggle, colors, fontFamily } from "@relife/ui";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { Photo } from "@/components/Photo";
import { Screen } from "@/components/Screen";
import { errorMessage } from "@/lib/queryClient";

import { bagFormOptions, type MyBag } from "../../api";
import { useMyBags, useResumeBag } from "../../hooks/useBags";
import { BagStatusBadge } from "./BagStatusBadge";

type Tab = "live" | "draft" | "soldout" | "history";

const inTab = (b: MyBag, tab: Tab) =>
  tab === "live"
    ? b.status === BAG_STATUS.LIVE || b.status === BAG_STATUS.PAUSED
    : tab === "draft"
      ? b.status === BAG_STATUS.DRAFT
      : tab === "soldout"
        ? b.status === BAG_STATUS.SOLD_OUT
        : b.status === BAG_STATUS.ENDED;

/** B05 Bag List with the quick on/off toggle (B09 opens when switching off). */
export function StoreBagListScreen() {
  const [tab, setTab] = useState<Tab>("live");
  const query = useMyBags();
  const resume = useResumeBag();
  const bags = query.data ?? [];
  const liveCount = bags.filter((b) => inTab(b, "live")).length;
  const shown = bags.filter((b) => inTab(b, tab));

  return (
    <Screen withTabBar gap={12} refreshing={query.isRefetching} onRefresh={() => query.refetch()}>
      <View style={styles.header}>
        <Text style={styles.title}>Túi bánh</Text>
        <IconButton name="plus" variant="solid" iconSize={20} onPress={() => router.push("/bags/new")} accessibilityLabel="Tạo túi bánh" />
      </View>
      <SegmentedControl
        value={tab}
        onChange={setTab}
        options={[
          { key: "live", label: `Đang bán · ${liveCount}` },
          { key: "draft", label: "Nháp" },
          { key: "soldout", label: "Hết hàng" },
          { key: "history", label: "Lịch sử" },
        ]}
      />
      {query.isPending ? (
        <LoadingView />
      ) : query.isError ? (
        <StateView icon="alert" title="Không tải được túi bánh" message={errorMessage(query.error)} actionLabel="Thử lại" onAction={() => query.refetch()} />
      ) : shown.length === 0 ? (
        <StateView
          icon="package"
          title="Chưa có túi nào"
          message={tab === "live" ? "Đăng túi đầu tiên của hôm nay để khách kịp đặt." : "Mục này đang trống."}
          actionLabel={tab === "live" ? "Đăng lại như hôm qua" : undefined}
          onAction={() => router.push("/bags/repost")}
        />
      ) : (
        shown.map((b) => (
          <Card key={b.id} gap={12} onPress={() => router.push(`/bags/${b.id}/edit`)} accessibilityLabel={`Sửa ${b.title}`}>
            <View style={styles.row}>
              <Photo photo={b.photos[0]} width={56} height={56} radius={14} />
              <View style={styles.text}>
                <Text variant="bodyStrong" numberOfLines={1}>
                  {b.title}
                </Text>
                <View style={styles.inline}>
                  <BagStatusBadge status={b.status} />
                  <Text variant="label" color="forest" style={styles.num}>
                    {formatVnd(b.price)}
                  </Text>
                </View>
              </View>
              {(b.status === BAG_STATUS.LIVE || b.status === BAG_STATUS.PAUSED) && (
                <Toggle
                  value={b.status === BAG_STATUS.LIVE}
                  onValueChange={(on) => (on ? resume.mutate(b.id) : router.push(`/bags/${b.id}/pause`))}
                  accessibilityLabel={`Bật tắt ${b.title}`}
                />
              )}
            </View>
            <View style={styles.progressText}>
              <Text variant="captionStrong" color="ink">
                Đã bán {b.sold} / {b.stock}
              </Text>
              <Text variant="caption" color="stone">
                {formatWindow(b.pickupStart, b.pickupEnd)}
              </Text>
            </View>
            <ProgressBar value={b.stock ? b.sold / b.stock : 0} />
          </Card>
        ))
      )}
      {tab === "live" && shown.length > 0 && (
        <View style={styles.insight}>
          <Icon name="chart" size={18} color="ink" />
          <Text style={styles.insightText}>{bagFormOptions.insight}</Text>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: -4, marginBottom: 4 },
  title: { fontFamily: fontFamily.heading, fontSize: 30, lineHeight: 40, color: colors.ink },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  text: { flex: 1, gap: 4 },
  inline: { flexDirection: "row", alignItems: "center", gap: 8 },
  num: { fontFamily: fontFamily.bodySemiBold },
  insight: { flexDirection: "row", gap: 10, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 16, backgroundColor: "rgba(239, 227, 203, 0.7)" },
  insightText: { flex: 1, fontFamily: fontFamily.body, fontSize: 13, lineHeight: 19, color: colors.ink },
  progressText: { flexDirection: "row", justifyContent: "space-between", marginBottom: -4 },
});
