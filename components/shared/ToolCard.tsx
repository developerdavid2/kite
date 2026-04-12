import { fontSizes, fontWeights } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface ToolCardProps {
  title: string;
  description: string;
  icon: string;
  accentColor?: string;
}

export function ToolCard({
  title,
  description,
  icon,
  accentColor,
}: ToolCardProps) {
  const { colors } = useTheme();

  return (
    <View
      className="bg-blue-800 border border-blue-700 rounded-2xl p-5"
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
      }}
    >
      <View className="flex-row items-start mb-3">
        <View
          className="w-12 h-12 rounded-xl bg-blue-700 items-center justify-center mr-3"
          style={{
            backgroundColor: colors.surfaceAlt,
          }}
        >
          <Ionicons
            name={icon as any}
            size={28}
            color={accentColor || colors.primary}
          />
        </View>

        <View className="flex-1">
          <Text
            className="text-base font-semibold text-blue-50 mb-1"
            style={{
              color: colors.textPrimary,
              fontSize: fontSizes.md,
              fontWeight: fontWeights.semibold,
            }}
          >
            {title}
          </Text>
          <Text
            className="text-sm text-blue-300"
            style={{
              color: colors.textSecondary,
              fontSize: fontSizes.sm,
              lineHeight: 20,
            }}
          >
            {description}
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color={colors.primary}
          style={{ alignSelf: "center" }}
        />
      </View>
    </View>
  );
}
