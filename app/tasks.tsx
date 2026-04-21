import SafeArea from "@/components/shared/SafeArea";
import { TaskInput, TaskInputRef } from "@/components/tasks/TaskInput";
import { TaskItem } from "@/components/tasks/TaskItem";
import {
  borderRadius,
  fontSizes,
  fontWeights,
  spacing,
} from "@/constants/theme";
import { useTasks } from "@/hooks/useTasks";
import { useTheme } from "@/hooks/useTheme";
import type { Task, TaskFilter } from "@/types/tasks.types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const FILTERS: { key: TaskFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
];

export default function TasksScreen() {
  const { colors } = useTheme();
  const {
    tasks,
    isReady,
    completedCount,
    totalCount,
    addTask,
    editTask,
    toggleTask,
    deleteTask,
  } = useTasks();
  const [filter, setFilter] = useState<TaskFilter>("all");
  const inputRef = useRef<TaskInputRef>(null);

  const filtered = tasks.filter((t) => {
    if (filter === "active") return t.completed === 0;
    if (filter === "completed") return t.completed === 1;
    return true;
  });

  const handleEdit = (task: Task) => {
    inputRef.current?.openEdit(task.id, task.title);
  };

  const progressPct =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (!isReady) {
    return (
      <SafeArea style={{ flex: 1 }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeArea>
    );
  }

  return (
    <SafeArea
      style={{ flex: 1, backgroundColor: colors.background }}
      bottom={false}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: spacing.space4,
          paddingTop: spacing.space4,
          paddingBottom: spacing.space3,
          gap: spacing.space3,
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 26,
              fontWeight: fontWeights.bold,
              color: colors.textPrimary,
              letterSpacing: -0.5,
            }}
          >
            Tasks
          </Text>
          <Text
            style={{
              fontSize: fontSizes.sm,
              color: colors.textSecondary,
              marginTop: 1,
            }}
          >
            {completedCount} of {totalCount} completed
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => inputRef.current?.openAdd()}
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="add" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Progress bar */}
      {totalCount > 0 && (
        <View
          style={{
            paddingHorizontal: spacing.space4,
            marginBottom: spacing.space4,
          }}
        >
          <View
            style={{
              height: 6,
              backgroundColor: colors.border,
              borderRadius: 99,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                width: `${progressPct}%`,
                height: "100%",
                backgroundColor: colors.primary,
                borderRadius: 99,
              }}
            />
          </View>
          <Text
            style={{
              fontSize: fontSizes.xs,
              color: colors.textMuted,
              marginTop: 5,
              textAlign: "right",
            }}
          >
            {progressPct}% done
          </Text>
        </View>
      )}

      {/* Filter pills */}
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: spacing.space4,
          gap: spacing.space2,
          marginBottom: spacing.space3,
        }}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            onPress={() => setFilter(f.key)}
            style={{
              paddingHorizontal: spacing.space3,
              paddingVertical: 6,
              borderRadius: 99,
              backgroundColor:
                filter === f.key ? colors.primary : colors.surfaceAlt,
              borderWidth: 1,
              borderColor: filter === f.key ? colors.primary : colors.border,
            }}
          >
            <Text
              style={{
                fontSize: fontSizes.sm,
                fontWeight:
                  filter === f.key ? fontWeights.semibold : fontWeights.normal,
                color: filter === f.key ? "#FFFFFF" : colors.textSecondary,
              }}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Task list */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggle={toggleTask}
            onEdit={handleEdit}
            onDelete={deleteTask}
          />
        )}
        ListEmptyComponent={
          <View
            style={{
              alignItems: "center",
              paddingTop: 80,
              gap: spacing.space3,
            }}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={48}
              color={colors.textMuted}
            />
            <Text style={{ fontSize: fontSizes.md, color: colors.textMuted }}>
              {filter === "completed"
                ? "No completed tasks yet"
                : "No tasks yet"}
            </Text>
            {filter === "all" && (
              <TouchableOpacity
                onPress={() => inputRef.current?.openAdd()}
                style={{
                  paddingHorizontal: spacing.space4,
                  paddingVertical: spacing.space2,
                  backgroundColor: colors.primary,
                  borderRadius: borderRadius.radiusMd,
                }}
              >
                <Text
                  style={{ color: "#FFFFFF", fontWeight: fontWeights.semibold }}
                >
                  Add your first task
                </Text>
              </TouchableOpacity>
            )}
          </View>
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing.space10 }}
      />

      <TaskInput ref={inputRef} onAdd={addTask} onEdit={editTask} />
    </SafeArea>
  );
}
