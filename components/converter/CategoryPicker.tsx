import {
  borderRadius,
  fontSizes,
  fontWeights,
  spacing,
} from "@/constants/theme";
import { UnitCategories } from "@/constants/units";
import { useTheme } from "@/hooks/useTheme";
import type { UnitCategoryId } from "@/types/converter.types";
import { ScrollView, Text, TouchableOpacity } from "react-native";

interface CategoryPickerProps {
  selectedCategory: UnitCategoryId;
  onCategoryChange: (category: UnitCategoryId) => void;
}

export function CategoryPicker({
  selectedCategory,
  onCategoryChange,
}: CategoryPickerProps) {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginVertical: spacing.space3 }}
      contentContainerStyle={{
        paddingHorizontal: spacing.space4,
        gap: spacing.space2,
      }}
    >
      {UnitCategories.map((category) => {
        const isSelected = category.id === selectedCategory;

        return (
          <TouchableOpacity
            key={category.id}
            onPress={() => onCategoryChange(category.id as UnitCategoryId)}
            style={{
              paddingHorizontal: spacing.space3,
              paddingVertical: spacing.space2,
              borderRadius: borderRadius.radiusFull,
              backgroundColor: isSelected ? colors.primary : colors.surfaceAlt,
            }}
          >
            <Text
              style={{
                fontSize: fontSizes.sm,
                fontWeight: fontWeights.medium,
                color: isSelected ? "#FFFFFF" : colors.textPrimary,
              }}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
