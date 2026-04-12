import { fontSizes, fontWeights, spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { Text, View } from "react-native";

type CardSize = "sm" | "md" | "lg";

interface ResultCardProps {
  label: string;
  value: string;
  unit?: string;
  accent?: boolean;
  size?: CardSize;
}

const sizes: Record<
  CardSize,
  { valueFontSize: number; labelFontSize: number }
> = {
  sm: { valueFontSize: fontSizes.lg, labelFontSize: fontSizes.xs },
  md: { valueFontSize: fontSizes.xxl, labelFontSize: fontSizes.sm },
  lg: { valueFontSize: fontSizes.display, labelFontSize: fontSizes.md },
};

export function ResultCard({
  label,
  value,
  unit,
  accent = false,
  size = "md",
}: ResultCardProps) {
  const { colors } = useTheme();
  const sizeConfig = sizes[size];

  const bgColor = accent ? colors.primary : colors.surface;
  const borderColor = accent ? colors.primary : colors.border;
  const labelColor = accent ? "#E0E7FF" : colors.textSecondary;
  const valueColor = accent ? "#FFFFFF" : colors.textPrimary;

  return (
    <View
      className="bg-blue-800 rounded-2xl p-4 border border-blue-700"
      style={{
        backgroundColor: bgColor,
        borderColor,
      }}
    >
      <Text
        className="text-xs text-blue-300 uppercase tracking-wider mb-1"
        style={{
          color: labelColor,
          fontSize: sizeConfig.labelFontSize,
          fontWeight: fontWeights.medium,
          letterSpacing: 0.5,
        }}
      >
        {label}
      </Text>

      <View className="flex-row items-baseline">
        <Text
          className="text-2xl font-jakarta text-blue-50"
          style={{
            color: valueColor,
            fontSize: sizeConfig.valueFontSize,
            fontWeight: fontWeights.bold,
          }}
        >
          {value}
        </Text>
        {unit && (
          <Text
            className="text-sm text-blue-300 ml-1"
            style={{
              color: labelColor,
              fontSize: fontSizes.sm,
              marginLeft: spacing.space1,
            }}
          >
            {unit}
          </Text>
        )}
      </View>
    </View>
  );
}
