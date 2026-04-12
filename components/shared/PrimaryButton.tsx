import { fontSizes, fontWeights } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";
type IconPosition = "left" | "right";

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: IconPosition;
}

const variants: Record<
  ButtonVariant,
  { bg: string; activeOpacity: number; text: string }
> = {
  primary: { bg: "bg-blue-500", activeOpacity: 0.9, text: "text-white" },
  secondary: {
    bg: "bg-blue-800",
    activeOpacity: 0.9,
    text: "text-blue-100",
  },
  ghost: { bg: "bg-transparent", activeOpacity: 0.7, text: "text-blue-400" },
  danger: { bg: "bg-red-500", activeOpacity: 0.9, text: "text-white" },
};

const sizes: Record<
  ButtonSize,
  { height: number; px: string; text: string; radius: string }
> = {
  sm: {
    height: 36,
    px: "px-4",
    text: "text-sm",
    radius: "rounded-lg",
  },
  md: {
    height: 48,
    px: "px-6",
    text: "text-base",
    radius: "rounded-xl",
  },
  lg: {
    height: 56,
    px: "px-8",
    text: "text-lg",
    radius: "rounded-2xl",
  },
};

export function PrimaryButton({
  label,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
}: PrimaryButtonProps) {
  const { colors } = useTheme();
  const [isPressed, setIsPressed] = useState(false);

  const variantStyle = variants[variant];
  const sizeStyle = sizes[size];

  const bgColor =
    variant === "primary"
      ? colors.primary
      : variant === "secondary"
        ? colors.surface
        : variant === "danger"
          ? "#EF4444"
          : "transparent";

  const textColor =
    variant === "primary"
      ? "#FFFFFF"
      : variant === "secondary"
        ? colors.textSecondary
        : variant === "danger"
          ? "#FFFFFF"
          : colors.primary;

  const borderColor = variant === "secondary" ? colors.border : "transparent";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={variantStyle.activeOpacity}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      className={`${sizeStyle.px} ${sizeStyle.radius} flex-row items-center justify-center`}
      style={{
        height: sizeStyle.height,
        backgroundColor: disabled ? `${bgColor}80` : bgColor,
        borderWidth: variant === "secondary" ? 1 : 0,
        borderColor,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <Ionicons
              name={icon as any}
              size={20}
              color={textColor}
              style={{ marginRight: 8 }}
            />
          )}
          <Text
            className={`${sizeStyle.text} font-semibold`}
            style={{
              color: textColor,
              fontSize:
                fontSizes[size === "sm" ? "sm" : size === "md" ? "md" : "lg"],
              fontWeight: fontWeights.semibold,
            }}
          >
            {label}
          </Text>
          {icon && iconPosition === "right" && (
            <Ionicons
              name={icon as any}
              size={20}
              color={textColor}
              style={{ marginLeft: 8 }}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
}
