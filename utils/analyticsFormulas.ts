import type {
  DailyHydrationStat,
  HydrationWeekStats,
} from "@/types/analytics.types";
import AsyncStorage from "@react-native-async-storage/async-storage";

function getDateKey(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function getDayLabel(daysAgo: number): string {
  if (daysAgo === 0) return "Today";
  if (daysAgo === 1) return "Yesterday";
  return new Date(
    Date.now() - daysAgo * 24 * 60 * 60 * 1000
  ).toLocaleDateString("en-US", { weekday: "short" });
}

export async function getHydrationWeekStats(): Promise<HydrationWeekStats> {
  try {
    const logsJson = await AsyncStorage.getItem("kite_hydration_logs");
    const userJson = await AsyncStorage.getItem("kite_hydration_user");

    if (!logsJson || !userJson) {
      return {
        stats: Array.from({ length: 7 }, (_, i) => ({
          date: getDateKey(6 - i),
          dayLabel: getDayLabel(6 - i),
          amount: 0,
          goal: 2000,
          percentage: 0,
        })),
        hasData: false,
      };
    }

    const allLogs = JSON.parse(logsJson);
    const user = JSON.parse(userJson);

    const dailyTotals: Record<string, number> = {};

    for (const log of allLogs) {
      const date = new Date(log.timestamp);
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      dailyTotals[dateKey] = (dailyTotals[dateKey] || 0) + log.amount;
    }

    const userGoal =
      user.weight && user.weightUnit && user.activityLevel
        ? calculateUserGoal(user.weight, user.weightUnit, user.activityLevel)
        : 2000;

    const stats: DailyHydrationStat[] = Array.from({ length: 7 }, (_, i) => {
      const daysAgo = 6 - i;
      const dateKey = getDateKey(daysAgo);
      const amount = dailyTotals[dateKey] || 0;
      const percentage = Math.min(100, Math.round((amount / userGoal) * 100));

      return {
        date: dateKey,
        dayLabel: getDayLabel(daysAgo),
        amount,
        goal: userGoal,
        percentage,
      };
    });

    const hasData = Object.values(dailyTotals).some((total) => total > 0);

    return { stats, hasData };
  } catch (error) {
    console.error("Failed to get hydration stats:", error);
    return {
      stats: Array.from({ length: 7 }, (_, i) => ({
        date: getDateKey(6 - i),
        dayLabel: getDayLabel(6 - i),
        amount: 0,
        goal: 2000,
        percentage: 0,
      })),
      hasData: false,
    };
  }
}

function calculateUserGoal(
  weight: number,
  unit: "kg" | "lbs",
  activity: string
): number {
  const activityMultipliers: Record<string, number> = {
    sedentary: 0.027,
    light: 0.033,
    moderate: 0.04,
    active: 0.05,
  };

  const weightInKg = unit === "lbs" ? weight * 0.453592 : weight;
  const baseAmount = weightInKg * (activityMultipliers[activity] || 0.04);
  const milliliters = baseAmount * 1000;

  return Math.round(milliliters / 250) * 250;
}

export function getColorByPercentage(percentage: number): string {
  if (percentage >= 80) return "#22C55E";
  if (percentage >= 50) return "#F59E0B";
  return "#EF4444";
}
