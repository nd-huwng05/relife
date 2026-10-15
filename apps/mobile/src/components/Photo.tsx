import { colors } from "@relife/ui";
import { Image } from "expo-image";
import type { ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { photoSource } from "@/lib/photos";

interface PhotoProps {
  photo: string | null | undefined;
  width?: number | `${number}%`;
  height: number;
  radius?: number;
  /** Overlays such as chips and buttons placed over the photo. */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Rounded cover photo with optional overlay content. */
export function Photo({ photo, width = "100%", height, radius = 16, children, style }: PhotoProps) {
  return (
    <View style={[styles.wrap, { width, height, borderRadius: radius }, style]}>
      <Image source={photoSource(photo)} style={StyleSheet.absoluteFill} contentFit="cover" transition={150} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { overflow: "hidden", backgroundColor: colors.stoneSoft },
});
