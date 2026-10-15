import { formatTime } from "@relife/shared";
import { Button, Card, IconButton, LoadingView, SelectChip, StarRating, Text, colors, fontFamily, spacing } from "@relife/ui";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { BottomBar } from "@/components/BottomBar";
import { Photo } from "@/components/Photo";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { errorMessage } from "@/lib/queryClient";

import { reviewOptions } from "../api";
import { useOrder, useSubmitReview } from "../hooks/usePickup";

/** A24 Review: once per collected order. */
export function ReviewScreen({ orderId }: { orderId: string }) {
  const query = useOrder(orderId);
  const submit = useSubmitReview();
  const [rating, setRating] = useState(5);
  const [tags, setTags] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

  if (!query.data) return <LoadingView />;
  const order = query.data;

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.7 });
    // TODO(S7): upload review photos to Storage.
    if (!result.canceled && result.assets[0]) setPhoto(result.assets[0].uri);
  };

  return (
    <Screen
      header={
        <ScreenHeader
          leading="close"
          right={
            <Pressable accessibilityRole="button" onPress={() => router.back()} hitSlop={8}>
              <Text style={styles.skip}>Bỏ qua</Text>
            </Pressable>
          }
        />
      }
      footer={
        <BottomBar plain>
          {submit.isError && (
            <Text variant="caption" color="terracotta" align="center">
              {errorMessage(submit.error)}
            </Text>
          )}
          <Button
            title="Gửi đánh giá"
            loading={submit.isPending}
            onPress={() => submit.mutate({ orderId, rating, tags, text }, { onSuccess: () => router.back() })}
          />
        </BottomBar>
      }
    >
      <Photo photo={photo ?? order.bagPhoto} width={96} height={96} radius={28} style={styles.center} />
      <View style={styles.heading}>
        <Text style={styles.title}>Túi bánh hôm nay thế nào?</Text>
        <Text style={styles.subtitle}>
          {order.storeName}
          {order.collectedAt ? ` · Nhận lúc ${formatTime(order.collectedAt)}` : ""}
        </Text>
      </View>
      <View style={styles.center}>
        <StarRating value={rating} size={40} gap={10} onChange={setRating} />
      </View>
      <Text style={styles.ratingLabel}>{reviewOptions.ratingLabels[rating]}</Text>
      <View style={styles.chips}>
        {reviewOptions.tags.map((t) => (
          <SelectChip key={t} label={t} selected={tags.includes(t)} onPress={() => setTags(tags.includes(t) ? tags.filter((x) => x !== t) : [...tags, t])} />
        ))}
      </View>
      <Card variant="plain" padding={16} style={styles.inputCard}>
        <TextInput
          value={text}
          onChangeText={setText}
          multiline
          maxLength={500}
          placeholder="Thêm vài dòng cho tiệm (không bắt buộc)"
          placeholderTextColor={colors.sand}
          style={styles.input}
          accessibilityLabel="Nhận xét"
        />
      </Card>
      <Pressable accessibilityRole="button" style={styles.addPhoto} onPress={pickPhoto}>
        <IconButton name="camera" size={40} iconSize={18} variant="soft" accessibilityLabel="" />
        <Text style={styles.addPhotoText}>
          {photo ? "Đổi ảnh túi bánh" : "Thêm ảnh túi bánh"}
        </Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { alignSelf: "center" },
  heading: { gap: 8, marginTop: 2 },
  skip: { fontFamily: fontFamily.bodySemiBold, fontSize: 15, color: colors.stone },
  title: { fontFamily: fontFamily.heading, fontSize: 24, lineHeight: 32, color: colors.ink, textAlign: "center" },
  subtitle: { fontFamily: fontFamily.body, fontSize: 14, color: colors.stone, textAlign: "center" },
  ratingLabel: { fontFamily: fontFamily.bodySemiBold, fontSize: 15, color: colors.champagne, textAlign: "center" },
  inputCard: { borderRadius: 18, minHeight: 96 },
  addPhotoText: { fontFamily: fontFamily.bodySemiBold, fontSize: 14, color: colors.forest },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  input: { minHeight: 62, fontFamily: fontFamily.body, fontSize: 15, color: colors.ink, textAlignVertical: "top" },
  addPhoto: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: spacing.md },
});
