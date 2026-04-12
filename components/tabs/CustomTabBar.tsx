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
      style={{
        flexDirection: "row",
        backgroundColor: bgColor,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingBottom: bottomPad,
        paddingTop: 10,
        minHeight: 60 + bottomPad,
      }}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const config = tabConfig[route.name as keyof typeof tabConfig];

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
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
                backgroundColor: isFocused ? activeColor + "33" : "transparent",
                minWidth: 52,
              }}
            >
              <Ionicons
                name={config.icon as any}
                size={22}
                color={isFocused ? activeColor : colors.textMuted}
              />
              <Text
                style={{
                  color: isFocused ? activeColor : colors.textMuted,
                  fontSize: 10,
                  fontWeight: isFocused ? "600" : "400",
                  marginTop: 3,
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
