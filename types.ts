
export interface CashFlow {
  value: number;
}

export interface FinancialResults {
  npv: number;
  irr: number | null;
  paybackPeriod: number | string;
  totalCashFlow: number;
  netProfit: number;
  calculationSteps: {
    npv: string[];
  };
}
