import { UnitCategories, UnitsMap } from "@/constants/units";
import type { ConversionState, UnitCategoryId } from "@/types/converter.types";
import { convert } from "@/utils/conversionFormulas";
import { useCallback, useMemo, useState } from "react";

export function useUnitConverter() {
  const [state, setState] = useState<ConversionState>({
    category: "length",
    fromUnitId: "meter",
    toUnitId: "foot",
    inputValue: "1",
    result: null,
    error: null,
  });

  const currentCategory = useMemo(
    () => UnitCategories.find((cat) => cat.id === state.category),
    [state.category]
  );

  const fromUnit = useMemo(
    () => UnitsMap[state.fromUnitId],
    [state.fromUnitId]
  );

  const toUnit = useMemo(() => UnitsMap[state.toUnitId], [state.toUnitId]);

  const computedResult = useMemo(() => {
    if (!state.inputValue || state.inputValue === "0") {
      return { value: 0, formula: "" };
    }

    const inputNum = parseFloat(state.inputValue);
    if (isNaN(inputNum)) {
      return null;
    }

    try {
      return convert(
        inputNum,
        state.category,
        state.fromUnitId,
        state.toUnitId
      );
    } catch {
      return null;
    }
  }, [state.inputValue, state.category, state.fromUnitId, state.toUnitId]);

  const setCategory = useCallback((categoryId: UnitCategoryId) => {
    setState((prev) => {
      const newCategory = UnitCategories.find((cat) => cat.id === categoryId);
      const newFromUnitId = newCategory?.units[0]?.id || "meter";
      const newToUnitId = newCategory?.units[1]?.id || "foot";

      return {
        ...prev,
        category: categoryId,
        fromUnitId: newFromUnitId,
        toUnitId: newToUnitId,
        error: null,
      };
    });
  }, []);

  const setFromUnit = useCallback((unitId: string) => {
    setState((prev) => ({
      ...prev,
      fromUnitId: unitId,
      error: null,
    }));
  }, []);

  const setToUnit = useCallback((unitId: string) => {
    setState((prev) => ({
      ...prev,
      toUnitId: unitId,
      error: null,
    }));
  }, []);

  const setInputValue = useCallback((value: string) => {
    setState((prev) => ({
      ...prev,
      inputValue: value,
      error: null,
    }));
  }, []);

  const swap = useCallback(() => {
    setState((prev) => ({
      ...prev,
      fromUnitId: prev.toUnitId,
      toUnitId: prev.fromUnitId,
    }));
  }, []);

  return {
    state,
    currentCategory,
    fromUnit,
    toUnit,
    result: computedResult?.value ?? 0,
    formula: computedResult?.formula ?? "",
    setCategory,
    setFromUnit,
    setToUnit,
    setInputValue,
    swap,
  };
}
