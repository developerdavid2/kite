import {
  borderRadius,
  fontSizes,
  fontWeights,
  spacing,
} from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import type { Unit } from "@/types/converter.types";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface UnitSelectorProps {
  label: string;
  unit: Unit;
  value: string;
  onUnitPress: () => void;
  onValueChange?: (value: string) => void;
  editable?: boolean;
}

export function UnitSelector({
  label,
  unit,
  value,
  onUnitPress,
  onValueChange,
  editable = true,
}: UnitSelectorProps) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: borderRadius.radiusLg,
        padding: spacing.space4,
        marginVertical: spacing.space2,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <Text
        style={{
          fontSize: fontSizes.sm,
          color: colors.textSecondary,
          marginBottom: spacing.space2,
          fontWeight: fontWeights.medium,
        }}
      >
        {label}
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.space3,
        }}
      >
        <TextInput
          style={{
            flex: 1,
            fontSize: fontSizes.xxl,
            fontWeight: fontWeights.semibold,
            color: colors.textPrimary,
            padding: 0,
            paddingTop: spacing.space1,
          }}
          placeholder="0"
          placeholderTextColor={colors.textMuted}
          keyboardType="decimal-pad"
          value={value}
          onChangeText={onValueChange}
          editable={editable}
        />

        <TouchableOpacity
          onPress={onUnitPress}
          style={{
            paddingHorizontal: spacing.space3,
            paddingVertical: spacing.space2,
            backgroundColor: colors.surfaceAlt,
            borderRadius: borderRadius.radiusMd,
            minWidth: 70,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: fontSizes.sm,
              fontWeight: fontWeights.semibold,
              color: colors.textPrimary,
            }}
          >
            {unit?.symbol || "Unit"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
