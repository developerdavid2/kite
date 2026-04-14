import SafeArea from "@/components/shared/SafeArea";
import { useTheme } from "@/hooks/useTheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import {
  Directions,
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import Animated, {
  FadeInDown,
  FadeOutDown,
  LinearTransition,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DURATION = 250;
const STAGGER = 80;

const slides = [
  {
    id: "convert",
    title: "Convert Anything",
    description: "Length, weight, temperature, speed — all in one tap.",
    image: require("@/assets/images/onboarding/onboarding1.png"),
  },
  {
    id: "hydrate",
    title: "Stay Hydrated",
    description: "Track your daily water intake and hit your personal goal.",
    image: require("@/assets/images/onboarding/onboarding2.png"),
  },
  {
    id: "split",
    title: "Split the Bill",
    description: "Divide expenses fairly among friends, instantly.",
    image: require("@/assets/images/onboarding/onboarding3.png"),
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const translateX = useSharedValue(0);

  const isLastSlide = activeIndex === slides.length - 1;
  const current = slides[activeIndex];

  const animateToIndex = useCallback(
    (nextIndex: number, direction: "forward" | "backward") => {
      const exitTo = direction === "forward" ? -SCREEN_WIDTH : SCREEN_WIDTH;
      const enterFrom = direction === "forward" ? SCREEN_WIDTH : -SCREEN_WIDTH;

      translateX.value = withTiming(
        exitTo,
        { duration: DURATION },
        (finished) => {
          if (finished) {
            translateX.value = enterFrom;
            runOnJS(setActiveIndex)(nextIndex);
            translateX.value = withTiming(0, { duration: DURATION });
          }
        }
      );
    },
    [translateX]
  );

  const goForward = useCallback(() => {
    if (activeIndex < slides.length - 1) {
      animateToIndex(activeIndex + 1, "forward");
    }
  }, [activeIndex, animateToIndex]);

  const goBack = useCallback(() => {
    if (activeIndex > 0) {
      animateToIndex(activeIndex - 1, "backward");
    }
  }, [activeIndex, animateToIndex]);

  const completeOnboarding = useCallback(async () => {
    try {
      await AsyncStorage.setItem("kite_onboarded", "true");
    } catch {
      // storage failure must never block navigation
    }
    router.replace("/(tabs)");
  }, [router]);

  const swipeLeft = Gesture.Fling()
    .direction(Directions.LEFT)
    .runOnJS(true)
    .onEnd(() => (isLastSlide ? completeOnboarding() : goForward()));

  const swipeRight = Gesture.Fling()
    .direction(Directions.RIGHT)
    .runOnJS(true)
    .onEnd(() => goBack());

  const gesture = Gesture.Race(swipeLeft, swipeRight);

  const slideAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <SafeArea>
        <View className="flex-1 px-6 pt-4 pb-10">
          <TouchableOpacity
            onPress={completeOnboarding}
            className="self-end py-2 px-1"
          >
            <Text className="text-sm font-jakarta text-blue-400 dark:text-white">
              Skip
            </Text>
          </TouchableOpacity>

          <Animated.View
            className="items-center justify-center my-10"
            style={[{ height: SCREEN_WIDTH * 0.72 }, slideAnimatedStyle]}
          >
            <Image
              source={current.image}
              style={{ width: 250, height: 250 }}
              resizeMode="contain"
            />
          </Animated.View>

          <View className="flex-1 justify-end gap-y-6">
            <View className="flex-row gap-2 justify-center">
              {slides.map((_, index) => (
                <Animated.View
                  key={index}
                  layout={LinearTransition.duration(DURATION)}
                  className="h-[5px] rounded-full"
                  style={{
                    width: index === activeIndex ? 24 : 8,
                    backgroundColor:
                      index === activeIndex ? colors.primary : colors.border,
                  }}
                />
              ))}
            </View>

            <Animated.Text
              key={`title-${activeIndex}`}
              entering={FadeInDown.duration(DURATION).delay(STAGGER)}
              exiting={FadeOutDown.duration(DURATION)}
              className="text-3xl font-jakarta text-center leading-tight"
              style={{ color: colors.textPrimary }}
            >
              {current.title}
            </Animated.Text>

            <Animated.Text
              key={`desc-${activeIndex}`}
              entering={FadeInDown.duration(DURATION).delay(STAGGER * 2)}
              exiting={FadeOutDown.duration(DURATION)}
              className="text-xl text-center leading-relaxed font-sans mb-10"
              style={{ color: colors.textSecondary }}
            >
              {current.description}
            </Animated.Text>

            <TouchableOpacity
              onPress={isLastSlide ? completeOnboarding : goForward}
              activeOpacity={0.8}
              className="h-14 rounded-3xl items-center justify-center"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-base font-jakarta text-white">
                {isLastSlide ? "Get Started" : "Continue"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeArea>
    </GestureDetector>
  );
}
