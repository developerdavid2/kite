import { fontSizes, fontWeights, spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { useState } from "react";
import { KeyboardTypeOptions, Text, TextInput, View } from "react-native";

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  error?: string;
  suffix?: string;
  prefix?: string;
  editable?: boolean;
}

export function InputField({
  label,
  value,
  onChangeText,
  placeholder = "",
  keyboardType = "default",
  error,
  suffix,
  prefix,
  editable = true,
}: InputFieldProps) {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="w-full mb-4">
      <Text
        className="text-sm font-medium text-blue-300 mb-1"
        style={{
          color: colors.textSecondary,
          fontSize: fontSizes.sm,
          fontWeight: fontWeights.medium,
          marginBottom: spacing.space1,
        }}
      >
        {label}
      </Text>

      <View
        className="flex-row items-center border border-blue-700 rounded-xl px-4 h-14"
        style={{
          backgroundColor: colors.surface,
          borderColor: isFocused ? colors.primary : colors.border,
        }}
      >
        {prefix && (
          <Text
            className="text-sm text-blue-400 mr-2"
            style={{
              color: colors.textSecondary,
              fontSize: fontSizes.sm,
            }}
          >
            {prefix}
          </Text>
        )}

        <TextInput
          className="flex-1 text-base text-blue-50"
          style={{
            color: colors.textPrimary,
            fontSize: fontSizes.md,
            padding: 0,
          }}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          keyboardType={keyboardType}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {suffix && (
          <Text
            className="text-sm text-blue-400 ml-2"
            style={{
              color: colors.textSecondary,
              fontSize: fontSizes.sm,
              marginLeft: spacing.space2,
            }}
          >
            {suffix}
          </Text>
        )}
      </View>

      {error && (
        <Text
          className="text-xs text-red-400 mt-1"
          style={{
            color: "#EF4444",
            fontSize: fontSizes.xs,
            marginTop: spacing.space1,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
