import { BarChart } from "@/components/analytics/BarChart";
import SafeArea from "@/components/shared/SafeArea";
import { fontSizes, fontWeights, spacing } from "@/constants/theme";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AnalyticsScreen() {
  const { colors } = useTheme();
  const { stats, hasData, isLoading, refresh } = useAnalytics();

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
          paddingBottom: spacing.space5,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          className="flex-row justify-between items-center px-4 pt-4 mb-3"
        >
          <Text
            className="text-3xl font-jakarta text-blue-50"
            style={{
              color: colors.textPrimary,
            }}
          >
            Analytics
          </Text>
          <TouchableOpacity onPress={refresh}>
            <Ionicons name="refresh" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View
          className="px-4 mb-4"
        >
          }}
        >
          <Text
            className="text-md text-blue-300"
            style={{
              color: colors.textSecondary,
            }}
          >
            7-Day Hydration
          </Text>
        </View>

        {isLoading ? (
          <View
            className="h-80 justify-center items-center"
          >
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : !hasData ? (
          <View
            className="px-4 py-8 items-center gap-3"
          >
            <Ionicons name="water-outline" size={60} color={colors.textMuted} />
            <Text
              className="text-md text-gray-500 text-center font-medium"
              style={{
                color: colors.textMuted,
              }}
            >
              Keep logging to see your history
            </Text>
            <Text
              className="text-sm text-blue-400 text-center"
              style={{
                color: colors.textSecondary,
              }}
            >
              Your 7-day hydration chart will appear here once you start logging
              water intake.
            </Text>
          </View>
        ) : (
          <>
            <BarChart stats={stats} />

            <View
              style={{
                paddingHorizontal: spacing.space4,
                gap: spacing.space3,
                marginTop: spacing.space5,
              }}
            >
              <View
                style={{
                  paddingHorizontal: spacing.space3,
                  paddingVertical: spacing.space3,
                  backgroundColor: colors.surface,
                  borderRadius: 8,
                  borderLeftWidth: 3,
                  borderLeftColor: "#22C55E",
                  borderWidth: 1,
                  borderColor: colors.border,
                  marginLeft: -1,
                }}
              >
                <Text
                  style={{
                    fontSize: fontSizes.sm,
                    color: colors.textSecondary,
                    marginBottom: spacing.space1,
                  }}
                >
                  Goal Reached (80%+)
                </Text>
                <Text
                  style={{
                    fontSize: fontSizes.md,
                    fontWeight: fontWeights.bold,
                    color: "#22C55E",
                  }}
                >
                  {stats.filter((s) => s.percentage >= 80).length} days
                </Text>
              </View>

              <View
                style={{
                  paddingHorizontal: spacing.space3,
                  paddingVertical: spacing.space3,
                  backgroundColor: colors.surface,
                  borderRadius: 8,
                  borderLeftWidth: 3,
                  borderLeftColor: "#F59E0B",
                  borderWidth: 1,
                  borderColor: colors.border,
                  marginLeft: -1,
                }}
              >
                <Text
                  style={{
                    fontSize: fontSizes.sm,
                    color: colors.textSecondary,
                    marginBottom: spacing.space1,
                  }}
                >
                  Partial Progress (50-80%)
                </Text>
                <Text
                  style={{
                    fontSize: fontSizes.md,
                    fontWeight: fontWeights.bold,
                    color: "#F59E0B",
                  }}
                >
                  {
                    stats.filter((s) => s.percentage >= 50 && s.percentage < 80)
                      .length
                  }{" "}
                  days
                </Text>
              </View>

              <View
                style={{
                  paddingHorizontal: spacing.space3,
                  paddingVertical: spacing.space3,
                  backgroundColor: colors.surface,
                  borderRadius: 8,
                  borderLeftWidth: 3,
                  borderLeftColor: "#EF4444",
                  borderWidth: 1,
                  borderColor: colors.border,
                  marginLeft: -1,
                }}
              >
                <Text
                  style={{
                    fontSize: fontSizes.sm,
                    color: colors.textSecondary,
                    marginBottom: spacing.space1,
                  }}
                >
                  Low Progress (&lt;50%)
                </Text>
                <Text
                  style={{
                    fontSize: fontSizes.md,
                    fontWeight: fontWeights.bold,
                    color: "#EF4444",
                  }}
                >
                  {stats.filter((s) => s.percentage < 50).length} days
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeArea>
  );
}
