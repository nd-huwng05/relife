import { Text as RNText, type TextProps as RNTextProps } from "react-native";

import { colors, type ColorName } from "../theme/colors";
import { typography, type TypographyVariant } from "../theme/typography";

export interface TextProps extends RNTextProps {
  variant?: TypographyVariant;
  color?: ColorName;
}

export function Text({ variant = "body", color = "text", style, ...rest }: TextProps) {
  return <RNText style={[typography[variant], { color: colors[color] }, style]} {...rest} />;
}
