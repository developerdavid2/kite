import { useTheme } from "@/hooks/useTheme";
import { StyleSheet, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SafeAreaProps {
  children: React.ReactNode;
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
  edges?: ("top" | "bottom" | "left" | "right")[];
  style?: ViewStyle;
}

export default function SafeArea({
  children,
  top = true,
  bottom = true,
  left = false,
  right = false,
  edges,
  style,
}: SafeAreaProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View
      collapsable={false}
      style={[
        styles.container,
        {
          paddingTop: top ? insets.top : 0,
          paddingBottom: bottom ? insets.bottom : 4,
          paddingLeft: left ? insets.left : 0,
          paddingRight: right ? insets.right : 0,
          backgroundColor: colors.background,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
