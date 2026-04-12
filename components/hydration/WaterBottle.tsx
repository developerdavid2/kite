import { Colors } from "@/constants/colors";
import { borderRadius, spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { useEffect, useRef } from "react";
import { Animated, Dimensions, View } from "react-native";

interface WaterBottleProps {
  percentage: number;
  isGoalReached: boolean;
}

export function WaterBottle({ percentage, isGoalReached }: WaterBottleProps) {
  const { colors } = useTheme();
  const fillAnimation = useRef(new Animated.Value(0)).current;
  const glowAnimation = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    Animated.spring(fillAnimation, {
      toValue: percentage,
      useNativeDriver: false,
      speed: 15,
      bounciness: 8,
    }).start();
  }, [percentage, fillAnimation]);

  useEffect(() => {
    if (isGoalReached) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnimation, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      glowAnimation.setValue(0);
    }
  }, [isGoalReached, glowAnimation]);

  const containerWidth = Math.min(screenWidth - spacing.space8, 120);
  const containerHeight = 280;

  const fillHeight = fillAnimation.interpolate({
    inputRange: [0, 100],
    outputRange: [0, containerHeight - spacing.space4],
  });

  const fillColor = isGoalReached ? Colors.semantic.success : colors.primary;

  const glowOpacity = glowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
  });

  return (
    <View
      style={{
        alignItems: "center",
        marginVertical: spacing.space8,
      }}
    >
      <View
        style={{
          width: containerWidth,
          height: containerHeight,
          borderWidth: 2,
          borderColor: colors.primary,
          borderRadius: borderRadius.radiusLg,
          overflow: "hidden",
          backgroundColor: colors.surfaceAlt,
          position: "relative",
        }}
      >
        <Animated.View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: fillHeight,
            backgroundColor: fillColor,
          }}
        />

        {isGoalReached && (
          <Animated.View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: fillHeight,
              backgroundColor: fillColor,
              opacity: glowOpacity,
            }}
          />
        )}

        <View
          style={{
            position: "absolute",
            top: spacing.space3,
            left: 0,
            right: 0,
            height: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        />

        <View
          style={{
            position: "absolute",
            top: spacing.space2,
            left: spacing.space2,
            right: spacing.space2,
            height: 20,
            borderRadius: borderRadius.radiusSm,
            backgroundColor: colors.surface,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: colors.border,
              marginRight: 4,
            }}
          />
          <View
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: colors.border,
            }}
          />
        </View>
      </View>

      <View
        style={{
          width: containerWidth + spacing.space6,
          height: 12,
          borderRadius: borderRadius.radiusFull,
          backgroundColor: colors.border,
          marginTop: spacing.space2,
        }}
      />
    </View>
  );
}
