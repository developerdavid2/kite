import type { ActivityLevel, WeightUnit } from "@/types/hydration.types";

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 0.027,
  light: 0.033,
  moderate: 0.04,
  active: 0.05,
};

export function calculateDailyGoal(
  weight: number,
  unit: WeightUnit,
  activityLevel: ActivityLevel
): number {
  const weightInKg = unit === "lbs" ? weight * 0.453592 : weight;
  const baseAmount = weightInKg * ACTIVITY_MULTIPLIERS[activityLevel];
  const milliliters = baseAmount * 1000;

  return Math.round(milliliters / 250) * 250;
}

export function getTodayDateKey(): string {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

export function getActivityLabel(activity: ActivityLevel): string {
  const labels: Record<ActivityLevel, string> = {
    sedentary: "Sedentary",
    light: "Light Activity",
    moderate: "Moderate Activity",
    active: "Very Active",
  };
  return labels[activity];
}
