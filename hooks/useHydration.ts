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
const HYDRATION_LOGS_KEY = "kite_hydration_logs";
const HYDRATION_DATE_KEY = "kite_hydration_date";

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
      // Check if AsyncStorage is available
      if (!isAsyncStorageAvailable()) {
        console.warn("AsyncStorage not available, using default state");
        setIsReady(true);
        return;
      }

      const [userJson, logsJson, savedDate] = await Promise.all([
        AsyncStorage.getItem(HYDRATION_KEY),
        AsyncStorage.getItem(HYDRATION_LOGS_KEY),
        AsyncStorage.getItem(HYDRATION_DATE_KEY),
      ]);

      const user = userJson ? JSON.parse(userJson) : null;
      const todayDate = getTodayDateKey();
      const lastDate = savedDate || todayDate;
      const shouldReset = lastDate !== todayDate;

      let logs: LogEntry[] = [];
      if (!shouldReset && logsJson) {
        logs = JSON.parse(logsJson);
      }

      if (shouldReset && user) {
        await AsyncStorage.setItem(HYDRATION_DATE_KEY, todayDate);
        logs = [];
      }

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
    } catch (error) {
      console.error("Failed to load hydration data:", error);
      setIsReady(true);
    }
  };

  const saveUser = useCallback(async (user: HydrationUser) => {
    const dailyGoal = calculateDailyGoal(
      user.weight,
      user.weightUnit,
      user.activityLevel
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

      setState((prev) => ({
        ...prev,
        logs: updatedLogs,
      }));

      try {
        if (isAsyncStorageAvailable()) {
          await AsyncStorage.setItem(
            HYDRATION_LOGS_KEY,
            JSON.stringify(updatedLogs)
          );
        }
      } catch (error) {
        console.error("Failed to persist entry:", error);
      }
    },
    [state.logs]
  );

  const deleteEntry = useCallback(
    async (entryId: string) => {
      const updatedLogs = state.logs.filter((log) => log.id !== entryId);

      setState((prev) => ({
        ...prev,
        logs: updatedLogs,
      }));

      try {
        if (isAsyncStorageAvailable()) {
          await AsyncStorage.setItem(
            HYDRATION_LOGS_KEY,
            JSON.stringify(updatedLogs)
          );
        }
      } catch (error) {
        console.error("Failed to persist deletion:", error);
      }
    },
    [state.logs]
  );

  const todayTotal = state.logs.reduce((sum, log) => sum + log.amount, 0);
  const percentage = Math.min(
    100,
    Math.round((todayTotal / state.dailyGoal) * 100)
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
