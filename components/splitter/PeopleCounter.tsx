import {
  borderRadius,
  fontSizes,
  fontWeights,
  spacing,
} from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface PeopleCounterProps {
  count: number;
  onCountChange: (count: number) => void;
}

export function PeopleCounter({ count, onCountChange }: PeopleCounterProps) {
  const { colors } = useTheme();

  const handleMinus = () => {
    if (count > 1) {
      onCountChange(count - 1);
    }
  };

  const handlePlus = () => {
    if (count < 20) {
      onCountChange(count + 1);
    }
  };

  return (
    <View style={{ marginVertical: spacing.space4 }}>
      <Text
        style={{
          fontSize: fontSizes.sm,
          fontWeight: fontWeights.semibold,
          color: colors.textSecondary,
          marginBottom: spacing.space3,
          marginLeft: spacing.space4,
        }}
      >
        Number of People
      </Text>

      <View
        style={{
          marginHorizontal: spacing.space4,
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.space3,
        }}
      >
        <TouchableOpacity
          onPress={handleMinus}
          disabled={count <= 1}
          style={{
            width: 44,
            height: 44,
            borderRadius: borderRadius.radiusMd,
            backgroundColor: count <= 1 ? colors.surfaceAlt : colors.primary,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons
            name="remove"
            size={20}
            color={count <= 1 ? colors.textMuted : "#FFFFFF"}
          />
        </TouchableOpacity>

        <View
          style={{
            flex: 1,
            paddingVertical: spacing.space3,
            borderRadius: borderRadius.radiusMd,
            backgroundColor: colors.surfaceAlt,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Text
            style={{
              fontSize: fontSizes.display,
              fontWeight: fontWeights.bold,
              color: colors.textPrimary,
            }}
          >
            {count}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handlePlus}
          disabled={count >= 20}
          style={{
            width: 44,
            height: 44,
            borderRadius: borderRadius.radiusMd,
            backgroundColor: count >= 20 ? colors.surfaceAlt : colors.primary,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons
            name="add"
            size={20}
            color={count >= 20 ? colors.textMuted : "#FFFFFF"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
