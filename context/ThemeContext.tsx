import { Colors, ColorScheme, ColorTokens } from "@/constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as NavigationBar from "expo-navigation-bar";
import React, { createContext, useEffect, useState } from "react";
import { Platform, useColorScheme } from "react-native";

interface ThemeContextType {
  theme: ColorScheme;
  colors: ColorTokens;
  toggleTheme: () => void;
  isDark: boolean;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

const THEME_STORAGE_KEY = "kite_theme";

const NAV_BAR_COLORS = {
  dark: "#040F1E",
  light: "#F5F9FE",
} as const;

async function syncNavigationBar(isDark: boolean): Promise<void> {
  if (Platform.OS !== "android") return;
  try {
    await NavigationBar.setBackgroundColorAsync(
      isDark ? NAV_BAR_COLORS.dark : NAV_BAR_COLORS.light,
    );
  } catch {}
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<ColorScheme>("light");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (stored === "light" || stored === "dark") {
          setTheme(stored);
          await syncNavigationBar(stored === "dark");
        } else if (systemColorScheme === "dark") {
          setTheme("dark");
          await syncNavigationBar(true);
        } else {
          setTheme("light");
          await syncNavigationBar(false);
        }
      } catch {
        const fallback = systemColorScheme === "dark" ? "dark" : "light";
        setTheme(fallback);
        await syncNavigationBar(fallback === "dark");
      } finally {
        setIsLoaded(true);
      }
    };

    loadTheme();
  }, [systemColorScheme]);

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    const newIsDark = newTheme === "dark";
    setTheme(newTheme);
    await syncNavigationBar(newIsDark);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch {
      // Storage failed but theme toggled locally — acceptable
    }
  };

  const colors = Colors[theme];
  const isDark = theme === "dark";

  if (!isLoaded) return null;

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}
