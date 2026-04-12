import { IntakeLog } from "@/components/hydration/IntakeLog";
import { SetupModal } from "@/components/hydration/SetupModal";
import { WaterBottle } from "@/components/hydration/WaterBottle";
import SafeArea from "@/components/shared/SafeArea";
import { Colors } from "@/constants/colors";
import {
  borderRadius,
  fontSizes,
  fontWeights,
  spacing,
} from "@/constants/theme";
import { useHydration } from "@/hooks/useHydration";
import { useTheme } from "@/hooks/useTheme";
import type { HydrationUser } from "@/types/hydration.types";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
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
    isSetupComplete,
    isReady,
    saveUser,
    addEntry,
    deleteEntry,
  } = useHydration();

  const [showSetup, setShowSetup] = useState(!isSetupComplete);

  const handleSetupComplete = (newUser: HydrationUser) => {
    saveUser(newUser);
    setShowSetup(false);
  };

  if (!isReady) {
    return (
      <SafeArea
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeArea>
    );
  }

  if (!isSetupComplete) {
    return (
      <SafeArea>
        <SetupModal visible={showSetup} onComplete={handleSetupComplete} />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: spacing.space4,
          }}
        >
          <Ionicons
            name="water-outline"
            size={60}
            color={colors.primary}
            style={{ marginBottom: spacing.space4 }}
          />
          <Text
            style={{
              fontSize: fontSizes.xxl,
              fontWeight: fontWeights.bold,
              color: colors.textPrimary,
              marginBottom: spacing.space2,
              textAlign: "center",
            }}
          >
            Track Your Hydration
          </Text>
          <Text
            style={{
              fontSize: fontSizes.md,
              color: colors.textSecondary,
              textAlign: "center",
              marginBottom: spacing.space8,
            }}
          >
            Let&apos;s set up your daily water goal
          </Text>
        </View>
      </SafeArea>
    );
  }

  return (
    <SafeArea
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: spacing.space10,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row justify-between items-center px-4 pt-3 mb-2">
          <View>
            <Text
              className="text-3xl font-jakarta text-blue-50"
              style={{
                color: colors.textPrimary,
              }}
            >
              Hydration
            </Text>
            {isGoalReached && (
              <Text
                className="text-sm font-semibold mt-1"
                style={{
                  color: Colors.semantic.success,
                }}
              >
                ✓ Goal reached!
              </Text>
            )}
          </View>
          <TouchableOpacity onPress={() => setShowSetup(true)} className="p-2">
            <Ionicons
              name="settings-outline"
              size={24}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <View className="px-4 mb-2">
          <Text
            className="text-sm text-blue-300"
            style={{
              color: colors.textSecondary,
            }}
          >
            Daily goal: {dailyGoal} ml
          </Text>
        </View>

        <View
          style={{
            alignItems: "center",
          }}
        >
          <WaterBottle percentage={percentage} isGoalReached={isGoalReached} />

          <View
            style={{
              alignItems: "center",
              marginBottom: spacing.space5,
            }}
          >
            <Text
              style={{
                fontSize: fontSizes.display,
                fontWeight: fontWeights.bold,
                color: colors.primary,
              }}
            >
              {todayTotal}
            </Text>
            <Text
              style={{
                fontSize: fontSizes.sm,
                color: colors.textSecondary,
                marginTop: spacing.space1,
              }}
            >
              {todayTotal} ml / {dailyGoal} ml ({percentage}%)
            </Text>
          </View>
        </View>

        <View
          style={{
            paddingHorizontal: spacing.space4,
            gap: spacing.space3,
            marginBottom: spacing.space5,
          }}
        >
          <TouchableOpacity
            onPress={() => addEntry(250)}
            style={{
              paddingVertical: spacing.space3,
              borderRadius: borderRadius.radiusMd,
              backgroundColor: colors.primary,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: fontSizes.md,
                fontWeight: fontWeights.semibold,
                color: "#FFFFFF",
              }}
            >
              + Add Cup (250 ml)
            </Text>
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "row",
              gap: spacing.space2,
            }}
          >
            {[100, 150, 200, 300].map((amount) => (
              <TouchableOpacity
                key={amount}
                onPress={() => addEntry(amount)}
                style={{
                  flex: 1,
                  paddingVertical: spacing.space3,
                  borderRadius: borderRadius.radiusMd,
                  backgroundColor: colors.surfaceAlt,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <Text
                  style={{
                    fontSize: fontSizes.sm,
                    fontWeight: fontWeights.semibold,
                    color: colors.textPrimary,
                  }}
                >
                  {amount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View
          style={{
            paddingHorizontal: spacing.space4,
          }}
        >
          <IntakeLog logs={logs} onDeleteEntry={deleteEntry} />
        </View>
      </ScrollView>

      <SetupModal
        visible={showSetup}
        onComplete={handleSetupComplete}
        initialUser={user}
      />
    </SafeArea>
  );
}
