// app/(tabs)/hydration.tsx
import { IntakeLog } from "@/components/hydration/IntakeLog";
import { WaterBottle } from "@/components/hydration/WaterBottle";
import BottomSheetModal, {
  BottomSheetModalRef,
} from "@/components/shared/BottomSheetModal";
import SafeArea from "@/components/shared/SafeArea";
import { Colors } from "@/constants/colors";
import { spacing } from "@/constants/theme";
import { useHydration } from "@/hooks/useHydration";
import { useTheme } from "@/hooks/useTheme";
import type { ActivityLevel, LogEntry } from "@/types/hydration.types";
import { getActivityLabel } from "@/utils/hydrationFormulas";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function HydrationScreen() {
  const { colors } = useTheme();
  const {
    user,
    dailyGoal,
    todayTotal,
    percentage,
    isGoalReached,
    logs,
    isReady,
    saveUser,
    addEntry,
    deleteEntry,
  } = useHydration();

  const [weight, setWeight] = useState(user?.weight.toString() || "70");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">(
    user?.weightUnit || "kg"
  );
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(
    user?.activityLevel || "moderate"
  );

  const bottomSheetRef = useRef<BottomSheetModalRef>(null);

  const handleOpenSetup = () => {
    if (user) {
      setWeight(user.weight.toString());
      setWeightUnit(user.weightUnit);
      setActivityLevel(user.activityLevel);
    }
    bottomSheetRef.current?.open();
  };

  const handleSetupComplete = () => {
    const weightNum = parseFloat(weight) || 70;
    saveUser({
      weight: weightNum,
      weightUnit,
      activityLevel,
    });
    bottomSheetRef.current?.close();
  };

  const handleDelete = (entryId: string) => {
    Alert.alert("Delete Entry", "Remove this water intake entry?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: () => deleteEntry(entryId),
        style: "destructive",
      },
    ]);
  };

  const formatTime = (timestamp: number) =>
    new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  if (!isReady) {
    return (
      <SafeArea style={{ flex: 1 }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeArea>
    );
  }

  const sortedLogs = [...logs].sort((a, b) => b.timestamp - a.timestamp);
  const activityLevels: ActivityLevel[] = [
    "sedentary",
    "light",
    "moderate",
    "active",
  ];

  // Everything that scrolls (water bottle, buttons, and logs)
  const ScrollableContent = () => (
    <View className="pb-10">
      {/* Water bottle */}
      <View className="items-center">
        <WaterBottle percentage={percentage} isGoalReached={isGoalReached} />
        <View className="items-center mb-5">
          <Text
            className="text-5xl font-jakarta"
            style={{ color: colors.primary }}
          >
            {todayTotal}
          </Text>
          <Text
            className="text-sm mt-1"
            style={{ color: colors.textSecondary }}
          >
            {todayTotal} ml / {dailyGoal} ml ({percentage}%)
          </Text>
        </View>
      </View>

      {/* Add buttons */}
      <View className="gap-3 mb-5 px-4">
        <TouchableOpacity
          onPress={() => addEntry(250)}
          className="py-3 rounded-md items-center"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-md font-semibold text-white">
            + Add Cup (250 ml)
          </Text>
        </TouchableOpacity>

        <View className="flex-row gap-2">
          {[100, 150, 200, 300].map((amount) => (
            <TouchableOpacity
              key={amount}
              onPress={() => addEntry(amount)}
              className="flex-1 py-3 rounded-md items-center border"
              style={{
                backgroundColor: colors.surfaceAlt,
                borderColor: colors.border,
              }}
            >
              <Text
                className="text-sm font-semibold"
                style={{ color: colors.textPrimary }}
              >
                {amount}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Today's Log Header */}
      <Text
        className="text-md font-semibold px-4 pt-2 pb-2"
        style={{ color: colors.textPrimary }}
      >
        Today&apos;s Log
      </Text>

      {/* Logs List */}
      <FlatList
        data={sortedLogs}
        keyExtractor={(item) => item.id}
        scrollEnabled={false} // Disable inner scrolling since parent ScrollView handles it
        ListEmptyComponent={<IntakeLog logs={[]} onDeleteEntry={deleteEntry} />}
        renderItem={({ item }: { item: LogEntry }) => (
          <View
            className="flex-row justify-between items-center px-4 py-3"
            style={{
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}
          >
            <View className="flex-1">
              <Text
                className="text-sm mb-1"
                style={{ color: colors.textSecondary }}
              >
                {formatTime(item.timestamp)}
              </Text>
              <Text
                className="text-md font-semibold"
                style={{ color: colors.textPrimary }}
              >
                {item.amount} ml
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleDelete(item.id)}
              className="p-2"
            >
              <Ionicons
                name="trash-outline"
                size={20}
                color={Colors.semantic.danger}
              />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );

  return (
    <SafeArea
      style={{ flex: 1, backgroundColor: colors.background }}
      bottom={false}
    >
      {/* Fixed Header Section - Only Title and Subtitle */}
      <View className="px-4 pt-3 pb-2">
        <View className="flex-row justify-between items-center">
          <View>
            <Text
              className="text-3xl font-jakarta"
              style={{ color: colors.textPrimary }}
            >
              Hydration
            </Text>
            {isGoalReached && (
              <Text
                className="text-sm font-semibold mt-1"
                style={{ color: Colors.semantic.success }}
              >
                ✓ Goal reached!
              </Text>
            )}
          </View>
          <TouchableOpacity onPress={handleOpenSetup} className="p-2">
            <Ionicons
              name="settings-outline"
              size={24}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Subtitle */}
        <Text className="text-sm" style={{ color: colors.textSecondary }}>
          Daily goal: {dailyGoal} ml
        </Text>
      </View>

      {/* Scrollable Content - Water bottle, buttons, and logs */}
      <FlatList
        data={[{ key: "content" }]} // Single item to hold all scrollable content
        keyExtractor={() => "content"}
        renderItem={() => <ScrollableContent />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing.space10 }}
      />

      {/* Setup Bottom Sheet */}
      <BottomSheetModal
        ref={bottomSheetRef}
        title="Hydration Setup"
        onClose={() => {}}
      >
        <View className="gap-5">
          <View>
            <Text
              className="text-sm font-semibold mb-2"
              style={{ color: colors.textSecondary }}
            >
              Your Weight
            </Text>
            <View className="flex-row gap-2 items-center">
              <TextInput
                className="flex-1 border rounded-md px-3 py-2 text-md"
                style={{
                  borderColor: colors.border,
                  color: colors.textPrimary,
                  backgroundColor: colors.surfaceAlt,
                }}
                placeholder="70"
                placeholderTextColor={colors.textMuted}
                keyboardType="decimal-pad"
                value={weight}
                onChangeText={setWeight}
              />
              <View
                className="flex-row border rounded-md overflow-hidden"
                style={{ borderColor: colors.border }}
              >
                {(["kg", "lbs"] as const).map((unit) => (
                  <TouchableOpacity
                    key={unit}
                    onPress={() => setWeightUnit(unit)}
                    className="px-3 py-2"
                    style={{
                      backgroundColor:
                        weightUnit === unit
                          ? colors.primary
                          : colors.surfaceAlt,
                    }}
                  >
                    <Text
                      className="text-sm font-semibold"
                      style={{
                        color:
                          weightUnit === unit ? "#FFFFFF" : colors.textPrimary,
                      }}
                    >
                      {unit}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View>
            <Text
              className="text-sm font-semibold mb-2"
              style={{ color: colors.textSecondary }}
            >
              Activity Level
            </Text>
            <View className="gap-2">
              {activityLevels.map((level) => (
                <TouchableOpacity
                  key={level}
                  onPress={() => setActivityLevel(level)}
                  className="px-3 py-3 border rounded-md"
                  style={{
                    borderColor:
                      activityLevel === level ? colors.primary : colors.border,
                    backgroundColor:
                      activityLevel === level
                        ? colors.primary
                        : colors.surfaceAlt,
                  }}
                >
                  <Text
                    className="text-md font-medium"
                    style={{
                      color:
                        activityLevel === level
                          ? "#FFFFFF"
                          : colors.textPrimary,
                    }}
                  >
                    {getActivityLabel(level)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSetupComplete}
            className="py-3 rounded-md items-center mt-3"
            style={{ backgroundColor: colors.primary }}
          >
            <Text className="text-md font-semibold text-white">
              Save Settings
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheetModal>
    </SafeArea>
  );
}
