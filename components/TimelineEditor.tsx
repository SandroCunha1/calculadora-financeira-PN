
import React from 'react';
import type { CashFlow } from '../types';

interface TimelineEditorProps {
    cashFlows: CashFlow[];
    onCashFlowChange: (index: number, value: number) => void;
}

export const TimelineEditor: React.FC<TimelineEditorProps> = ({ cashFlows, onCashFlowChange }) => {
    return (
        <div className="overflow-x-auto pb-4">
            <div className="flex space-x-4">
                {cashFlows.map((cf, index) => (
                    <div key={index} className="flex-shrink-0 w-40">
                        <label className={`block text-sm font-semibold mb-2 ${index === 0 ? 'text-red-400' : 'text-green-400'}`}>
                            {index === 0 ? 'Invest. Inicial' : `Período ${index}`}
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">R$</span>
                            <input
                                type="number"
                                value={cf.value}
                                onChange={(e) => onCashFlowChange(index, parseFloat(e.target.value) || 0)}
                                className="w-full bg-gray-700 text-gray-200 border border-gray-600 rounded-lg py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                placeholder="0"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
