export type UnitCategoryId = "length" | "weight" | "temperature" | "speed";

export interface Unit {
  id: string;
  label: string;
  symbol: string;
}

export interface UnitCategory {
  id: UnitCategoryId;
  label: string;
  units: Unit[];
}

export interface ConversionState {
  category: UnitCategoryId;
  fromUnitId: string;
  toUnitId: string;
  inputValue: string;
  result: number | null;
  error: string | null;
}

export interface ConversionConfig {
  fromUnit: Unit;
  toUnit: Unit;
  value: number;
}

export interface ConversionResult {
  value: number;
  formula: string;
}
