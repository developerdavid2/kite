import {
  borderRadius,
  fontSizes,
  fontWeights,
  spacing,
} from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface TipSelectorProps {
  tipPercentage: number;
  customTipPercentage: string;
  onTipSelect: (percentage: number) => void;
  onCustomTipChange: (percentage: string) => void;
}

const TIP_OPTIONS = [0, 10, 15, 20];

export function TipSelector({
  tipPercentage,
  customTipPercentage,
  onTipSelect,
  onCustomTipChange,
}: TipSelectorProps) {
  const { colors } = useTheme();
  const isCustomSelected = !TIP_OPTIONS.includes(tipPercentage);

  return (
    <View style={{ marginVertical: spacing.space4 }}>
      <Text
        style={{
          fontSize: fontSizes.sm,
          fontWeight: fontWeights.semibold,
          color: colors.textSecondary,
          marginBottom: spacing.space3,
          marginLeft: spacing.space4,
        }}
      >
        Tip
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: spacing.space4,
          gap: spacing.space2,
        }}
      >
        {TIP_OPTIONS.map((percentage) => {
          const isSelected = tipPercentage === percentage && !isCustomSelected;

          return (
            <TouchableOpacity
              key={percentage}
              onPress={() => onTipSelect(percentage)}
              style={{
                paddingHorizontal: spacing.space3,
                paddingVertical: spacing.space2,
                borderRadius: borderRadius.radiusFull,
                backgroundColor: isSelected
                  ? colors.primary
                  : colors.surfaceAlt,
                borderWidth: 1,
                borderColor: isSelected ? colors.primary : colors.border,
                minWidth: 70,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: fontSizes.md,
                  fontWeight: fontWeights.semibold,
                  color: isSelected ? "#FFFFFF" : colors.textPrimary,
                }}
              >
                {percentage}%
              </Text>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          onPress={() => onTipSelect(parseFloat(customTipPercentage) || 0)}
          style={{
            paddingHorizontal: spacing.space3,
            paddingVertical: spacing.space2,
            borderRadius: borderRadius.radiusFull,
            backgroundColor: isCustomSelected
              ? colors.primary
              : colors.surfaceAlt,
            borderWidth: 1,
            borderColor: isCustomSelected ? colors.primary : colors.border,
            minWidth: 70,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: fontSizes.md,
              fontWeight: fontWeights.semibold,
              color: isCustomSelected ? "#FFFFFF" : colors.textPrimary,
            }}
          >
            Custom
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {isCustomSelected && (
        <View
          style={{
            marginHorizontal: spacing.space4,
            marginTop: spacing.space3,
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.space2,
          }}
        >
          <Text
            style={{
              fontSize: fontSizes.md,
              fontWeight: fontWeights.medium,
              color: colors.textSecondary,
            }}
          >
            %
          </Text>
          <TextInput
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: borderRadius.radiusMd,
              paddingHorizontal: spacing.space3,
              paddingVertical: spacing.space2,
              fontSize: fontSizes.md,
              color: colors.textPrimary,
            }}
            placeholder="Enter percentage"
            placeholderTextColor={colors.textMuted}
            keyboardType="decimal-pad"
            value={customTipPercentage}
            onChangeText={onCustomTipChange}
          />
        </View>
      )}
    </View>
  );
}
