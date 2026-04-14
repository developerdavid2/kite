import {
  animationDurations,
  borderRadius,
  fontSizes,
  fontWeights,
  spacing,
} from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import type {
  ActivityLevel,
  HydrationUser,
  WeightUnit,
} from "@/types/hydration.types";
import { getActivityLabel } from "@/utils/hydrationFormulas";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface SetupModalProps {
  visible: boolean;
  onComplete: (user: HydrationUser) => void;
  initialUser?: HydrationUser | null;
}

export function SetupModal({
  visible,
  onComplete,
  initialUser,
}: SetupModalProps) {
  const { colors } = useTheme();
  const [weight, setWeight] = useState(initialUser?.weight.toString() || "70");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(
    initialUser?.weightUnit || "kg"
  );
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(
    initialUser?.activityLevel || "moderate"
  );

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

  const handleComplete = () => {
    const weightNum = parseFloat(weight) || 70;
    onComplete({
      weight: weightNum,
      weightUnit,
      activityLevel,
    });
  };

  const activityLevels: ActivityLevel[] = [
    "sedentary",
    "light",
    "moderate",
    "active",
  ];

  return (
    <Modal visible={visible} transparent animationType="none">
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
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
            minHeight: 450,
            zIndex: 40,
          }}
        >
          <ScrollView
            style={{ padding: spacing.space4 }}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: spacing.space5,
              }}
            >
              <Text
                style={{
                  fontSize: fontSizes.lg,
                  fontWeight: fontWeights.semibold,
                  color: colors.textPrimary,
                }}
              >
                Hydration Setup
              </Text>
              <Ionicons name="water" size={24} color={colors.primary} />
            </View>

            <View style={{ marginBottom: spacing.space5 }}>
              <Text
                style={{
                  fontSize: fontSizes.sm,
                  fontWeight: fontWeights.semibold,
                  color: colors.textSecondary,
                  marginBottom: spacing.space2,
                }}
              >
                Your Weight
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  gap: spacing.space2,
                  alignItems: "center",
                }}
              >
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
                  placeholder="70"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="decimal-pad"
                  value={weight}
                  onChangeText={setWeight}
                />
                <View
                  style={{
                    flexDirection: "row",
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: borderRadius.radiusMd,
                    overflow: "hidden",
                  }}
                >
                  {(["kg", "lbs"] as const).map((unit) => (
                    <TouchableOpacity
                      key={unit}
                      onPress={() => setWeightUnit(unit)}
                      style={{
                        paddingHorizontal: spacing.space3,
                        paddingVertical: spacing.space2,
                        backgroundColor:
                          weightUnit === unit
                            ? colors.primary
                            : colors.surfaceAlt,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: fontSizes.sm,
                          fontWeight: fontWeights.semibold,
                          color:
                            weightUnit === unit
                              ? "#FFFFFF"
                              : colors.textPrimary,
                        }}
                      >
                        {unit}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={{ marginBottom: spacing.space5 }}>
              <Text
                style={{
                  fontSize: fontSizes.sm,
                  fontWeight: fontWeights.semibold,
                  color: colors.textSecondary,
                  marginBottom: spacing.space2,
                }}
              >
                Activity Level
              </Text>
              <View style={{ gap: spacing.space2 }}>
                {activityLevels.map((level) => (
                  <TouchableOpacity
                    key={level}
                    onPress={() => setActivityLevel(level)}
                    style={{
                      paddingHorizontal: spacing.space3,
                      paddingVertical: spacing.space3,
                      borderWidth: 1,
                      borderColor:
                        activityLevel === level
                          ? colors.primary
                          : colors.border,
                      borderRadius: borderRadius.radiusMd,
                      backgroundColor:
                        activityLevel === level
                          ? colors.primary
                          : colors.surfaceAlt,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: fontSizes.md,
                        fontWeight: fontWeights.medium,
                        color:
                          activityLevel === level
                            ? "#FFFFFF"
                            : colors.textPrimary,
                      }}
                    >
                      {getActivityLabel(level)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              onPress={handleComplete}
              style={{
                paddingVertical: spacing.space3,
                borderRadius: borderRadius.radiusMd,
                backgroundColor: colors.primary,
                alignItems: "center",
                marginTop: spacing.space3,
              }}
            >
              <Text
                style={{
                  fontSize: fontSizes.md,
                  fontWeight: fontWeights.semibold,
                  color: "#FFFFFF",
                }}
              >
                Save Settings
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}
