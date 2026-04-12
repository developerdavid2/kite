import type { HydrationWeekStats } from "@/types/analytics.types";
import { getHydrationWeekStats } from "@/utils/analyticsFormulas";
import { useEffect, useState } from "react";

export function useAnalytics() {
  const [stats, setStats] = useState<HydrationWeekStats>({
    stats: [],
    hasData: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsLoading(true);
    const weekStats = await getHydrationWeekStats();
    setStats(weekStats);
    setIsLoading(false);
  };

  return {
    stats: stats.stats,
    hasData: stats.hasData,
    isLoading,
    refresh: loadStats,
  };
}
