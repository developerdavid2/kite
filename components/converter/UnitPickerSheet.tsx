import {
  animationDurations,
  borderRadius,
  fontSizes,
  fontWeights,
  spacing,
} from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import type { Unit } from "@/types/converter.types";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import {
  Animated,
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface UnitPickerSheetProps {
  visible: boolean;
  units: Unit[];
  selectedUnitId: string;
  onUnitSelect: (unitId: string) => void;
  onClose: () => void;
}

export function UnitPickerSheet({
  visible,
  units,
  selectedUnitId,
  onUnitSelect,
  onClose,
}: UnitPickerSheetProps) {
  const { colors } = useTheme();
  const slideAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnimation, {
        toValue: 1,
        duration: animationDurations.normal,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: animationDurations.normal,
        useNativeDriver: false,
      }).start();
    }
  }, [visible, slideAnimation]);

  const bottomSheetHeight = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-500, 0],
  });

  const handleUnitSelect = (unitId: string) => {
    onUnitSelect(unitId);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
        onPress={onClose}
        activeOpacity={1}
      >
        <Animated.View
          style={{
            transform: [{ translateY: bottomSheetHeight }],
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: colors.surface,
            borderTopLeftRadius: borderRadius.radiusXl,
            borderTopRightRadius: borderRadius.radiusXl,
            maxHeight: 500,
          }}
        >
          <View
            style={{
              paddingVertical: spacing.space3,
              paddingHorizontal: spacing.space4,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: fontSizes.lg,
                fontWeight: fontWeights.semibold,
                color: colors.textPrimary,
              }}
            >
              Select Unit
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={units}
            keyExtractor={(item) => item.id}
            scrollEnabled
            style={{ maxHeight: 420 }}
            renderItem={({ item }) => {
              const isSelected = item.id === selectedUnitId;

              return (
                <TouchableOpacity
                  onPress={() => handleUnitSelect(item.id)}
                  style={{
                    paddingVertical: spacing.space3,
                    paddingHorizontal: spacing.space4,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: fontSizes.md,
                        fontWeight: fontWeights.medium,
                        color: colors.textPrimary,
                        marginBottom: spacing.space1,
                      }}
                    >
                      {item.label}
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizes.sm,
                        color: colors.textSecondary,
                      }}
                    >
                      {item.symbol}
                    </Text>
                  </View>

                  {isSelected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={colors.primary}
                      style={{ marginLeft: spacing.space3 }}
                    />
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}
