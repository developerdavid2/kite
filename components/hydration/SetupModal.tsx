import {
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
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const insets = useSafeAreaInsets();
  const [weight, setWeight] = useState(initialUser?.weight.toString() || "70");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(
    initialUser?.weightUnit || "kg",
  );
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(
    initialUser?.activityLevel || "moderate",
  );

  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(600)).current;

  useEffect(() => {
    if (visible) {
      overlayOpacity.setValue(0);
      sheetTranslateY.setValue(600);
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
        toValue: 600,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() =>
      onComplete({
        weight: parseFloat(weight) || 70,
        weightUnit,
        activityLevel,
      }),
    );
  };

  const handleComplete = () => {
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: 600,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() =>
      onComplete({
        weight: parseFloat(weight) || 70,
        weightUnit,
        activityLevel,
      }),
    );
  };

  const activityLevels: ActivityLevel[] = [
    "sedentary",
    "light",
    "moderate",
    "active",
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <View style={{ flex: 1 }}>
        {/* Fading backdrop */}
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
            maxHeight: 540,
            paddingBottom: Math.max(insets.bottom, spacing.space5),
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

          <ScrollView
            style={{ padding: spacing.space4 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Title row */}
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

            {/* Weight */}
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
                    backgroundColor: colors.surfaceAlt,
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

            {/* Activity */}
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
                marginBottom: spacing.space4,
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
      </View>
    </Modal>
  );
}
