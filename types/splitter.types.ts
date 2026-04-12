export interface SplitState {
  billAmount: string;
  tipPercentage: number;
  customTipPercentage: string;
  numberOfPeople: number;
  personNames: string[];
  showNameInputs: boolean;
}

export interface SplitResult {
  subtotal: number;
  tipAmount: number;
  total: number;
  perPerson: number;
}

export interface PersonSplit {
  index: number;
  name: string;
  amount: number;
}
