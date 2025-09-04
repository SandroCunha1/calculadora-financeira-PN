
import type { FinancialResults } from '../types';

const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const calculateNPV = (cashFlows: number[], rate: number): { value: number, steps: string[] } => {
    const steps: string[] = [`Taxa de Desconto: ${(rate * 100).toFixed(2)}%`];
    let npv = cashFlows[0] || 0;
    steps.push(`Período 0 (Investimento): ${formatCurrency(cashFlows[0] || 0)}`);

    for (let i = 1; i < cashFlows.length; i++) {
        const discountedValue = cashFlows[i] / Math.pow(1 + rate, i);
        npv += discountedValue;
        steps.push(`Período ${i}: ${formatCurrency(cashFlows[i])} / (1 + ${rate.toFixed(3)})^${i} = ${formatCurrency(discountedValue)}`);
    }
    steps.push(`VPL Final = ${formatCurrency(npv)}`);
    return { value: npv, steps };
};

const calculateIRR = (cashFlows: number[], maxIterations = 1000, tolerance = 1e-7): number | null => {
    if (!cashFlows.length || cashFlows[0] >= 0) return null;

    let low = -0.99;
    let high = 10.0; // 1000%
    let mid = 0;

    for (let i = 0; i < maxIterations; i++) {
        mid = (low + high) / 2;
        const { value: npvAtMid } = calculateNPV(cashFlows, mid);

        if (Math.abs(npvAtMid) < tolerance) {
            return mid;
        }

        const { value: npvAtLow } = calculateNPV(cashFlows, low);

        if (npvAtLow * npvAtMid < 0) {
            high = mid;
        } else {
            low = mid;
        }
    }

    return null; // Did not converge
};

const calculatePayback = (cashFlows: number[]): number | string => {
    if (!cashFlows.length || cashFlows[0] >= 0) return "N/A (sem invest. inicial)";

    let cumulativeCashFlow = cashFlows[0];
    if (cumulativeCashFlow >= 0) return 0;

    for (let i = 1; i < cashFlows.length; i++) {
        const lastCumulative = cumulativeCashFlow;
        cumulativeCashFlow += cashFlows[i];
        if (cumulativeCashFlow >= 0) {
            if (cashFlows[i] === 0) continue; // Avoid division by zero
            const fraction = -lastCumulative / cashFlows[i];
            return (i - 1) + fraction;
        }
    }
    
    return "Nunca";
};

export const calculateFinancials = (cashFlows: number[], discountRate: number): FinancialResults => {
    const { value: npv, steps: npvSteps } = calculateNPV(cashFlows, discountRate);
    const irr = calculateIRR(cashFlows);
    const paybackPeriod = calculatePayback(cashFlows);
    const netProfit = cashFlows.reduce((sum, cf) => sum + cf, 0);
    const totalCashFlow = cashFlows.slice(1).reduce((sum, cf) => sum + cf, 0);

    return {
        npv,
        irr,
        paybackPeriod,
        totalCashFlow,
        netProfit,
        calculationSteps: {
            npv: npvSteps
        }
    };
};
