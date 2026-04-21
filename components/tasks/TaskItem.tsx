import { Colors } from "@/constants/colors";
import { fontSizes, spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import type { Task } from "@/types/tasks.types";
import { Ionicons } from "@expo/vector-icons";
import { Alert, Text, TouchableOpacity, View } from "react-native";

interface TaskItemProps {
  task: Task;
  onToggle: (id: number, completed: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  const { colors } = useTheme();
  const isDone = task.completed === 1;

  const handleDelete = () => {
    Alert.alert("Delete Task", `Remove "${task.title}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => onDelete(task.id),
      },
    ]);
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: spacing.space3,
        paddingHorizontal: spacing.space4,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        gap: spacing.space3,
      }}
    >
      {/* Checkbox */}
      <TouchableOpacity
        onPress={() => onToggle(task.id, task.completed)}
        style={{
          width: 22,
          height: 22,
          borderRadius: 11,
          borderWidth: 2,
          borderColor: isDone ? colors.primary : colors.border,
          backgroundColor: isDone ? colors.primary : "transparent",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
        activeOpacity={0.7}
      >
        {isDone && <Ionicons name="checkmark" size={13} color="#FFFFFF" />}
      </TouchableOpacity>

      {/* Title */}
      <Text
        style={{
          flex: 1,
          fontSize: fontSizes.md,
          color: isDone ? colors.textMuted : colors.textPrimary,
          textDecorationLine: isDone ? "line-through" : "none",
        }}
        numberOfLines={2}
      >
        {task.title}
      </Text>

      {/* Edit */}
      <TouchableOpacity onPress={() => onEdit(task)} style={{ padding: 4 }}>
        <Ionicons
          name="pencil-outline"
          size={17}
          color={colors.textSecondary}
        />
      </TouchableOpacity>

      {/* Delete */}
      <TouchableOpacity onPress={handleDelete} style={{ padding: 4 }}>
        <Ionicons
          name="trash-outline"
          size={17}
          color={Colors.semantic.danger}
        />
      </TouchableOpacity>
    </View>
  );
}
