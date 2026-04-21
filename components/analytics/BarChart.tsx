import { fontSizes, fontWeights, spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import type { DailyHydrationStat } from "@/types/analytics.types";
import { getColorByPercentage } from "@/utils/analyticsFormulas";
import { useEffect, useRef } from "react";
import { Animated, Dimensions, Text, View } from "react-native";

interface BarChartProps {
  stats: DailyHydrationStat[];
}

export function BarChart({ stats }: BarChartProps) {
  const { colors } = useTheme();
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - spacing.space8;
  const barWidth = (chartWidth - spacing.space2 * 6) / 7;
  const maxHeight = 200;

  return (
    <View
      style={{
        paddingHorizontal: spacing.space4,
        marginVertical: spacing.space5,
      }}
    >
      <View
        style={{
          height: maxHeight + spacing.space8,
          justifyContent: "flex-end",
          alignItems: "center",
          flexDirection: "row",
          gap: spacing.space2,
        }}
      >
        {stats.map((stat, index) => (
          <AnimatedBar
            key={stat.date}
            stat={stat}
            maxHeight={maxHeight}
            barWidth={barWidth}
            colors={colors}
            delay={index * 100}
          />
        ))}
      </View>

      <View
        style={{
          flexDirection: "row",
          gap: spacing.space2,
          justifyContent: "space-around",
          marginTop: spacing.space3,
        }}
      >
        {stats.map((stat) => (
          <Text
            key={`label-${stat.date}`}
            style={{
              width: barWidth,
              textAlign: "center",
              fontSize: fontSizes.xs,
              color: colors.textSecondary,
              fontWeight: fontWeights.medium,
            }}
          >
            {stat.dayLabel}
          </Text>
        ))}
      </View>
    </View>
  );
}

interface AnimatedBarProps {
  stat: DailyHydrationStat;
  maxHeight: number;
  barWidth: number;
  colors: any;
  delay: number;
}

function AnimatedBar({
  stat,
  maxHeight,
  barWidth,
  colors,
  delay,
}: AnimatedBarProps) {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setTimeout(() => {
      Animated.spring(animValue, {
        toValue: stat.percentage,
        useNativeDriver: false,
        speed: 12,
        bounciness: 6,
      }).start();
    }, delay);
  }, [stat.percentage, delay, animValue]);

  const barHeight = animValue.interpolate({
    inputRange: [0, 100],
    outputRange: [0, maxHeight],
  });

  const barColor = getColorByPercentage(stat.percentage);

  return (
    <View
      style={{
        alignItems: "center",
        width: barWidth,
      }}
    >
      <Text
        style={{
          fontSize: fontSizes.xs,
          color: colors.textSecondary,
          fontWeight: fontWeights.semibold,
          minHeight: spacing.space5,
          textAlign: "center",
        }}
      >
        {stat.amount === 0 ? "—" : `${Math.round(stat.amount)}`}
      </Text>

      <Animated.View
        style={{
          width: barWidth - spacing.space2,
          height: barHeight,
          backgroundColor: barColor,
          borderRadius: 4,
          marginVertical: spacing.space1,
        }}
      />
    </View>
  );
}
