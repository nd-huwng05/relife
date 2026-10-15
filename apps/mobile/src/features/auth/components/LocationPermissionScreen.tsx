import { Button, Icon, Text, colors, fontFamily } from "@relife/ui";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { requestLocationPermission } from "@/lib/location";

import { LocationIllustration } from "./LocationIllustration";

/** A03 Location Permission. */
export function LocationPermissionScreen() {
  const next = () => router.replace("/login");
  const allow = async () => {
    // Denied is fine: the app falls back to "Tự chọn khu vực".
    await requestLocationPermission().catch(() => false);
    next();
  };

  return (
    <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
      <LocationIllustration style={styles.map} />
      <Text style={styles.title}>{"Tìm bánh ngon\nngay quanh bạn"}</Text>
      <Text style={styles.body}>Relife chỉ dùng vị trí để hiện túi bánh gần bạn và khoảng cách tới từng tiệm.</Text>
      <View style={styles.note}>
        <Icon name="lock" size={18} color="ink" />
        <Text style={styles.noteText}>Vị trí không được chia sẻ với tiệm và không lưu thành lịch sử.</Text>
      </View>
      <View style={styles.flex} />
      <Button title="Cho phép truy cập vị trí" icon="nav" onPress={allow} />
      <Button title="Tự chọn khu vực" variant="outline" onPress={next} style={styles.second} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.linen, paddingHorizontal: 24, paddingBottom: 6 },
  map: { marginTop: 26 },
  title: { fontFamily: fontFamily.heading, fontSize: 30, lineHeight: 38, color: colors.ink, marginTop: 30 },
  body: { fontFamily: fontFamily.body, fontSize: 15, lineHeight: 23, color: colors.stone, marginTop: 12, maxWidth: 340 },
  note: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "rgba(239, 227, 203, 0.6)",
  },
  noteText: { flex: 1, fontFamily: fontFamily.body, fontSize: 13, lineHeight: 19, color: colors.ink },
  flex: { flex: 1, minHeight: 16 },
  second: { marginTop: 10 },
});
