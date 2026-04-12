import type { SplitResult, SplitState } from "@/types/splitter.types";
import { calculateSplit } from "@/utils/splitFormulas";
import { useCallback, useMemo, useState } from "react";

export function useSplitter() {
  const [state, setState] = useState<SplitState>({
    billAmount: "",
    tipPercentage: 15,
    customTipPercentage: "",
    numberOfPeople: 2,
    personNames: ["", ""],
    showNameInputs: false,
  });

  const billValue = useMemo(
    () => parseFloat(state.billAmount) || 0,
    [state.billAmount]
  );

  const isValidBill = useMemo(() => billValue > 0, [billValue]);

  const result = useMemo<SplitResult>(() => {
    if (!isValidBill) {
      return { subtotal: 0, tipAmount: 0, total: 0, perPerson: 0 };
    }
    return calculateSplit(billValue, state.tipPercentage, state.numberOfPeople);
  }, [billValue, state.tipPercentage, state.numberOfPeople, isValidBill]);

  const setBillAmount = useCallback((amount: string) => {
    setState((prev) => ({
      ...prev,
      billAmount: amount,
    }));
  }, []);

  const setTipPercentage = useCallback((percentage: number) => {
    setState((prev) => ({
      ...prev,
      tipPercentage: percentage,
      customTipPercentage: "",
    }));
  }, []);

  const setCustomTipPercentage = useCallback((percentage: string) => {
    const numPercentage = parseFloat(percentage) || 0;
    setState((prev) => ({
      ...prev,
      customTipPercentage: percentage,
      tipPercentage: numPercentage,
    }));
  }, []);

  const setNumberOfPeople = useCallback((count: number) => {
    const validCount = Math.max(1, Math.min(20, count));
    setState((prev) => ({
      ...prev,
      numberOfPeople: validCount,
      personNames: Array.from(
        { length: validCount },
        (_, i) => prev.personNames[i] || ""
      ),
    }));
  }, []);

  const setPersonName = useCallback((index: number, name: string) => {
    setState((prev) => {
      const newNames = [...prev.personNames];
      newNames[index] = name;
      return {
        ...prev,
        personNames: newNames,
      };
    });
  }, []);

  const toggleNameInputs = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showNameInputs: !prev.showNameInputs,
    }));
  }, []);

  return {
    state,
    isValidBill,
    result,
    setBillAmount,
    setTipPercentage,
    setCustomTipPercentage,
    setNumberOfPeople,
    setPersonName,
    toggleNameInputs,
  };
}
