import {
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
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const insets = useSafeAreaInsets();
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(500)).current;

  useEffect(() => {
    if (visible) {
      overlayOpacity.setValue(0);
      sheetTranslateY.setValue(500);
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(sheetTranslateY, {
          toValue: 0,
          damping: 20,
          stiffness: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [overlayOpacity, sheetTranslateY, visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: 500,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  };

  const handleUnitSelect = (unitId: string) => {
    onUnitSelect(unitId);
    handleClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <View style={{ flex: 1 }}>
        {/* Fading full-screen backdrop */}
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            opacity: overlayOpacity,
          }}
        >
          <TouchableWithoutFeedback onPress={handleClose}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>
        </Animated.View>

        {/* Sliding sheet */}
        <Animated.View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            transform: [{ translateY: sheetTranslateY }],
            backgroundColor: colors.surface,
            borderTopLeftRadius: borderRadius.radiusXl,
            borderTopRightRadius: borderRadius.radiusXl,
            maxHeight: 520,
            paddingBottom: Math.max(insets.bottom, spacing.space4),
          }}
        >
          {/* Handle */}
          <View style={{ alignItems: "center", paddingTop: spacing.space3 }}>
            <View
              style={{
                width: 36,
                height: 4,
                borderRadius: 2,
                backgroundColor: colors.border,
              }}
            />
          </View>

          {/* Header */}
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
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={units}
            keyExtractor={(item) => item.id}
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
      </View>
    </Modal>
  );
}
