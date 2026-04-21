import type { HydrationWeekStats } from "@/types/analytics.types";
import { getHydrationWeekStats } from "@/utils/analyticsFormulas";
import { useCallback, useState } from "react";

export function useAnalytics() {
  const [stats, setStats] = useState<HydrationWeekStats>({
    stats: [],
    hasData: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadStats = useCallback(async () => {
    setIsLoading(true);
    const weekStats = await getHydrationWeekStats();
    setStats(weekStats);
    setIsLoading(false);
  }, []);

  return {
    stats: stats.stats,
    hasData: stats.hasData,
    isLoading,
    loadStats,
    refresh: loadStats,
  };
}
