// Palette from the Figma "Relife" Foundations page. Keep in sync with theme.css.
export const palette = {
  deepForest: "#12241F",
  forest: "#1F3A32",
  champagne: "#C9A96E",
  goldSoft: "#EFE3CB",
  linen: "#F6F1E9",
  card: "#FFFDF9",
  ink: "#15201C",
  stone: "#7B756B",
  line: "#E4DCCE",
  terracotta: "#B5543C",
  success: "#2F7D5B",
  amber: "#B7822B",
  white: "#FFFFFF",
  /** Text on Forest buttons. */
  cream: "#F3ECDF",
  /** Placeholder text. */
  sand: "#A9A298",
  /** Inactive tab labels on Deep Forest. */
  sage: "#A7B5AF",
  successSoft: "#DDEFE5",
  amberSoft: "#F7EBD3",
  terracottaSoft: "#F6E3DC",
  stoneSoft: "#ECE4D6",
  /** Base colour of the map illustration. */
  mapBase: "#EAE6DA",
  mapBlock: "#DFDACB",
  mapPark: "#CFDCC4",
  /** Body text over dark photos (A04). */
  mist: "#D6CFC1",
  /** The "G" of the Google sign-in button. */
  googleBlue: "#4285F4",
  /** Extra store avatar backgrounds (A26). */
  cocoa: "#5E3219",
  caramel: "#86613F",
  /** Card, border and muted text on Deep Forest screens (A18). */
  forestCard: "#1B3029",
  forestLine: "#2C4A40",
  sageLight: "#B9C4BE",
  /** Background of a locked field (B08 price). */
  lockedField: "#EFE9DE",
  /** Soft text on the Success and Terracotta result screens (B13, B14). */
  successMist: "#D7EFE3",
  terracottaMist: "#F6DCD3",
  /** Darker Terracotta panel on B14. */
  terracottaDeep: "#9E4631",
  /** Positive change on Deep Forest (B17 "+18%"). */
  mint: "#9FD4B8",
  /** Storage chips on charity cards (C03, C04). */
  coolSoft: "#E3ECEE",
  cool: "#2E5B66",
} as const;

/** Semantic names used by components. Screens should prefer these. */
export const colors = {
  ...palette,
  primary: palette.forest,
  primaryPressed: palette.deepForest,
  onPrimary: palette.cream,
  accent: palette.champagne,
  background: palette.linen,
  surface: palette.card,
  border: palette.line,
  text: palette.ink,
  textSecondary: palette.stone,
  textDisabled: palette.sand,
  warning: palette.amber,
  danger: palette.terracotta,
  overlay: "rgba(18, 36, 31, 0.45)",
  scrim: "rgba(255, 255, 255, 0.92)",
} as const;

export type ColorName = keyof typeof colors;
