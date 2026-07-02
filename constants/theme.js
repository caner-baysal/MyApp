export const colors = {
  background: "#F6F8F5",
  foreground: "#0D1F1A",
  card: "#FFFFFF",
  muted: "#E8EFEA",
  mutedForeground: "rgba(13, 31, 26, 0.6)",
  primary: "#0D1F1A",
  accent: "#38D39F",
  accentDark: "#1BAE7A",
  border: "rgba(13, 31, 26, 0.12)",
  success: "#16A34A",
  destructive: "#DC2626",
  subscription: "#D9FBEA",
};

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  18: 72,
  20: 80,
  24: 96,
  30: 120,
};

export const components = {
  tabBar: {
    height: spacing[18],
    horizontalInset: spacing[5],
    radius: spacing[8],
    iconFrame: spacing[12],
    itemPaddingVertical: spacing[2],
  },
};

export const theme = {
  colors,
  spacing,
  components,
};