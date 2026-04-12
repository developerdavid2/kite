export interface Unit {
  id: string;
  label: string;
  symbol: string;
}

export interface UnitCategory {
  id: string;
  label: string;
  units: Unit[];
}

export const UnitCategories: UnitCategory[] = [
  {
    id: "length",
    label: "Length",
    units: [
      { id: "millimeter", label: "Millimeter", symbol: "mm" },
      { id: "centimeter", label: "Centimeter", symbol: "cm" },
      { id: "meter", label: "Meter", symbol: "m" },
      { id: "kilometer", label: "Kilometer", symbol: "km" },
      { id: "inch", label: "Inch", symbol: "in" },
      { id: "foot", label: "Foot", symbol: "ft" },
      { id: "yard", label: "Yard", symbol: "yd" },
      { id: "mile", label: "Mile", symbol: "mi" },
    ],
  },
  {
    id: "weight",
    label: "Weight",
    units: [
      { id: "milligram", label: "Milligram", symbol: "mg" },
      { id: "gram", label: "Gram", symbol: "g" },
      { id: "kilogram", label: "Kilogram", symbol: "kg" },
      { id: "ounce", label: "Ounce", symbol: "oz" },
      { id: "pound", label: "Pound", symbol: "lb" },
      { id: "stone", label: "Stone", symbol: "st" },
      { id: "ton", label: "Metric Ton", symbol: "t" },
    ],
  },
  {
    id: "temperature",
    label: "Temperature",
    units: [
      { id: "celsius", label: "Celsius", symbol: "°C" },
      { id: "fahrenheit", label: "Fahrenheit", symbol: "°F" },
      { id: "kelvin", label: "Kelvin", symbol: "K" },
    ],
  },
  {
    id: "speed",
    label: "Speed",
    units: [
      { id: "metersPerSecond", label: "Meters per Second", symbol: "m/s" },
      { id: "kilometersPerHour", label: "Kilometers per Hour", symbol: "km/h" },
      { id: "milesPerHour", label: "Miles per Hour", symbol: "mph" },
      { id: "knots", label: "Knots", symbol: "kn" },
    ],
  },
];

export const UnitsMap: Record<string, Unit> = UnitCategories.reduce(
  (map, category) => {
    category.units.forEach((unit) => {
      map[unit.id] = unit;
    });
    return map;
  },
  {} as Record<string, Unit>
);
