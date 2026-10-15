import { minutesUntil, type Review } from "@relife/shared";
import { Avatar, Button, Card, Chip, LoadingView, StarRating, Text, TextField, colors, fontFamily, spacing } from "@relife/ui";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useNow } from "@/lib/clock";

import { useReplyReview, useReviews } from "../hooks/useStoreAdmin";

function ago(iso: string, now: Date) {
  const minutes = -minutesUntil(iso, now);
  if (minutes < 60) return `${Math.max(1, minutes)} phút trước`;
  if (minutes < 60 * 24) return `${Math.floor(minutes / 60)} giờ trước`;
  return `${Math.floor(minutes / 1440)} ngày trước`;
}

/** B22 Reviews. */
export function ReviewsScreen() {
  const query = useReviews();
  const now = useNow(60_000);
  if (!query.data) return <LoadingView />;
  const { summary, reviews } = query.data;

  return (
    <Screen gap={12} header={<ScreenHeader title="Đánh giá" />}>
      <Card gap={10}>
        <View style={styles.summary}>
          <Text style={styles.big}>{summary.rating.toFixed(1)}</Text>
          <View style={styles.gap4}>
            <StarRating value={Math.round(summary.rating)} size={16} />
            <Text variant="caption" color="stone">
              {summary.count30d} đánh giá · 30 ngày
            </Text>
          </View>
        </View>
        <View style={styles.chips}>
          {summary.topTags.map((t) => (
            <Chip key={t.label} label={`${t.label} ${t.count}`} size="sm" />
          ))}
        </View>
      </Card>
      {reviews.map((r) => (
        <ReviewCard key={r.id} review={r} when={ago(r.createdAt, now)} />
      ))}
    </Screen>
  );
}

function ReviewCard({ review, when }: { review: Review; when: string }) {
  const reply = useReplyReview();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  return (
    <Card gap={10}>
      <View style={styles.head}>
        <Avatar name={review.customerName} size={36} tone="linen" />
        <View style={styles.flex}>
          <Text variant="bodyStrong" style={styles.name}>
            {review.customerName}
          </Text>
          <StarRating value={review.rating} size={12} gap={1} />
        </View>
        <Text style={styles.when}>{when}</Text>
      </View>
      <Text style={styles.text}>{review.text}</Text>
      {review.reply ? (
        <View style={styles.reply}>
          <Text variant="captionStrong" color="forest">
            Maison Bơ Sữa trả lời
          </Text>
          <Text variant="small" color="stone">
            {review.reply.text}
          </Text>
        </View>
      ) : open ? (
        <View style={styles.gap8}>
          <TextField value={text} onChangeText={setText} placeholder="Cảm ơn bạn đã ghé tiệm…" autoFocus />
          <Button
            title="Gửi trả lời"
            size="sm"
            fullWidth={false}
            disabled={text.trim().length < 2}
            loading={reply.isPending}
            onPress={() => reply.mutate({ reviewId: review.id, text }, { onSuccess: () => setOpen(false) })}
          />
        </View>
      ) : (
        <View style={styles.actions}>
          <Pressable accessibilityRole="button" onPress={() => setOpen(true)} hitSlop={8}>
            <Text variant="labelStrong" color="forest">
              Trả lời công khai
            </Text>
          </Pressable>
          <Text variant="label" color="stone">
            ·
          </Text>
          {/* TODO(S7): report a review to Relife (complaints collection). */}
          <Text variant="labelStrong" color="stone">
            Báo cáo
          </Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  summary: { flexDirection: "row", alignItems: "center", gap: 14 },
  big: { fontFamily: fontFamily.number, fontSize: 40, lineHeight: 48, letterSpacing: -0.8, color: colors.ink },
  name: { fontSize: 14, lineHeight: 18 },
  when: { fontFamily: fontFamily.body, fontSize: 11, color: colors.stone },
  text: { fontFamily: fontFamily.body, fontSize: 14, lineHeight: 20, color: colors.ink },
  gap4: { gap: 4 },
  gap8: { gap: 8 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  head: { flexDirection: "row", alignItems: "center", gap: 10 },
  flex: { flex: 1, gap: 3 },
  reply: { backgroundColor: colors.linen, borderRadius: 14, padding: 12, gap: 4 },
  actions: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
});
