
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import type { CashFlow } from '../types';

interface CashFlowChartProps {
    data: CashFlow[];
}

export const CashFlowChart: React.FC<CashFlowChartProps> = ({ data }) => {
    const chartData = data.map((cf, index) => ({
        name: index === 0 ? 'Invest.' : `Per. ${index}`,
        valor: cf.value,
    }));

    const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" tickFormatter={formatCurrency} />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#1e1e1e',
                        borderColor: '#444444',
                        color: '#e5e7eb',
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                />
                <Legend />
                <Bar dataKey="valor" name="Fluxo de Caixa">
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.valor >= 0 ? '#22c55e' : '#ef4444'} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};
