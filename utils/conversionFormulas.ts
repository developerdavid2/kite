import type { ConversionResult } from "@/types/converter.types";

const lengthToMeters: Record<string, number> = {
  millimeter: 0.001,
  centimeter: 0.01,
  meter: 1,
  kilometer: 1000,
  inch: 0.0254,
  foot: 0.3048,
  yard: 0.9144,
  mile: 1609.34,
};

const weightToKilograms: Record<string, number> = {
  milligram: 0.000001,
  gram: 0.001,
  kilogram: 1,
  ounce: 0.0283495,
  pound: 0.453592,
  stone: 6.35029,
  ton: 1000,
};

const speedToMps: Record<string, number> = {
  metersPerSecond: 1,
  kilometersPerHour: 1 / 3.6,
  milesPerHour: 0.44704,
  knots: 0.51444,
};

const lengthConversions: Record<string, number> = Object.entries(
  lengthToMeters
).reduce(
  (acc, [unit, metersValue]) => {
    acc[unit] = metersValue;
    return acc;
  },
  {} as Record<string, number>
);

const weightConversions: Record<string, number> = Object.entries(
  weightToKilograms
).reduce(
  (acc, [unit, kgValue]) => {
    acc[unit] = kgValue;
    return acc;
  },
  {} as Record<string, number>
);

const speedConversions: Record<string, number> = Object.entries(
  speedToMps
).reduce(
  (acc, [unit, mpsValue]) => {
    acc[unit] = mpsValue;
    return acc;
  },
  {} as Record<string, number>
);

function convertLength(
  value: number,
  fromUnit: string,
  toUnit: string
): ConversionResult {
  const metersValue = value * (lengthConversions[fromUnit] ?? 1);
  const result = metersValue / (lengthConversions[toUnit] ?? 1);
  const fromFactor = lengthToMeters[fromUnit] || 1;
  const toFactor = lengthToMeters[toUnit] || 1;
  const ratio = toFactor / fromFactor;
  const formula =
    ratio === 1
      ? `1 ${fromUnit} = 1 ${toUnit}`
      : `1 ${fromUnit} = ${ratio.toFixed(5)} ${toUnit}`;

  return { value: result, formula };
}

function convertWeight(
  value: number,
  fromUnit: string,
  toUnit: string
): ConversionResult {
  const kgValue = value * (weightConversions[fromUnit] ?? 1);
  const result = kgValue / (weightConversions[toUnit] ?? 1);
  const fromFactor = weightToKilograms[fromUnit] || 1;
  const toFactor = weightToKilograms[toUnit] || 1;
  const ratio = toFactor / fromFactor;
  const formula =
    ratio === 1
      ? `1 ${fromUnit} = 1 ${toUnit}`
      : `1 ${fromUnit} = ${ratio.toFixed(5)} ${toUnit}`;

  return { value: result, formula };
}

function convertTemperature(
  value: number,
  fromUnit: string,
  toUnit: string
): ConversionResult {
  let celsius = value;

  if (fromUnit === "fahrenheit") {
    celsius = ((value - 32) * 5) / 9;
  } else if (fromUnit === "kelvin") {
    celsius = value - 273.15;
  }

  let result = celsius;
  if (toUnit === "fahrenheit") {
    result = (celsius * 9) / 5 + 32;
  } else if (toUnit === "kelvin") {
    result = celsius + 273.15;
  }

  const units = { celsius: "°C", fahrenheit: "°F", kelvin: "K" };
  const fromLabel = units[fromUnit as keyof typeof units] || fromUnit;
  const toLabel = units[toUnit as keyof typeof units] || toUnit;

  let formula = "";
  if (fromUnit === "celsius" && toUnit === "fahrenheit") {
    formula = "°F = (°C × 9/5) + 32";
  } else if (fromUnit === "fahrenheit" && toUnit === "celsius") {
    formula = "°C = (°F - 32) × 5/9";
  } else if (fromUnit === "celsius" && toUnit === "kelvin") {
    formula = "K = °C + 273.15";
  } else if (fromUnit === "kelvin" && toUnit === "celsius") {
    formula = "°C = K - 273.15";
  } else if (fromUnit === "fahrenheit" && toUnit === "kelvin") {
    formula = "K = (°F - 32) × 5/9 + 273.15";
  } else if (fromUnit === "kelvin" && toUnit === "fahrenheit") {
    formula = "°F = (K - 273.15) × 9/5 + 32";
  } else {
    formula = `1 ${fromLabel} = 1 ${toLabel}`;
  }

  return { value: result, formula };
}

function convertSpeed(
  value: number,
  fromUnit: string,
  toUnit: string
): ConversionResult {
  const mpsValue = value * (speedConversions[fromUnit] ?? 1);
  const result = mpsValue / (speedConversions[toUnit] ?? 1);
  const fromFactor = speedToMps[fromUnit] || 1;
  const toFactor = speedToMps[toUnit] || 1;
  const ratio = toFactor / fromFactor;
  const formula =
    ratio === 1
      ? `1 ${fromUnit} = 1 ${toUnit}`
      : `1 ${fromUnit} = ${ratio.toFixed(5)} ${toUnit}`;

  return { value: result, formula };
}

export function convert(
  value: number,
  category: string,
  fromUnit: string,
  toUnit: string
): ConversionResult {
  if (fromUnit === toUnit) {
    return { value, formula: `1 ${fromUnit} = 1 ${toUnit}` };
  }

  switch (category) {
    case "length":
      return convertLength(value, fromUnit, toUnit);
    case "weight":
      return convertWeight(value, fromUnit, toUnit);
    case "temperature":
      return convertTemperature(value, fromUnit, toUnit);
    case "speed":
      return convertSpeed(value, fromUnit, toUnit);
    default:
      return { value, formula: "" };
  }
}
