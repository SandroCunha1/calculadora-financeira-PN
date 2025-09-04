
import React from 'react';

interface InputFormProps {
    periods: number;
    setPeriods: (periods: number) => void;
    discountRate: number;
    setDiscountRate: (rate: number) => void;
}

export const InputForm: React.FC<InputFormProps> = ({ periods, setPeriods, discountRate, setDiscountRate }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="periods" className="block text-sm font-medium text-gray-400 mb-2">
                    Número de Períodos (ex: anos, meses)
                </label>
                <input
                    type="number"
                    id="periods"
                    value={periods}
                    onChange={(e) => setPeriods(Math.max(1, parseInt(e.target.value, 10)))}
                    min="1"
                    className="w-full bg-gray-700 text-gray-200 border border-gray-600 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
            </div>
            <div>
                <label htmlFor="discountRate" className="block text-sm font-medium text-gray-400 mb-2">
                    Taxa de Desconto / Custo de Capital (%)
                </label>
                <input
                    type="number"
                    id="discountRate"
                    value={discountRate}
                    onChange={(e) => setDiscountRate(parseFloat(e.target.value))}
                    step="0.1"
                    className="w-full bg-gray-700 text-gray-200 border border-gray-600 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
            </div>
        </div>
    );
};
