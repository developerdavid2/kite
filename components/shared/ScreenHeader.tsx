import { fontSizes, fontWeights, layout } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  rightAction?: { icon: string; onPress: () => void };
  showBack?: boolean;
  onBack?: () => void;
}

export function ScreenHeader({
  title,
  subtitle,
  rightAction,
  showBack,
  onBack,
}: ScreenHeaderProps) {
  const { colors } = useTheme();

  return (
    <View
      className="flex-row items-center justify-between px-4 border-b border-blue-700"
      style={{
        height: layout.headerHeight,
        backgroundColor: colors.background,
      }}
    >
      <View className="flex-1">
        <Text
          className="text-xl font-semibold text-blue-50"
          style={{
            color: colors.textPrimary,
            fontSize: fontSizes.xl,
            fontWeight: fontWeights.semibold,
          }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            className="text-sm text-blue-300 mt-0.5"
            style={{
              color: colors.textSecondary,
              fontSize: fontSizes.sm,
              marginTop: 2,
            }}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {rightAction && (
        <TouchableOpacity
          onPress={rightAction.onPress}
          className="w-11 h-11 items-center justify-center rounded-lg"
          style={{
            backgroundColor: colors.surface,
          }}
        >
          <Ionicons
            name={rightAction.icon as any}
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>
      )}

      {showBack && !rightAction && (
        <TouchableOpacity
          onPress={onBack}
          className="w-11 h-11 items-center justify-center rounded-lg"
          style={{
            backgroundColor: colors.surface,
          }}
        >
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      )}
    </View>
  );
}
