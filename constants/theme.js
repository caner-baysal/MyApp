export const colors = {
  background: "#FBF6EA",
  foreground: "#0D1F1A",
  card: "#FFFDF6",
  muted: "#EFE6D4",
  mutedForeground: "rgba(13, 31, 26, 0.6)",
  primary: "#0D1F1A",
  accent: "#2FC48D",
  accentDark: "#1B8F68",
  border: "rgba(13, 31, 26, 0.12)",
  success: "#16a34a",
  destructive: "#dc2626",
  subscription: "#DFF3E8",

  balance: "#6F8F78",
  tabBar: "#071E18",
  upcomingCard: "#FFF8E7",
  subscriptionCard: "#F3E7C8",
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