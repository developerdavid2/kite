import SafeArea from "@/components/shared/SafeArea";
import {
  borderRadius,
  fontSizes,
  fontWeights,
  spacing,
} from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const tools = [
  {
    route: "/converter",
    icon: "git-compare-outline" as const,
    label: "Unit Converter",
    description: "Convert between length, weight, temperature & more",
    accent: "#4A9FE0",
    bg: "#4A9FE01A",
  },
  {
    route: "/hydration",
    icon: "water-outline" as const,
    label: "Hydration Tracker",
    description: "Log your daily water intake and hit your goal",
    accent: "#38BDF8",
    bg: "#38BDF81A",
  },
  {
    route: "/splitter",
    icon: "cash-outline" as const,
    label: "Bill Splitter",
    description: "Split expenses with tip calculation and sharing",
    accent: "#34D399",
    bg: "#34D3991A",
  },
  {
    route: "/analytics",
    icon: "bar-chart-outline" as const,
    label: "Analytics",
    description: "View your 7-day hydration history and trends",
    accent: "#A78BFA",
    bg: "#A78BFA1A",
  },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomeScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const [greeting, setGreeting] = useState(getGreeting());

  useEffect(() => {
    const interval = setInterval(() => setGreeting(getGreeting()), 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeArea
      style={{ flex: 1, backgroundColor: colors.background }}
      bottom={false}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: spacing.space4,
          paddingTop: spacing.space4,
          marginBottom: spacing.space6,
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 28,
              fontWeight: fontWeights.bold,
              color: colors.textPrimary,
              letterSpacing: -0.5,
            }}
          >
            Kite
          </Text>
          <Text
            style={{
              fontSize: fontSizes.sm,
              color: colors.textSecondary,
              marginTop: 2,
            }}
          >
            {greeting} 👋
          </Text>
        </View>

        <TouchableOpacity
          onPress={toggleTheme}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.surface,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Ionicons
            name={isDark ? "sunny-outline" : "moon-outline"}
            size={18}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: spacing.space10 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero card */}
        <View
          style={{
            marginHorizontal: spacing.space4,
            marginBottom: spacing.space6,
            padding: spacing.space5,
            borderRadius: borderRadius.radiusLg,
            backgroundColor: "#4A9FE0",
            overflow: "hidden",
          }}
        >
          <Text
            style={{
              fontSize: fontSizes.xs,
              fontWeight: fontWeights.semibold,
              color: "rgba(255,255,255,0.75)",
              letterSpacing: 1.2,
              textTransform: "uppercase",
              marginBottom: spacing.space2,
            }}
          >
            Your toolkit
          </Text>
          <Text
            style={{
              fontSize: 22,
              fontWeight: fontWeights.bold,
              color: "#FFFFFF",
              lineHeight: 30,
              marginBottom: spacing.space1,
            }}
          >
            Everything you need,{"\n"}right here.
          </Text>
          <Text
            style={{
              fontSize: fontSizes.sm,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            {tools.length} tools ready to use
          </Text>

          {/* Decorative circle */}
          <View
            style={{
              position: "absolute",
              right: -30,
              top: -30,
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: "rgba(255,255,255,0.08)",
            }}
          />
          <View
            style={{
              position: "absolute",
              right: 20,
              bottom: -40,
              width: 90,
              height: 90,
              borderRadius: 45,
              backgroundColor: "rgba(255,255,255,0.06)",
            }}
          />
        </View>

        {/* Section label */}
        <Text
          style={{
            paddingHorizontal: spacing.space4,
            fontSize: fontSizes.xs,
            fontWeight: fontWeights.semibold,
            color: colors.textMuted,
            letterSpacing: 1.2,
            textTransform: "uppercase",
            marginBottom: spacing.space3,
          }}
        >
          Tools
        </Text>

        {/* Tool cards */}
        <View
          style={{ paddingHorizontal: spacing.space4, gap: spacing.space3 }}
        >
          {tools.map((tool) => (
            <TouchableOpacity
              key={tool.route}
              onPress={() => router.push(tool.route as any)}
              activeOpacity={0.75}
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: spacing.space4,
                backgroundColor: colors.surface,
                borderRadius: borderRadius.radiusMd,
                borderWidth: 1,
                borderColor: colors.border,
                gap: spacing.space3,
              }}
            >
              {/* Icon bubble */}
              <View
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 14,
                  backgroundColor: tool.bg,
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Ionicons name={tool.icon} size={22} color={tool.accent} />
              </View>

              {/* Text */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: fontSizes.md,
                    fontWeight: fontWeights.semibold,
                    color: colors.textPrimary,
                    marginBottom: 3,
                  }}
                >
                  {tool.label}
                </Text>
                <Text
                  style={{
                    fontSize: fontSizes.sm,
                    color: colors.textSecondary,
                    lineHeight: 18,
                  }}
                  numberOfLines={2}
                >
                  {tool.description}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={16}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeArea>
  );
}
