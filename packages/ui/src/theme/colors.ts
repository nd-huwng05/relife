// TODO: replace with the final palette from Figma.
export const colors = {
  primary: "#E4572E",
  primaryPressed: "#C8461F",
  onPrimary: "#FFFFFF",

  background: "#FFFAF5",
  surface: "#FFFFFF",
  border: "#E8E1DA",

  text: "#1F1B16",
  textSecondary: "#6B625A",
  textDisabled: "#B4ACA4",

  success: "#2E9E5B",
  warning: "#E0A100",
  danger: "#D64545",
} as const;

export type ColorName = keyof typeof colors;
