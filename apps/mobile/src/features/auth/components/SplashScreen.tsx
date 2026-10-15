import { colors, fontFamily } from "@relife/ui";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { sessionStore } from "../store";

/** A01 Splash: brand mark, then onboarding. The spinner only shows if start-up takes over 2 seconds. */
export function SplashScreen() {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const spinner = setTimeout(() => setSlow(true), 2000);
    const seen = sessionStore.get().introSeen;
    const next = setTimeout(() => router.replace(seen ? "/login" : "/onboarding"), seen ? 0 : 1400);
    return () => {
      clearTimeout(spinner);
      clearTimeout(next);
    };
  }, []);

  return (
    <View style={styles.root}>
      <View style={styles.center}>
        <View style={styles.ring}>
          <Text style={styles.letter}>R</Text>
        </View>
        <Text style={styles.word}>RELIFE</Text>
        <Text style={styles.tagline}>{"BÁNH NGON  ·  CƠ HỘI THỨ HAI"}</Text>
      </View>
      <View style={styles.spinner}>{slow && <ActivityIndicator color={colors.champagne} />}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.deepForest, alignItems: "center", justifyContent: "center" },
  center: { alignItems: "center", marginTop: -20 },
  ring: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 1.5,
    borderColor: colors.champagne,
    alignItems: "center",
    justifyContent: "center",
  },
  letter: { fontFamily: fontFamily.heading, fontSize: 52, lineHeight: 64, color: colors.champagne, marginTop: -2 },
  word: { fontFamily: fontFamily.heading, fontSize: 30, letterSpacing: 7.8, color: colors.cream, marginTop: 30, marginRight: -7.8 },
  tagline: { fontFamily: fontFamily.bodyMedium, fontSize: 11, letterSpacing: 2.42, color: colors.champagne, marginTop: 8 },
  spinner: { position: "absolute", bottom: 110, height: 22 },
});
