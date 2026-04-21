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
    Date.now() - daysAgo * 24 * 60 * 60 * 1000,
  ).toLocaleDateString("en-US", { weekday: "short" });
}

function getLogsKey(dateKey: string): string {
  return `kite_hydration_logs_${dateKey}`;
}

export async function getHydrationWeekStats(): Promise<HydrationWeekStats> {
  try {
    const userJson = await AsyncStorage.getItem("kite_hydration_user");

    const userGoal = userJson
      ? (() => {
          const user = JSON.parse(userJson);
          return user.weight && user.weightUnit && user.activityLevel
            ? calculateUserGoal(
                user.weight,
                user.weightUnit,
                user.activityLevel,
              )
            : 2000;
        })()
      : 2000;

    const dateKeys = Array.from({ length: 7 }, (_, i) => ({
      daysAgo: 6 - i,
      dateKey: getDateKey(6 - i),
      dayLabel: getDayLabel(6 - i),
    }));

    const logsPerDay = await Promise.all(
      dateKeys.map(async ({ dateKey }) => {
        try {
          const logsJson = await AsyncStorage.getItem(getLogsKey(dateKey));
          if (!logsJson) return 0;
          const logs: { amount: number }[] = JSON.parse(logsJson);
          return logs.reduce((sum, log) => sum + log.amount, 0);
        } catch {
          return 0;
        }
      }),
    );

    const stats: DailyHydrationStat[] = dateKeys.map(
      ({ dateKey, dayLabel }, i) => {
        const amount = logsPerDay[i];
        const percentage = Math.min(100, Math.round((amount / userGoal) * 100));
        return { date: dateKey, dayLabel, amount, goal: userGoal, percentage };
      },
    );

    const hasData = logsPerDay.some((total) => total > 0);

    return { stats, hasData };
  } catch {
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
  activity: string,
): number {
  const activityMultipliers: Record<string, number> = {
    sedentary: 0.027,
    light: 0.033,
    moderate: 0.04,
    active: 0.05,
  };
  const weightInKg = unit === "lbs" ? weight * 0.453592 : weight;
  const baseAmount = weightInKg * (activityMultipliers[activity] || 0.04);
  return Math.round((baseAmount * 1000) / 250) * 250;
}

export function getColorByPercentage(percentage: number): string {
  if (percentage >= 80) return "#22C55E";
  if (percentage >= 50) return "#F59E0B";
  return "#EF4444";
}
