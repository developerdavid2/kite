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

  const edgeState = edges
    ? {
        top: edges.includes("top"),
        bottom: edges.includes("bottom"),
        left: edges.includes("left"),
        right: edges.includes("right"),
      }
    : { top, bottom, left, right };

  return (
    <View
      collapsable={false}
      style={[
        styles.container,
        { backgroundColor: colors.background },
        {
          paddingTop: edgeState.top ? insets.top : 0,
          paddingBottom: edgeState.bottom ? insets.bottom : 0,
          paddingLeft: edgeState.left ? insets.left : 0,
          paddingRight: edgeState.right ? insets.right : 0,
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
