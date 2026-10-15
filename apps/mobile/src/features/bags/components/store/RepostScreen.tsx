import { formatVnd } from "@relife/shared";
import { Button, Card, Icon, LoadingView, StateView, StatusBadge, Stepper, Text, colors, fontFamily } from "@relife/ui";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { BottomBar } from "@/components/BottomBar";
import { Photo } from "@/components/Photo";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { newIdempotencyKey } from "@/lib/functions";
import { errorMessage } from "@/lib/queryClient";

import { useRepostTemplates, useTemplates } from "../../hooks/useBags";

/** B07 Repost From Template: "Đăng lại như hôm qua". */
export function RepostScreen() {
  const query = useTemplates();
  const repost = useRepostTemplates();
  const [picked, setPicked] = useState<Record<string, number>>({});
  const [unpicked, setUnpicked] = useState<string[]>([]);
  const [idempotencyKey] = useState(newIdempotencyKey);

  const templates = query.data ?? [];
  const open = templates.filter((t) => !t.postedToday);
  const qty = (id: string, fallback: number) => picked[id] ?? fallback;
  const selected = open.filter((t) => !unpicked.includes(t.id));

  return (
    <Screen
      gap={12}
      header={<ScreenHeader title="Đăng lại như hôm qua" />}
      footer={
        <BottomBar plain>
          {repost.isError && (
            <Text variant="caption" color="terracotta" align="center">
              {errorMessage(repost.error)}
            </Text>
          )}
          <Button
            title={`Đăng ${selected.length} túi ngay`}
            icon="refresh"
            disabled={selected.length === 0}
            loading={repost.isPending}
            onPress={() =>
              repost.mutate(
                { items: selected.map((t) => ({ templateId: t.id, stock: qty(t.id, t.defaultStock) })), idempotencyKey },
                { onSuccess: () => router.back() },
              )
            }
          />
        </BottomBar>
      }
    >
      <Text style={styles.intro}>Một chạm là xong. Số lượng và giá lấy từ lần đăng gần nhất.</Text>
      {query.isPending ? (
        <LoadingView />
      ) : query.isError ? (
        <StateView icon="alert" title="Không tải được mẫu túi" actionLabel="Thử lại" onAction={() => query.refetch()} />
      ) : (
        templates.map((t) => {
          const on = !t.postedToday && !unpicked.includes(t.id);
          return (
            <Card key={t.id} gap={12} style={[on && styles.on, t.postedToday && styles.done]}>
              <View style={styles.row}>
                <Photo photo={t.photo} width={56} height={56} radius={14} />
                <View style={styles.text}>
                  <Text variant="bodyStrong" numberOfLines={1}>
                    {t.title}
                  </Text>
                  <Text variant="caption" color="stone">
                    {formatVnd(t.price)} · {t.pickupStart} – {t.pickupEnd}
                  </Text>
                </View>
                {t.postedToday ? (
                  <StatusBadge label="Đã đăng hôm nay" tone="success" />
                ) : (
                  <Pressable
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: on }}
                    onPress={() => setUnpicked(on ? [...unpicked, t.id] : unpicked.filter((x) => x !== t.id))}
                  >
                    <View style={[styles.check, on ? styles.checkOn : styles.checkOff]}>{on && <Icon name="check" size={14} color="cream" />}</View>
                  </Pressable>
                )}
              </View>
              {!t.postedToday && (
                <>
                  <View style={styles.qty}>
                    <Text style={styles.qtyLabel}>Số lượng hôm nay</Text>
                    <Stepper
                      value={qty(t.id, t.defaultStock)}
                      onChange={(n) => setPicked({ ...picked, [t.id]: n })}
                      min={1}
                      max={50}
                      size={38}
                      label={`số lượng ${t.title}`}
                    />
                  </View>
                </>
              )}
            </Card>
          );
        })
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  text: { flex: 1, gap: 3 },
  qty: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  intro: { fontFamily: fontFamily.body, fontSize: 14, lineHeight: 20, color: colors.stone, marginBottom: 2 },
  on: { borderColor: colors.forest },
  done: { opacity: 0.6 },
  check: { width: 26, height: 26, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  checkOn: { backgroundColor: colors.forest },
  checkOff: { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.line },
  qtyLabel: { fontFamily: fontFamily.body, fontSize: 13, color: colors.stone },
});
