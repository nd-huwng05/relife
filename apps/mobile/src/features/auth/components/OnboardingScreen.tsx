import { formatVnd } from "@relife/shared";
import { Button, Icon, IconButton, PageDots, Text, colors, fontFamily, radius, shadows } from "@relife/ui";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Photo } from "@/components/Photo";

import { onboardingSlides } from "../api";
import { sessionStore } from "../store";
import { BrandWord } from "./BrandWord";

/** A02 Onboarding 1–3. */
export function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const slide = onboardingSlides[index];
  const last = index === onboardingSlides.length - 1;
  const finish = () => {
    sessionStore.markIntroSeen();
    router.replace("/location");
  };

  if (!slide) return null;
  return (
    <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
      <View style={styles.top}>
        <BrandWord color="forest" />
        <Pressable accessibilityRole="button" onPress={finish} hitSlop={10}>
          <Text style={styles.skip}>Bỏ qua</Text>
        </Pressable>
      </View>

      <Photo photo={slide.photo} height={400} radius={32} style={styles.photo}>
        {slide.price && (
          <View style={styles.price}>
            <Text style={styles.priceNow}>{formatVnd(slide.price.amount)}</Text>
            <Text style={styles.priceWas}>{formatVnd(slide.price.value)}</Text>
          </View>
        )}
        <View style={styles.chip}>
          <Icon name={slide.chip.icon} size={15} color="ink" />
          <Text style={styles.chipText}>{slide.chip.label}</Text>
        </View>
      </Photo>

      <View style={styles.dots}>
        <PageDots total={onboardingSlides.length} index={index} />
      </View>
      <Text style={styles.title}>{slide.title}</Text>
      <Text style={styles.body}>{slide.body}</Text>

      <View style={styles.flex} />
      {last ? (
        <Button title="Bắt đầu ngay" onPress={finish} />
      ) : (
        <View style={styles.nav}>
          <Text style={styles.step}>
            Bước {index + 1} / {onboardingSlides.length}
          </Text>
          <IconButton
            name="right"
            size={60}
            iconSize={27}
            variant="solid"
            style={shadows.card}
            onPress={() => setIndex(index + 1)}
            accessibilityLabel="Tiếp"
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.linen, paddingHorizontal: 24, paddingBottom: 20 },
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8, height: 20 },
  skip: { fontFamily: fontFamily.bodyMedium, fontSize: 15, color: colors.stone },
  photo: { marginTop: 22 },
  price: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: colors.forest,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  priceNow: { fontFamily: fontFamily.number, fontSize: 17, color: colors.cream },
  priceWas: { fontFamily: fontFamily.body, fontSize: 12, color: "rgba(243, 236, 223, 0.7)", textDecorationLine: "line-through" },
  chip: {
    position: "absolute",
    left: 16,
    bottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radius.full,
    backgroundColor: "rgba(255, 255, 255, 0.94)",
    ...shadows.card,
  },
  chipText: { fontFamily: fontFamily.bodySemiBold, fontSize: 13, color: colors.ink },
  dots: { marginTop: 36 },
  title: { fontFamily: fontFamily.heading, fontSize: 30, lineHeight: 38, color: colors.ink, marginTop: 23 },
  body: { fontFamily: fontFamily.body, fontSize: 15, lineHeight: 23, color: colors.stone, marginTop: 12, maxWidth: 330 },
  flex: { flex: 1 },
  nav: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  step: { fontFamily: fontFamily.bodyMedium, fontSize: 13, color: colors.stone },
});
