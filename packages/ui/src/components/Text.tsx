import { Text as RNText, StyleSheet, type TextProps as RNTextProps } from "react-native";

import { colors, type ColorName } from "../theme/colors";
import { typography, type TypographyVariant } from "../theme/typography";

export interface TextProps extends RNTextProps {
  variant?: TypographyVariant;
  color?: ColorName;
  align?: "left" | "center" | "right";
}

export function Text({ variant = "body", color = "text", align, style, ...rest }: TextProps) {
  // A style that changes fontSize without a lineHeight would keep the variant's smaller
  // lineHeight, and iOS then clips the top of the glyphs (e.g. the OTP digits, Vietnamese accents).
  const own = StyleSheet.flatten(style);
  const fitLineHeight =
    own?.fontSize !== undefined && own.lineHeight === undefined ? { lineHeight: Math.round(own.fontSize * 1.3) } : undefined;

  return (
    <RNText
      style={[typography[variant], { color: colors[color] }, align && { textAlign: align }, style, fitLineHeight]}
      {...rest}
    />
  );
}
