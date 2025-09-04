
import React from 'react';
import type { FinancialResults } from '../types';
import { TOOLTIP_TEXTS } from '../constants';
import { Tooltip } from './Tooltip';

interface ResultsPanelProps {
    results: FinancialResults | null;
}

const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const formatPercentage = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 2 }).format(value);

const ResultRow: React.FC<{ label: string; value: string; tooltipText: string }> = ({ label, value, tooltipText }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-700">
        <Tooltip text={tooltipText}>
            <span className="text-gray-400">{label}</span>
        </Tooltip>
        <span className="font-semibold text-lg text-white">{value}</span>
    </div>
);

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ results }) => {
    if (!results) {
        return <div className="text-center p-4">Calculando...</div>;
    }

    const paybackValue = typeof results.paybackPeriod === 'number' 
        ? `${results.paybackPeriod.toFixed(2)} períodos` 
        : results.paybackPeriod;
        
    const irrValue = results.irr !== null ? formatPercentage(results.irr) : 'N/A';

    return (
        <div className="bg-gray-900 p-6 rounded-lg space-y-2">
            <ResultRow label="VPL (Valor Presente Líquido)" value={formatCurrency(results.npv)} tooltipText={TOOLTIP_TEXTS.NPV} />
            <ResultRow label="TIR (Taxa Interna de Retorno)" value={irrValue} tooltipText={TOOLTIP_TEXTS.IRR} />
            <ResultRow label="Payback" value={paybackValue} tooltipText={TOOLTIP_TEXTS.PAYBACK} />
            <ResultRow label="Fluxo de Caixa Total" value={formatCurrency(results.totalCashFlow)} tooltipText={TOOLTIP_TEXTS.TOTAL_CASH_FLOW} />
            <ResultRow label="Lucro Líquido (Total)" value={formatCurrency(results.netProfit)} tooltipText={TOOLTIP_TEXTS.NET_PROFIT} />
            
            <div className="pt-4">
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">Como o VPL foi Calculado:</h3>
                <div className="bg-gray-800 p-3 rounded-md text-xs text-gray-400 space-y-1 max-h-40 overflow-y-auto">
                    {results.calculationSteps.npv.map((step, index) => (
                        <p key={index}>{step}</p>
                    ))}
                </div>
            </div>
        </div>
    );
};
