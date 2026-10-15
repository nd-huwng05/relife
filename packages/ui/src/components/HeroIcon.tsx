import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { Icon, type IconName } from "../icons";
import { colors, type ColorName } from "../theme/colors";

type HeroTone = "success" | "forest" | "soft" | "danger" | "warning";

const TONES: Record<HeroTone, { bg: string; fg: ColorName; halo: string }> = {
  success: { bg: colors.success, fg: "white", halo: colors.successSoft },
  forest: { bg: colors.forest, fg: "cream", halo: colors.goldSoft },
  soft: { bg: colors.goldSoft, fg: "forest", halo: "transparent" },
  danger: { bg: colors.terracottaSoft, fg: "terracotta", halo: "transparent" },
  warning: { bg: colors.amberSoft, fg: "amber", halo: "transparent" },
};

export interface HeroIconProps {
  name: IconName;
  size?: number;
  tone?: HeroTone;
  /** Soft ring around the circle, as on the success screens. */
  halo?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Large round status icon at the top of result screens. */
export function HeroIcon({ name, size = 96, tone = "soft", halo = false, style }: HeroIconProps) {
  const t = TONES[tone];
  const circle = (
    <View style={[styles.center, { width: size, height: size, borderRadius: size / 2, backgroundColor: t.bg }]}>
      <Icon name={name} size={Math.round(size * 0.42)} color={t.fg} />
    </View>
  );
  if (!halo) return <View style={[styles.wrap, style]}>{circle}</View>;
  const outer = size * 1.6;
  return (
    <View style={[styles.wrap, style]}>
      <View style={[styles.center, { width: outer, height: outer, borderRadius: outer / 2, backgroundColor: t.halo }]}>{circle}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: "center" },
  center: { alignItems: "center", justifyContent: "center" },
});
