export type ActivityLevel = "sedentary" | "light" | "moderate" | "active";
export type WeightUnit = "kg" | "lbs";

export interface HydrationUser {
  weight: number;
  weightUnit: WeightUnit;
  activityLevel: ActivityLevel;
}

export interface LogEntry {
  id: string;
  timestamp: number;
  amount: number;
}

export interface HydrationState {
  user: HydrationUser | null;
  dailyGoal: number;
  todayDate: string;
  logs: LogEntry[];
  isSetupComplete: boolean;
}
