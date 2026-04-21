// hooks/useHydration.ts
import type {
  HydrationState,
  HydrationUser,
  LogEntry,
} from "@/types/hydration.types";
import { calculateDailyGoal, getTodayDateKey } from "@/utils/hydrationFormulas";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const HYDRATION_KEY = "kite_hydration_user";
const HYDRATION_DATE_KEY = "kite_hydration_date";

function getLogsKey(dateKey: string): string {
  return `kite_hydration_logs_${dateKey}`;
}

// Check if AsyncStorage is available
const isAsyncStorageAvailable = () => {
  try {
    return AsyncStorage && typeof AsyncStorage.getItem === "function";
  } catch {
    return false;
  }
};

export function useHydration() {
  const [state, setState] = useState<HydrationState>({
    user: null,
    dailyGoal: 2000,
    todayDate: getTodayDateKey(),
    logs: [],
    isSetupComplete: false,
  });

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    loadFromStorage();
  }, []);

  const loadFromStorage = async () => {
    try {
      const [userJson, savedDate] = await Promise.all([
        AsyncStorage.getItem(HYDRATION_KEY),
        AsyncStorage.getItem(HYDRATION_DATE_KEY),
      ]);

      const user = userJson ? JSON.parse(userJson) : null;
      const todayDate = getTodayDateKey();

      if (savedDate !== todayDate) {
        await AsyncStorage.setItem(HYDRATION_DATE_KEY, todayDate);
      }

      const logsJson = await AsyncStorage.getItem(getLogsKey(todayDate));
      const logs: LogEntry[] = logsJson ? JSON.parse(logsJson) : [];

      const dailyGoal = user
        ? calculateDailyGoal(user.weight, user.weightUnit, user.activityLevel)
        : 2000;

      setState({
        user,
        dailyGoal,
        todayDate,
        logs,
        isSetupComplete: !!user,
      });

      setIsReady(true);
    } catch {
      setIsReady(true);
    }
  };

  const saveUser = useCallback(async (user: HydrationUser) => {
    const dailyGoal = calculateDailyGoal(
      user.weight,
      user.weightUnit,
      user.activityLevel,
    );
    const todayDate = getTodayDateKey();

    setState((prev) => ({
      ...prev,
      user,
      dailyGoal,
      todayDate,
      logs: [],
      isSetupComplete: true,
    }));

    try {
      if (isAsyncStorageAvailable()) {
        await Promise.all([
          AsyncStorage.setItem(HYDRATION_KEY, JSON.stringify(user)),
          AsyncStorage.setItem(HYDRATION_DATE_KEY, todayDate),
        ]);
      }
    } catch (error) {
      console.error("Failed to persist user data:", error);
    }
  }, []);

  const addEntry = useCallback(
    async (amount: number) => {
      const newEntry: LogEntry = {
        id: `${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
        amount,
      };
      const updatedLogs = [...state.logs, newEntry];
      try {
        await AsyncStorage.setItem(
          getLogsKey(state.todayDate),
          JSON.stringify(updatedLogs),
        );
        setState((prev) => ({ ...prev, logs: updatedLogs }));
      } catch {
        console.error("Failed to add entry");
      }
    },
    [state.logs, state.todayDate],
  );

  const deleteEntry = useCallback(
    async (entryId: string) => {
      const updatedLogs = state.logs.filter((log) => log.id !== entryId);
      try {
        await AsyncStorage.setItem(
          getLogsKey(state.todayDate),
          JSON.stringify(updatedLogs),
        );
        setState((prev) => ({ ...prev, logs: updatedLogs }));
      } catch {
        console.error("Failed to delete entry");
      }
    },
    [state.logs, state.todayDate],
  );

  const todayTotal = state.logs.reduce((sum, log) => sum + log.amount, 0);
  const percentage = Math.min(
    100,
    Math.round((todayTotal / state.dailyGoal) * 100),
  );
  const isGoalReached = todayTotal >= state.dailyGoal;

  return {
    state,
    isReady,
    user: state.user,
    dailyGoal: state.dailyGoal,
    todayTotal,
    percentage,
    isGoalReached,
    logs: state.logs,
    isSetupComplete: state.isSetupComplete,
    saveUser,
    addEntry,
    deleteEntry,
  };
}
