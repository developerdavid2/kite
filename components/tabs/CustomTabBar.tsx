// components/navigation/CustomTabBar.tsx
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const tabConfig: Record<string, { label: string; icon: string }> = {
  index: { label: "Home", icon: "home" },
  converter: { label: "Convert", icon: "git-compare" },
  hydration: { label: "Hydrate", icon: "water" },
  splitter: { label: "Split", icon: "cash" },
  analytics: { label: "Analytics", icon: "bar-chart" },
};

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const bgColor = isDark ? "#040F1E" : "#081E3A";
  const activeColor = "#4A9FE0";
  const bottomPad = Math.max(insets.bottom, 8);

  return (
    <View
      className="flex-row border-t pt-2.5"
      style={{
        backgroundColor: bgColor,
        borderTopColor: colors.border,
        paddingBottom: bottomPad,
        minHeight: 60 + bottomPad,
      }}
    >
      {state.routes.map((route, index) => {
        const config = tabConfig[route.name as keyof typeof tabConfig];

        if (!config) return null;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.7}
            className="flex-1 items-center justify-center"
          >
            <View
              className="items-center justify-center px-3 py-1.5 min-w-[52px]"
              style={{
                backgroundColor: isFocused ? activeColor + "33" : "transparent",
                borderRadius: isFocused ? 12 : 0,
              }}
            >
              <Ionicons
                name={config.icon as any}
                size={22}
                color={isFocused ? activeColor : colors.textMuted}
              />
              <Text
                className="text-[10px] mt-1"
                style={{
                  color: isFocused ? activeColor : colors.textMuted,
                  fontWeight: isFocused ? "600" : "400",
                }}
              >
                {config.label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
