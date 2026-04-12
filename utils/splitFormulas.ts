export function calculateTip(
  billAmount: number,
  tipPercentage: number
): number {
  return (billAmount * tipPercentage) / 100;
}

export function calculateTotal(billAmount: number, tipAmount: number): number {
  return billAmount + tipAmount;
}

export function calculatePerPerson(
  total: number,
  numberOfPeople: number
): number {
  if (numberOfPeople <= 0) return 0;
  return total / numberOfPeople;
}

export function calculateSplit(
  billAmount: number,
  tipPercentage: number,
  numberOfPeople: number
) {
  const tipAmount = calculateTip(billAmount, tipPercentage);
  const total = calculateTotal(billAmount, tipAmount);
  const perPerson = calculatePerPerson(total, numberOfPeople);

  return {
    subtotal: billAmount,
    tipAmount,
    total,
    perPerson,
  };
}

export function generateShareText(
  billAmount: number,
  tipAmount: number,
  total: number,
  perPerson: number,
  numberOfPeople: number,
  personNames?: string[]
): string {
  const lines = [
    "Bill Summary",
    "━━━━━━━━━━━━━━━",
    `Subtotal: ${billAmount.toFixed(2)}`,
    `Tip: ${tipAmount.toFixed(2)}`,
    `Total: ${total.toFixed(2)}`,
    "━━━━━━━━━━━━━━━",
  ];

  if (personNames && personNames.some((name) => name.trim())) {
    lines.push("");
    personNames.forEach((name, index) => {
      const displayName = name.trim() || `Person ${index + 1}`;
      lines.push(`${displayName}: ${perPerson.toFixed(2)}`);
    });
  } else {
    lines.push(`Per person (${numberOfPeople}): ${perPerson.toFixed(2)}`);
  }

  return lines.join("\n");
}
