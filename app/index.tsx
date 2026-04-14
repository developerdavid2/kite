import { useTheme } from "@/hooks/useTheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";

export default function SplashScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const navigateNext = useCallback(async () => {
    try {
      const hasOnboarded = await AsyncStorage.getItem("kite_onboarded");
      router.replace(hasOnboarded === "true" ? "/(tabs)" : "/onboarding");
    } catch {
      router.replace("/onboarding");
    }
  }, [router]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(navigateNext, 2200);
    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, navigateNext]);

  const animatedStyle = {
    opacity: fadeAnim,
    transform: [{ scale: scaleAnim }],
  };

  return (
    <View
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: isDark ? "#040F1E" : "#E8F4FD" }}
    >
      <Animated.View className="items-center" style={animatedStyle}>
        <KiteMark size={80} color={colors.primary} />

        <Animated.Text
          className="text-4xl font-jakarta tracking-tight mt-6"
          style={{ color: colors.textPrimary, opacity: fadeAnim }}
        >
          Kite
        </Animated.Text>

        <Animated.Text
          className="text-sm font-medium mt-2 tracking-widest uppercase"
          style={{ color: colors.textSecondary, opacity: fadeAnim }}
        >
          Utility Toolkit
        </Animated.Text>
      </Animated.View>

      <Animated.View
        className="absolute bottom-16 items-center"
        style={{ opacity: fadeAnim }}
      >
        <View className="flex-row gap-1.5 items-center">
          <View
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: colors.primary }}
          />
          <View
            className="w-1.5 h-1.5 rounded-full opacity-50"
            style={{ backgroundColor: colors.primary }}
          />
          <View
            className="w-1.5 h-1.5 rounded-full opacity-25"
            style={{ backgroundColor: colors.primary }}
          />
        </View>
      </Animated.View>
    </View>
  );
}

function KiteMark({ size, color }: { size: number; color: string }) {
  const half = size / 2;
  const quarter = size / 4;

  return (
    <View
      style={{ width: size, height: size }}
      className="relative items-center justify-center"
    >
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: quarter,
          borderRightWidth: quarter,
          borderBottomWidth: half,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderBottomColor: color,
        }}
      />
      <View
        className="absolute"
        style={{
          bottom: half / 2,
          width: 3,
          height: half,
          backgroundColor: color,
        }}
      />
    </View>
  );
}
