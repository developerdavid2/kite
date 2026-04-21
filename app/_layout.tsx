import { JsStack } from "@/components/stack";
import { ThemeProvider } from "@/context/ThemeContext";
import { useTheme } from "@/hooks/useTheme";
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from "@expo-google-fonts/plus-jakarta-sans";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TransitionPresets } from "@react-navigation/stack";
import { useFonts } from "expo-font";
import { RelativePathString, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootStackNavigator() {
  const { isDark } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const hasOnboarded = await AsyncStorage.getItem("kite_onboarded");
        if (hasOnboarded === "true") {
          router.replace("/(tabs)" as RelativePathString);
        } else {
          router.replace("/onboarding");
        }
      } catch {
        router.replace("/onboarding");
      }
    };

    bootstrap();
  }, [router]);

  return (
    <>
      <JsStack screenOptions={{ headerShown: false }}>
        <JsStack.Screen
          name="tasks"
          options={{
            headerShown: false,
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <JsStack.Screen name="onboarding" />
        <JsStack.Screen name="(tabs)" />
      </JsStack>
      <StatusBar style={isDark ? "light" : "dark"} />
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <RootStackNavigator />
        </GestureHandlerRootView>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
