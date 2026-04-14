// components/shared/BottomSheetModal.tsx
import {
  borderRadius,
  fontSizes,
  fontWeights,
  spacing,
} from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Portal } from "@gorhom/portal";
import React, {
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface BottomSheetModalRef {
  open: () => void;
  close: () => void;
}

interface BottomSheetModalProps {
  title: string;
  children: ReactNode;
  snapPoints?: (string | number)[];
  onClose?: () => void;
}

const BottomSheetModal = forwardRef<BottomSheetModalRef, BottomSheetModalProps>(
  ({ title, children, snapPoints: customSnapPoints, onClose }, ref) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const { colors, isDark } = useTheme();
    const insets = useSafeAreaInsets();

    const bottomInset = useMemo(() => {
      const safeAreaBottom = insets.bottom;
      return safeAreaBottom > 0 ? safeAreaBottom : 20;
    }, [insets.bottom]);

    const snapPoints = useMemo(
      () => customSnapPoints || ["60%", "85%"],
      [customSnapPoints]
    );

    // Handle keyboard events
    useEffect(() => {
      const expandedIndex = snapPoints.length > 1 ? 1 : 0;
      const keyboardDidShow = Keyboard.addListener("keyboardDidShow", () => {
        bottomSheetRef.current?.snapToIndex(expandedIndex);
      });

      const keyboardDidHide = Keyboard.addListener("keyboardDidHide", () => {
        bottomSheetRef.current?.snapToIndex(0);
      });

      return () => {
        keyboardDidShow.remove();
        keyboardDidHide.remove();
      };
    }, [snapPoints]);

    useImperativeHandle(ref, () => ({
      open: () => {
        bottomSheetRef.current?.snapToIndex(0);
      },
      close: () => {
        bottomSheetRef.current?.close();
        onClose?.();
      },
    }));

    const handleClose = useCallback(() => {
      bottomSheetRef.current?.close();
      onClose?.();
    }, [onClose]);

    const handleSheetChange = useCallback(
      (index: number) => {
        if (index === -1) {
          onClose?.();
        }
      },
      [onClose]
    );

    return (
      <Portal>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          bottomInset={bottomInset}
          enableDynamicSizing={false}
          enablePanDownToClose={true}
          enableOverDrag={false}
          animateOnMount={true}
          keyboardBehavior="extend"
          keyboardBlurBehavior="restore"
          android_keyboardInputMode="adjustResize"
          backgroundStyle={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          handleIndicatorStyle={{
            backgroundColor: colors.primary,
            width: 40,
            height: 4,
          }}
          handleStyle={{
            backgroundColor: colors.surface,
            borderTopLeftRadius: borderRadius.radiusXl,
            borderTopRightRadius: borderRadius.radiusXl,
          }}
          onChange={handleSheetChange}
        >
          <View style={[styles.container, { backgroundColor: colors.surface }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                {title}
              </Text>
              <TouchableOpacity onPress={handleClose}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Scrollable content */}
            <BottomSheetScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.content}
            >
              {children}
            </BottomSheetScrollView>
          </View>
        </BottomSheet>
      </Portal>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.space4,
    paddingVertical: spacing.space4,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
  },
  content: {
    padding: spacing.space4,
    paddingBottom: spacing.space10,
  },
});

BottomSheetModal.displayName = "BottomSheetModal";

export default BottomSheetModal;
