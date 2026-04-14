import { Colors } from "@/constants/colors";
import { fontSizes, fontWeights, spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import type { LogEntry } from "@/types/hydration.types";
import { Ionicons } from "@expo/vector-icons";
import { Alert, Text, TouchableOpacity, View } from "react-native";

interface IntakeLogProps {
  logs: LogEntry[];
  onDeleteEntry: (entryId: string) => void;
}

export function IntakeLog({ logs, onDeleteEntry }: IntakeLogProps) {
  const { colors } = useTheme();

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleDelete = (entryId: string) => {
    Alert.alert("Delete Entry", "Remove this water intake entry?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: () => onDeleteEntry(entryId),
        style: "destructive",
      },
    ]);
  };

  const sortedLogs = [...logs].sort((a, b) => b.timestamp - a.timestamp);

  if (logs.length === 0) {
    return (
      <View style={{ paddingVertical: spacing.space8, alignItems: "center" }}>
        <Ionicons
          name="water-outline"
          size={40}
          color={colors.textMuted}
          style={{ marginBottom: spacing.space3 }}
        />
        <Text
          style={{
            fontSize: fontSizes.md,
            color: colors.textMuted,
            fontWeight: fontWeights.medium,
          }}
        >
          No entries yet
        </Text>
        <Text
          style={{
            fontSize: fontSizes.sm,
            color: colors.textSecondary,
            marginTop: spacing.space1,
          }}
        >
          Log your first cup to get started
        </Text>
      </View>
    );
  }

  return (
    <View>
      {sortedLogs.map((item) => (
        <View
          key={item.id}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: spacing.space4,
            paddingVertical: spacing.space3,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: fontSizes.sm,
                color: colors.textSecondary,
                marginBottom: spacing.space1,
              }}
            >
              {formatTime(item.timestamp)}
            </Text>
            <Text
              style={{
                fontSize: fontSizes.md,
                fontWeight: fontWeights.semibold,
                color: colors.textPrimary,
              }}
            >
              {item.amount} ml
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            style={{ padding: spacing.space2 }}
          >
            <Ionicons
              name="trash-outline"
              size={20}
              color={Colors.semantic.danger}
            />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}
