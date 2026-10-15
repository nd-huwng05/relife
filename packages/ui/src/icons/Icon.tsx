import Svg, { G, Path } from "react-native-svg";

import { colors, type ColorName } from "../theme/colors";
import { ICON_PATHS, type IconName } from "./paths";

const BOX = 21.6;

export interface IconProps {
  name: IconName;
  /** Rendered width and height in points. Figma uses 14 to 27 depending on context. */
  size?: number;
  color?: ColorName;
  /** Fill the shape too, e.g. a solid star for ratings or a liked heart. */
  filled?: boolean;
}

/** Simple Design System icon as drawn in the Figma file (Feather style, 1.8 stroke at 21.6). */
export function Icon({ name, size = 20, color = "text", filled = false }: IconProps) {
  const icon = ICON_PATHS[name];
  const tint = colors[color];
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${BOX} ${BOX}`} fill="none">
      <G transform={`translate(${icon.tx} ${icon.ty})`}>
        <Path
          d={icon.d}
          stroke={tint}
          strokeWidth={icon.strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={filled ? tint : "none"}
        />
      </G>
    </Svg>
  );
}

export type { IconName };
