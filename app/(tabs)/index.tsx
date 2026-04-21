import SafeArea from "@/components/shared/SafeArea";
import {
  borderRadius,
  fontSizes,
  fontWeights,
  spacing,
} from "@/constants/theme";
import { useTasks } from "@/hooks/useTasks";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const tools = [
  {
    route: "/(tabs)/converter",
    icon: "git-compare-outline" as const,
    label: "Unit Converter",
    description: "Length, weight, temperature & more",
    accent: "#4A9FE0",
    bg: "#4A9FE01A",
  },
  {
    route: "/(tabs)/hydration",
    icon: "water-outline" as const,
    label: "Hydration",
    description: "Log daily water intake",
    accent: "#38BDF8",
    bg: "#38BDF81A",
  },
  {
    route: "/(tabs)/splitter",
    icon: "cash-outline" as const,
    label: "Bill Splitter",
    description: "Split expenses with tip",
    accent: "#34D399",
    bg: "#34D3991A",
  },
  {
    route: "/(tabs)/analytics",
    icon: "bar-chart-outline" as const,
    label: "Analytics",
    description: "7-day hydration trends",
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
  const { recentTasks, completedCount, totalCount, toggleTask, loadTasks } =
    useTasks();

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [loadTasks]),
  );

  useEffect(() => {
    const interval = setInterval(() => setGreeting(getGreeting()), 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setGreeting(getGreeting()), 60_000);
    return () => clearInterval(interval);
  }, []);

  const progressPct =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

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
            style={{ fontSize: fontSizes.sm, color: "rgba(255,255,255,0.7)" }}
          >
            {tools.length} tools ready to use
          </Text>
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

        {/* Tasks card — always visible */}
        <View
          style={{
            marginHorizontal: spacing.space4,
            marginBottom: spacing.space6,
            backgroundColor: colors.surface,
            borderRadius: borderRadius.radiusLg,
            borderWidth: 1,
            borderColor: colors.border,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: spacing.space4,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacing.space2,
              }}
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  backgroundColor: "#4A9FE01A",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name="checkmark-done-outline"
                  size={17}
                  color="#4A9FE0"
                />
              </View>
              <Text
                style={{
                  fontSize: fontSizes.md,
                  fontWeight: fontWeights.semibold,
                  color: colors.textPrimary,
                }}
              >
                Tasks
              </Text>
              {totalCount > 0 && (
                <View
                  style={{
                    backgroundColor: colors.primary + "22",
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 99,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: fontWeights.semibold,
                      color: colors.primary,
                    }}
                  >
                    {completedCount}/{totalCount}
                  </Text>
                </View>
              )}
            </View>
            <TouchableOpacity
              onPress={() => router.push("/tasks")}
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Text style={{ fontSize: fontSizes.sm, color: colors.primary }}>
                {totalCount > 0 ? "See all" : "Add task"}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={14}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>

          {/* Progress bar — always show track, fill animates */}
          <View
            style={{
              paddingHorizontal: spacing.space4,
              paddingTop: spacing.space3,
            }}
          >
            <View
              style={{
                height: 5,
                backgroundColor: colors.border,
                borderRadius: 99,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  width: `${progressPct}%`,
                  height: "100%",
                  backgroundColor: colors.primary,
                  borderRadius: 99,
                }}
              />
            </View>
            <Text
              style={{
                fontSize: fontSizes.xs,
                color: colors.textMuted,
                marginTop: 4,
                marginBottom: spacing.space2,
              }}
            >
              {totalCount === 0
                ? "No tasks yet"
                : `${progressPct}% complete · ${totalCount - completedCount} remaining`}
            </Text>
          </View>

          {/* Recent tasks or empty state */}
          {recentTasks.length === 0 ? (
            <TouchableOpacity
              onPress={() => router.push("/tasks")}
              style={{
                alignItems: "center",
                paddingVertical: spacing.space5,
                gap: spacing.space2,
              }}
            >
              <Ionicons
                name="add-circle-outline"
                size={32}
                color={colors.textMuted}
              />
              <Text style={{ fontSize: fontSizes.sm, color: colors.textMuted }}>
                Tap to add your first task
              </Text>
            </TouchableOpacity>
          ) : (
            recentTasks.map((task, index) => {
              const isDone = task.completed === 1;
              const isLast = index === recentTasks.length - 1;
              return (
                <View
                  key={task.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: spacing.space4,
                    paddingVertical: spacing.space3,
                    borderBottomWidth: isLast ? 0 : 1,
                    borderBottomColor: colors.border,
                    gap: spacing.space3,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => toggleTask(task.id, task.completed)}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      borderWidth: 2,
                      borderColor: isDone ? colors.primary : colors.border,
                      backgroundColor: isDone ? colors.primary : "transparent",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {isDone && (
                      <Ionicons name="checkmark" size={11} color="#FFFFFF" />
                    )}
                  </TouchableOpacity>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: fontSizes.sm,
                      color: isDone ? colors.textMuted : colors.textPrimary,
                      textDecorationLine: isDone ? "line-through" : "none",
                    }}
                    numberOfLines={1}
                  >
                    {task.title}
                  </Text>
                </View>
              );
            })
          )}
        </View>

        {/* Tools grid label */}
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

        {/* 2×2 grid */}
        <View
          style={{
            paddingHorizontal: spacing.space4,
            flexDirection: "row",
            flexWrap: "wrap",
            gap: spacing.space3,
          }}
        >
          {tools.map((tool) => (
            <TouchableOpacity
              key={tool.route}
              onPress={() => router.push(tool.route as any)}
              activeOpacity={0.75}
              style={{
                width: "47%",
                padding: spacing.space4,
                backgroundColor: colors.surface,
                borderRadius: borderRadius.radiusMd,
                borderWidth: 1,
                borderColor: colors.border,
                gap: spacing.space2,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: tool.bg,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: spacing.space1,
                }}
              >
                <Ionicons name={tool.icon} size={20} color={tool.accent} />
              </View>
              <Text
                style={{
                  fontSize: fontSizes.sm,
                  fontWeight: fontWeights.semibold,
                  color: colors.textPrimary,
                }}
              >
                {tool.label}
              </Text>
              <Text
                style={{
                  fontSize: fontSizes.xs,
                  color: colors.textSecondary,
                  lineHeight: 16,
                }}
                numberOfLines={2}
              >
                {tool.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeArea>
  );
}
