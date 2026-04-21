import { IntakeLog } from "@/components/hydration/IntakeLog";
import { WaterBottle } from "@/components/hydration/WaterBottle";
import SafeArea from "@/components/shared/SafeArea";
import { Colors } from "@/constants/colors";
import { fontSizes, fontWeights, spacing } from "@/constants/theme";
import { useHydration } from "@/hooks/useHydration";
import { useTheme } from "@/hooks/useTheme";
import type { ActivityLevel, LogEntry } from "@/types/hydration.types";
import { getActivityLabel } from "@/utils/hydrationFormulas";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HydrationScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
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

  const [setupVisible, setSetupVisible] = useState(false);
  const [weight, setWeight] = useState(user?.weight.toString() || "70");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">(
    user?.weightUnit || "kg",
  );
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(
    user?.activityLevel || "moderate",
  );

  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(400)).current;

  const animateIn = () => {
    overlayOpacity.setValue(0);
    sheetTranslateY.setValue(400);
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(sheetTranslateY, {
        toValue: 0,
        damping: 20,
        stiffness: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateOut = (onDone: () => void) => {
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: 400,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onDone());
  };

  const handleOpenSetup = () => {
    if (user) {
      setWeight(user.weight.toString());
      setWeightUnit(user.weightUnit);
      setActivityLevel(user.activityLevel);
    }
    setSetupVisible(true);
    animateIn();
  };

  const handleCloseSetup = () => {
    Keyboard.dismiss();
    animateOut(() => setSetupVisible(false));
  };

  const handleSetupComplete = () => {
    const weightNum = parseFloat(weight) || 70;
    saveUser({ weight: weightNum, weightUnit, activityLevel });
    handleCloseSetup();
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

  const ScrollableContent = () => (
    <View className="pb-10">
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

      <View className="gap-3 mb-5 px-4">
        <TouchableOpacity
          onPress={() => addEntry(250)}
          className="h-14 rounded-3xl items-center justify-center"
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

      <Text
        className="text-md font-semibold px-4 pt-2 pb-2"
        style={{ color: colors.textPrimary }}
      >
        Today&apos;s Log
      </Text>

      <FlatList
        data={sortedLogs}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
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
      <View className="px-4 pt-3 pb-2">
        <View className="flex-row justify-between items-center">
          <View>
            <Text
              className="text-3xl font-jakarta"
              style={{ color: colors.textPrimary }}
            >
              Hydration
            </Text>
          </View>
          <TouchableOpacity onPress={handleOpenSetup} className="p-2">
            <Ionicons
              name="settings-outline"
              size={24}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
        <Text className="text-sm" style={{ color: colors.textSecondary }}>
          Daily goal: {dailyGoal} ml
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

      <FlatList
        data={[{ key: "content" }]}
        keyExtractor={() => "content"}
        renderItem={() => <ScrollableContent />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing.space10 }}
      />

      <Modal
        visible={setupVisible}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={handleCloseSetup}
      >
        <View style={{ flex: 1 }}>
          <Animated.View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              opacity: overlayOpacity,
            }}
          >
            <TouchableWithoutFeedback onPress={handleCloseSetup}>
              <View style={{ flex: 1 }} />
            </TouchableWithoutFeedback>
          </Animated.View>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1, justifyContent: "flex-end" }}
          >
            <Animated.View
              style={{
                transform: [{ translateY: sheetTranslateY }],
                backgroundColor: colors.surface,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: spacing.space5,
                paddingBottom: Math.max(insets.bottom, spacing.space5),
                gap: spacing.space4,
              }}
            >
              <View style={{ alignItems: "center", marginBottom: -8 }}>
                <View
                  style={{
                    width: 36,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: colors.border,
                  }}
                />
              </View>

              <Text
                style={{
                  fontSize: fontSizes.lg,
                  fontWeight: fontWeights.semibold,
                  color: colors.textPrimary,
                }}
              >
                Hydration Setup
              </Text>

              <View>
                <Text
                  style={{
                    fontSize: fontSizes.sm,
                    fontWeight: fontWeights.semibold,
                    color: colors.textSecondary,
                    marginBottom: spacing.space2,
                  }}
                >
                  Your Weight
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    gap: spacing.space2,
                    alignItems: "center",
                  }}
                >
                  <TextInput
                    style={{
                      flex: 1,
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderRadius: 10,
                      paddingHorizontal: spacing.space4,
                      paddingVertical: spacing.space3,
                      fontSize: fontSizes.md,
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
                    style={{
                      flexDirection: "row",
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderRadius: 10,
                      overflow: "hidden",
                    }}
                  >
                    {(["kg", "lbs"] as const).map((unit) => (
                      <TouchableOpacity
                        key={unit}
                        onPress={() => setWeightUnit(unit)}
                        style={{
                          paddingHorizontal: spacing.space3,
                          paddingVertical: spacing.space3,
                          backgroundColor:
                            weightUnit === unit
                              ? colors.primary
                              : colors.surfaceAlt,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: fontSizes.sm,
                            fontWeight: fontWeights.semibold,
                            color:
                              weightUnit === unit
                                ? "#FFFFFF"
                                : colors.textPrimary,
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
                  style={{
                    fontSize: fontSizes.sm,
                    fontWeight: fontWeights.semibold,
                    color: colors.textSecondary,
                    marginBottom: spacing.space2,
                  }}
                >
                  Activity Level
                </Text>
                <View style={{ gap: spacing.space2 }}>
                  {activityLevels.map((level) => (
                    <TouchableOpacity
                      key={level}
                      onPress={() => setActivityLevel(level)}
                      style={{
                        paddingHorizontal: spacing.space3,
                        paddingVertical: spacing.space3,
                        borderWidth: 1,
                        borderRadius: 10,
                        borderColor:
                          activityLevel === level
                            ? colors.primary
                            : colors.border,
                        backgroundColor:
                          activityLevel === level
                            ? colors[700]
                            : colors.surfaceAlt,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: fontSizes.md,
                          fontWeight: fontWeights.medium,
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
                className="h-14 rounded-3xl items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <Text className="text-base font-jakarta text-white">
                  Save Settings
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeArea>
  );
}
