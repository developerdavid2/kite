import { CategoryPicker } from "@/components/converter/CategoryPicker";
import { UnitPickerSheet } from "@/components/converter/UnitPickerSheet";
import { UnitSelector } from "@/components/converter/UnitSelector";
import SafeArea from "@/components/shared/SafeArea";
import { spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { useUnitConverter } from "@/hooks/useUnitConverter";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Keyboard,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ConverterScreen() {
  const { colors } = useTheme();
  const {
    state,
    currentCategory,
    fromUnit,
    toUnit,
    result,
    formula,
    setCategory,
    setFromUnit,
    setToUnit,
    setInputValue,
    swap,
  } = useUnitConverter();

  const [activeSheet, setActiveSheet] = useState<"from" | "to" | null>(null);

  return (
    <SafeArea
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: spacing.space10,
        }}
        onScrollBeginDrag={Keyboard.dismiss}
      >
        <View className="px-4">
          <Text
            className="text-3xl font-jakarta text-blue-50 mb-0.5"
            style={{
              color: colors.textPrimary,
            }}
          >
            Unit Converter
          </Text>
          <Text
            className="text-sm text-blue-300"
            style={{
              color: colors.textSecondary,
              marginBottom: spacing.space5,
            }}
          >
            Convert between units instantly
          </Text>
        </View>

        <View style={{ paddingHorizontal: spacing.space4 }}>
          <CategoryPicker
            selectedCategory={state.category}
            onCategoryChange={setCategory}
          />
        </View>

        <View style={{ paddingHorizontal: spacing.space4 }}>
          <UnitSelector
            label="From"
            unit={fromUnit}
            value={state.inputValue}
            onValueChange={setInputValue}
            onUnitPress={() => setActiveSheet("from")}
            editable
          />

          <TouchableOpacity
            onPress={swap}
            className="self-center w-11 h-11 rounded-full items-center justify-center"
            style={{
              backgroundColor: colors.primary,
              marginVertical: spacing.space3,
              marginBottom: spacing.space3,
            }}
          >
            <Ionicons name="swap-vertical" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <UnitSelector
            label="To"
            unit={toUnit}
            value={result.toFixed(6).replace(/\.?0+$/, "")}
            onUnitPress={() => setActiveSheet("to")}
            editable={false}
          />
        </View>

        {formula && (
          <View
            className="mx-4 mt-5 px-3 py-2 bg-blue-700 rounded-lg border-l-4"
            style={{
              backgroundColor: colors.surfaceAlt,
              borderLeftColor: colors.primary,
            }}
          >
            <Text
              className="text-xs text-blue-300 font-medium mb-1"
              style={{
                color: colors.textSecondary,
              }}
            >
              Conversion Formula
            </Text>
            <Text
              className="text-sm text-blue-50"
              style={{
                color: colors.textPrimary,
              }}
            >
              {formula}
            </Text>
          </View>
        )}
      </ScrollView>

      {currentCategory && (
        <>
          <UnitPickerSheet
            visible={activeSheet === "from"}
            units={currentCategory.units}
            selectedUnitId={state.fromUnitId}
            onUnitSelect={setFromUnit}
            onClose={() => setActiveSheet(null)}
          />
          <UnitPickerSheet
            visible={activeSheet === "to"}
            units={currentCategory.units}
            selectedUnitId={state.toUnitId}
            onUnitSelect={setToUnit}
            onClose={() => setActiveSheet(null)}
          />
        </>
      )}
    </SafeArea>
  );
}
