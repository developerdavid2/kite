import {
  animationDurations,
  borderRadius,
  fontSizes,
  fontWeights,
  spacing,
} from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import type { SplitResult as SplitResultType } from "@/types/splitter.types";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import {
  Animated,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface SplitResultProps {
  result: SplitResultType;
  numberOfPeople: number;
  personNames: string[];
  showNameInputs: boolean;
  onPersonNameChange: (index: number, name: string) => void;
  onToggleNames: () => void;
  onShare: () => void;
  isVisible: boolean;
}

export function SplitResult({
  result,
  numberOfPeople,
  personNames,
  showNameInputs,
  onPersonNameChange,
  onToggleNames,
  onShare,
  isVisible,
}: SplitResultProps) {
  const { colors } = useTheme();
  const slideAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnimation, {
        toValue: 1,
        duration: animationDurations.normal,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: animationDurations.normal,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, slideAnimation]);

  const translateY = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  const opacity = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  if (!isVisible) {
    return null;
  }

  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
        opacity,
        marginHorizontal: spacing.space4,
        marginVertical: spacing.space5,
      }}
    >
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: borderRadius.radiusLg,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <View
          style={{
            height: 16,
            backgroundColor: colors.surfaceAlt,
            borderBottomWidth: 2,
            borderBottomColor: colors.border,
            borderStyle: "dashed",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 4,
            }}
          >
            {[...Array(8)].map((_, i) => (
              <View
                key={i}
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: 1.5,
                  backgroundColor: colors.border,
                }}
              />
            ))}
          </View>
        </View>

        <View style={{ padding: spacing.space4 }}>
          <Text
            style={{
              fontSize: fontSizes.md,
              fontWeight: fontWeights.bold,
              color: colors.textPrimary,
              marginBottom: spacing.space4,
              textAlign: "center",
            }}
          >
            Bill Summary
          </Text>

          <View style={{ marginBottom: spacing.space4, gap: spacing.space2 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: fontSizes.md,
                  color: colors.textSecondary,
                }}
              >
                Subtotal
              </Text>
              <Text
                style={{
                  fontSize: fontSizes.md,
                  fontWeight: fontWeights.semibold,
                  color: colors.textPrimary,
                }}
              >
                {result.subtotal.toFixed(2)}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: fontSizes.md,
                  color: colors.textSecondary,
                }}
              >
                Tip
              </Text>
              <Text
                style={{
                  fontSize: fontSizes.md,
                  fontWeight: fontWeights.semibold,
                  color: colors.textPrimary,
                }}
              >
                {result.tipAmount.toFixed(2)}
              </Text>
            </View>
          </View>

          <View
            style={{
              height: 1,
              backgroundColor: colors.border,
              marginBottom: spacing.space3,
            }}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: spacing.space4,
            }}
          >
            <Text
              style={{
                fontSize: fontSizes.lg,
                fontWeight: fontWeights.bold,
                color: colors.textPrimary,
              }}
            >
              Total
            </Text>
            <Text
              style={{
                fontSize: fontSizes.lg,
                fontWeight: fontWeights.bold,
                color: colors.primary,
              }}
            >
              {result.total.toFixed(2)}
            </Text>
          </View>

          <View
            style={{
              height: 1,
              backgroundColor: colors.border,
              marginBottom: spacing.space4,
            }}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: spacing.space4,
            }}
          >
            <Text
              style={{
                fontSize: fontSizes.md,
                fontWeight: fontWeights.semibold,
                color: colors.textSecondary,
              }}
            >
              Per Person
            </Text>
            <Text
              style={{
                fontSize: fontSizes.xxl,
                fontWeight: fontWeights.bold,
                color: colors.primary,
              }}
            >
              {result.perPerson.toFixed(2)}
            </Text>
          </View>

          {showNameInputs && (
            <View
              style={{
                gap: spacing.space2,
                marginBottom: spacing.space4,
                paddingTop: spacing.space3,
                borderTopWidth: 1,
                borderTopColor: colors.border,
              }}
            >
              <Text
                style={{
                  fontSize: fontSizes.sm,
                  fontWeight: fontWeights.medium,
                  color: colors.textSecondary,
                  marginBottom: spacing.space2,
                }}
              >
                Names
              </Text>

              <ScrollView
                scrollEnabled={numberOfPeople > 4}
                style={{ maxHeight: numberOfPeople > 4 ? 200 : "auto" }}
              >
                {personNames.map((name, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: spacing.space2,
                      marginBottom: spacing.space2,
                    }}
                  >
                    <TextInput
                      style={{
                        flex: 1,
                        borderWidth: 1,
                        borderColor: colors.border,
                        borderRadius: borderRadius.radiusMd,
                        paddingHorizontal: spacing.space2,
                        paddingVertical: spacing.space2,
                        fontSize: fontSizes.sm,
                        color: colors.textPrimary,
                      }}
                      placeholder={`Person ${index + 1}`}
                      placeholderTextColor={colors.textMuted}
                      value={name}
                      onChangeText={(text) => onPersonNameChange(index, text)}
                    />
                    <Text
                      style={{
                        fontSize: fontSizes.sm,
                        fontWeight: fontWeights.semibold,
                        color: colors.primary,
                        minWidth: 60,
                        textAlign: "right",
                      }}
                    >
                      {result.perPerson.toFixed(2)}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          <View
            style={{
              gap: spacing.space2,
            }}
          >
            <TouchableOpacity
              onPress={onToggleNames}
              style={{
                paddingVertical: spacing.space2,
                paddingHorizontal: spacing.space3,
                borderWidth: 1,
                borderColor: colors.primary,
                borderRadius: borderRadius.radiusMd,
                alignItems: "center",
                backgroundColor: "transparent",
              }}
            >
              <Text
                style={{
                  fontSize: fontSizes.md,
                  fontWeight: fontWeights.semibold,
                  color: colors.primary,
                }}
              >
                {showNameInputs ? "Hide Names" : "Add Names"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onShare}
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: spacing.space2,
                paddingVertical: spacing.space2,
                paddingHorizontal: spacing.space3,
                borderRadius: borderRadius.radiusMd,
                backgroundColor: colors.primary,
              }}
            >
              <Ionicons name="share-outline" size={20} color="#FFFFFF" />
              <Text
                style={{
                  fontSize: fontSizes.md,
                  fontWeight: fontWeights.semibold,
                  color: "#FFFFFF",
                }}
              >
                Copy to Clipboard
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}
