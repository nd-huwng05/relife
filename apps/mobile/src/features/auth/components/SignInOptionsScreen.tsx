import { Icon, Text, colors, fontFamily } from "@relife/ui";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Photo } from "@/components/Photo";
import { errorMessage } from "@/lib/queryClient";

import { useGoogleSignIn } from "../hooks/useAuthActions";
import { sessionStore } from "../store";
import { BrandWord } from "./BrandWord";

/** A04 Sign In Options. */
export function SignInOptionsScreen() {
  const insets = useSafeAreaInsets();
  const google = useGoogleSignIn();

  return (
    <View style={styles.root}>
      <View style={styles.hero}>
        <Photo photo="bakery-interior" height={500} radius={0} style={StyleSheet.absoluteFill} />
        <LinearGradient colors={["rgba(18,36,31,0.15)", colors.deepForest]} style={StyleSheet.absoluteFill} />
        <View style={[styles.brand, { top: insets.top + 8 }]}>
          <BrandWord color="cream" />
        </View>
        <View style={styles.heroText}>
          <Text style={styles.headline}>{"Bánh ngon cuối ngày,\ngiá dễ thương."}</Text>
          <Text style={styles.sub}>Giải cứu những mẻ bánh còn tươi từ tiệm quanh bạn.</Text>
        </View>
      </View>

      <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Text style={styles.sheetTitle}>Đăng nhập để tiếp tục</Text>
        <Text style={styles.sheetSub}>Chỉ mất vài giây, không cần mật khẩu.</Text>

        <Pressable
          accessibilityRole="button"
          disabled={google.isPending}
          onPress={() => google.mutate(undefined, { onSuccess: () => router.push("/profile-setup") })}
          style={({ pressed }) => [styles.btn, styles.google, pressed && styles.pressed]}
        >
          {google.isPending ? (
            <ActivityIndicator color={colors.forest} />
          ) : (
            <>
              <Text style={styles.g}>G</Text>
              <Text style={styles.googleText}>Tiếp tục với Google</Text>
            </>
          )}
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/phone")}
          style={({ pressed }) => [styles.btn, styles.phone, pressed && styles.pressed]}
        >
          <Icon name="phone" size={20} color="cream" />
          <Text style={styles.phoneText}>Tiếp tục với số điện thoại</Text>
        </Pressable>
        {google.isError && <Text style={styles.error}>{errorMessage(google.error)}</Text>}

        <Pressable accessibilityRole="button" style={styles.guest} onPress={() => sessionStore.continueAsGuest()} hitSlop={8}>
          <Text style={styles.guestText}>Xem trước, đăng nhập sau</Text>
          <Icon name="right" size={16} color="forest" />
        </Pressable>
        <Text style={styles.terms}>
          Bằng việc tiếp tục, bạn đồng ý với Điều khoản sử dụng và Chính sách quyền riêng tư của Relife.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.deepForest },
  hero: { height: 500 },
  brand: { position: "absolute", left: 24 },
  heroText: { position: "absolute", left: 24, right: 24, top: 318, gap: 8 },
  headline: { fontFamily: fontFamily.heading, fontSize: 34, lineHeight: 42, color: colors.cream },
  sub: { fontFamily: fontFamily.body, fontSize: 15, lineHeight: 22, color: colors.mist, maxWidth: 320 },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 470,
    backgroundColor: colors.linen,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  sheetTitle: { fontFamily: fontFamily.bodySemiBold, fontSize: 19, color: colors.ink },
  sheetSub: { fontFamily: fontFamily.body, fontSize: 14, color: colors.stone, marginTop: 7 },
  btn: { height: 56, borderRadius: 28, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  google: { marginTop: 25, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line },
  g: { fontFamily: fontFamily.number, fontSize: 19, color: colors.googleBlue },
  googleText: { fontFamily: fontFamily.bodySemiBold, fontSize: 16, color: colors.ink },
  phone: { marginTop: 12, backgroundColor: colors.forest },
  phoneText: { fontFamily: fontFamily.bodySemiBold, fontSize: 16, color: colors.cream },
  pressed: { opacity: 0.85 },
  error: { fontFamily: fontFamily.body, fontSize: 12, color: colors.terracotta, textAlign: "center", marginTop: 8 },
  guest: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 22 },
  guestText: { fontFamily: fontFamily.bodySemiBold, fontSize: 15, color: colors.forest },
  terms: { fontFamily: fontFamily.body, fontSize: 12, lineHeight: 18, color: colors.stone, textAlign: "center", marginTop: 24, paddingHorizontal: 22 },
});
