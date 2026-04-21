const blueScale = {
  50: "#E8F4FD",
  100: "#BAD9F5",
  200: "#7BB8EA",
  300: "#4A9FE0",
  400: "#2185D5",
  500: "#0366A1",
  600: "#144F8A",
  700: "#0D3460",
  800: "#081E3A",
  900: "#040F1E",
};

const semantic = {
  danger: "#EF4444",
  success: "#22C55E",
  warning: "#F59E0B",
  info: "#3B82F6",
};

export const Colors = {
  light: {
    ...blueScale,
    background: "#ebf0f1",
    surface: "#F9FAFB",
    surfaceAlt: "#F3F4F6",
    border: "#E5E7EB",
    textPrimary: "#111827",
    textSecondary: "#4B5563",
    textMuted: "#9CA3AF",
    primary: blueScale[500],
    primaryDark: blueScale[600],
  },
  dark: {
    ...blueScale,
    background: "#0F172A",
    surface: "#1E293B",
    surfaceAlt: "#334155",
    border: "#475569",
    textPrimary: "#F1F5F9",
    textSecondary: "#CBD5E1",
    textMuted: "#94A3B8",
    primary: blueScale[400],
    primaryDark: blueScale[300],
  },
  semantic,
};

export type ColorScheme = "light" | "dark";
export type ColorTokens = typeof Colors.light;
