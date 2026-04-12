import { Colors, ColorScheme, ColorTokens } from "@/constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

interface ThemeContextType {
  theme: ColorScheme;
  colors: ColorTokens;
  toggleTheme: () => void;
  isDark: boolean;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

const THEME_STORAGE_KEY = "kite_theme";

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
        } else if (systemColorScheme === "dark") {
          setTheme("dark");
        } else {
          setTheme("light");
        }
      } catch (error) {
        // AsyncStorage failed — fall back to system preference
        if (systemColorScheme === "dark") {
          setTheme("dark");
        } else {
          setTheme("light");
        }
      } finally {
        setIsLoaded(true);
      }
    };

    loadTheme();
  }, [systemColorScheme]);

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      // Storage failed but theme toggled locally — acceptable
    }
  };

  const colors = Colors[theme];
  const isDark = theme === "dark";

  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}
