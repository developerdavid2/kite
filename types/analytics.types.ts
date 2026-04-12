export interface DailyHydrationStat {
  date: string;
  dayLabel: string;
  amount: number;
  goal: number;
  percentage: number;
}

export interface HydrationWeekStats {
  stats: DailyHydrationStat[];
  hasData: boolean;
}
