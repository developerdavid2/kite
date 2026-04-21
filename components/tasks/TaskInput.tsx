import { fontSizes, fontWeights, spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import {
  Animated,
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

export interface TaskInputRef {
  openAdd: () => void;
  openEdit: (id: number, currentTitle: string) => void;
}

interface TaskInputProps {
  onAdd: (title: string) => void;
  onEdit: (id: number, title: string) => void;
}

type ModalState =
  | { visible: false }
  | { visible: true; mode: "add" }
  | { visible: true; mode: "edit"; editId: number; initialValue: string };

export const TaskInput = forwardRef<TaskInputRef, TaskInputProps>(
  ({ onAdd, onEdit }, ref) => {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const [state, setState] = useState<ModalState>({ visible: false });
    const [value, setValue] = useState("");

    // Animation values
    const overlayOpacity = useRef(new Animated.Value(0)).current;
    const sheetTranslateY = useRef(new Animated.Value(300)).current;

    const animateIn = () => {
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
          toValue: 300,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => onDone());
    };

    useImperativeHandle(ref, () => ({
      openAdd: () => {
        setValue("");
        setState({ visible: true, mode: "add" });
        // Reset and animate in
        overlayOpacity.setValue(0);
        sheetTranslateY.setValue(300);
        animateIn();
      },
      openEdit: (id, currentTitle) => {
        setValue(currentTitle);
        setState({
          visible: true,
          mode: "edit",
          editId: id,
          initialValue: currentTitle,
        });
        overlayOpacity.setValue(0);
        sheetTranslateY.setValue(300);
        animateIn();
      },
    }));

    const handleClose = () => {
      Keyboard.dismiss();
      animateOut(() => setState({ visible: false }));
    };

    const handleSubmit = () => {
      const trimmed = value.trim();
      if (!trimmed || !state.visible) return;
      if (state.mode === "add") {
        onAdd(trimmed);
      } else {
        onEdit(state.editId, trimmed);
      }
      handleClose();
    };

    const isAdd = state.visible && state.mode === "add";

    return (
      <Modal
        visible={state.visible}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={handleClose}
      >
        {/* Full screen overlay — covers status bar */}
        <View style={{ flex: 1 }}>
          {/* Fading backdrop — absolute so it fills everything */}
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
            <TouchableWithoutFeedback onPress={handleClose}>
              <View style={{ flex: 1 }} />
            </TouchableWithoutFeedback>
          </Animated.View>

          {/* Sheet slides up from bottom */}
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
              {/* Drag handle */}
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
                {isAdd ? "New task" : "Edit task"}
              </Text>

              <TextInput
                autoFocus
                value={value}
                onChangeText={setValue}
                placeholder="What needs to be done?"
                placeholderTextColor={colors.textMuted}
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
                style={{
                  fontSize: fontSizes.md,
                  color: colors.textPrimary,
                  backgroundColor: colors.surfaceAlt,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 10,
                  paddingHorizontal: spacing.space4,
                  paddingVertical: spacing.space3,
                }}
              />

              <View style={{ flexDirection: "row", gap: spacing.space3 }}>
                <TouchableOpacity
                  onPress={handleClose}
                  style={{
                    flex: 1,
                    paddingVertical: spacing.space3,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: colors.border,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontWeight: fontWeights.medium,
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSubmit}
                  style={{
                    flex: 1,
                    paddingVertical: spacing.space3,
                    borderRadius: 10,
                    backgroundColor: colors.primary,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontWeight: fontWeights.semibold,
                    }}
                  >
                    {isAdd ? "Add task" : "Save"}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    );
  },
);

TaskInput.displayName = "TaskInput";
