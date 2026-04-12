import SafeArea from "@/components/shared/SafeArea";
import { PeopleCounter } from "@/components/splitter/PeopleCounter";
import { SplitResult } from "@/components/splitter/SplitResult";
import { TipSelector } from "@/components/splitter/TipSelector";
import { spacing } from "@/constants/theme";
import { useSplitter } from "@/hooks/useSplitter";
import { useTheme } from "@/hooks/useTheme";
import { generateShareText } from "@/utils/splitFormulas";
import { Ionicons } from "@expo/vector-icons";
import {
  Alert,
  Clipboard,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export default function SplitterScreen() {
  const { colors } = useTheme();
  const {
    state,
    isValidBill,
    result,
    setBillAmount,
    setTipPercentage,
    setCustomTipPercentage,
    setNumberOfPeople,
    setPersonName,
    toggleNameInputs,
  } = useSplitter();

  const handleShare = async () => {
    try {
      const shareText = generateShareText(
        result.subtotal,
        result.tipAmount,
        result.total,
        result.perPerson,
        state.numberOfPeople,
        state.personNames
      );

      await Clipboard.setString(shareText);

      Alert.alert("Copied!", "Bill summary copied to clipboard");
    } catch {
      Alert.alert("Error", "Failed to copy to clipboard");
    }
  };

  return (
    <SafeArea
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: spacing.space10,
        }}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={Keyboard.dismiss}
      >
        <View className="px-4">
          <Text
            className="text-3xl font-jakarta text-blue-50"
            style={{
              color: colors.textPrimary,
              marginVertical: spacing.space5,
            }}
          >
            Split the Bill
          </Text>

          <View className="mb-5">
            <Text
              className="text-sm font-semibold text-blue-300 mb-3"
              style={{
                color: colors.textSecondary,
              }}
            >
              Bill Amount
            </Text>

            <View
              className="flex-row items-center gap-2 bg-blue-800 rounded-xl border border-blue-700 px-3"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
              }}
            >
              <Text
                className="text-lg font-jakarta text-blue-300"
                style={{
                  color: colors.textSecondary,
                }}
              >
                $
              </Text>
              <TextInput
                className="flex-1 text-3xl font-jakarta text-blue-50 py-4 p-0"
                style={{
                  color: colors.textPrimary,
                }}
                placeholder="0.00"
                placeholderTextColor={colors.textMuted}
                keyboardType="decimal-pad"
                value={state.billAmount}
                onChangeText={setBillAmount}
              />
            </View>
          </View>
        </View>

        {isValidBill && (
          <>
            <TipSelector
              tipPercentage={state.tipPercentage}
              customTipPercentage={state.customTipPercentage}
              onTipSelect={setTipPercentage}
              onCustomTipChange={setCustomTipPercentage}
            />

            <PeopleCounter
              count={state.numberOfPeople}
              onCountChange={setNumberOfPeople}
            />

            <SplitResult
              result={result}
              numberOfPeople={state.numberOfPeople}
              personNames={state.personNames}
              showNameInputs={state.showNameInputs}
              onPersonNameChange={setPersonName}
              onToggleNames={toggleNameInputs}
              onShare={handleShare}
              isVisible={isValidBill}
            />
          </>
        )}

        {!isValidBill && (
          <View className="my-10 items-center gap-3">
            <Ionicons
              name="calculator-outline"
              size={60}
              color={colors.textMuted}
            />
            <Text
              className="text-md text-gray-500 text-center"
              style={{
                color: colors.textMuted,
              }}
            >
              Enter a bill amount to get started
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeArea>
  );
}
