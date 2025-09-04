
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { InputForm } from './components/InputForm';
import { TimelineEditor } from './components/TimelineEditor';
import { CashFlowChart } from './components/CashFlowChart';
import { ResultsPanel } from './components/ResultsPanel';
import { ExportControls } from './components/ExportControls';
import { calculateFinancials } from './services/financialCalculations';
import type { FinancialResults, CashFlow } from './types';

const App: React.FC = () => {
    const [periods, setPeriods] = useState<number>(5);
    const [discountRate, setDiscountRate] = useState<number>(10);
    const [cashFlows, setCashFlows] = useState<CashFlow[]>([
        { value: -10000 }, { value: 3000 }, { value: 3500 }, { value: 4000 }, { value: 4500 }, { value: 5000 }
    ]);
    const [results, setResults] = useState<FinancialResults | null>(null);

    const reportRef = useRef<HTMLDivElement>(null);

    const handleCashFlowChange = useCallback((index: number, value: number) => {
        setCashFlows(currentCashFlows => {
            const newCashFlows = [...currentCashFlows];
            newCashFlows[index] = { value };
            return newCashFlows;
        });
    }, []);

    const handlePeriodsChange = useCallback((newPeriods: number) => {
        setPeriods(newPeriods);
        setCashFlows(current => {
            const newLength = newPeriods + 1;
            if (current.length > newLength) {
                return current.slice(0, newLength);
            }
            const newFlows = [...current];
            while (newFlows.length < newLength) {
                newFlows.push({ value: 0 });
            }
            return newFlows;
        });
    }, []);

    useEffect(() => {
        const rateAsDecimal = discountRate / 100;
        const calculatedResults = calculateFinancials(cashFlows.map(cf => cf.value), rateAsDecimal);
        setResults(calculatedResults);
    }, [cashFlows, discountRate]);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-cyan-400">Calculadora Financeira de Plano de Negócios</h1>
                    <p className="text-lg text-gray-400 mt-2">Analise a viabilidade do seu projeto com projeções de fluxo de caixa.</p>
                </header>
                
                <main className="space-y-8">
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                        <InputForm
                            periods={periods}
                            setPeriods={handlePeriodsChange}
                            discountRate={discountRate}
                            setDiscountRate={setDiscountRate}
                        />
                    </div>

                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                       <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Linha do Tempo do Fluxo de Caixa</h2>
                       <TimelineEditor
                           cashFlows={cashFlows}
                           onCashFlowChange={handleCashFlowChange}
                       />
                    </div>

                    <div ref={reportRef} className="bg-gray-800 p-6 rounded-xl shadow-lg" id="report-content">
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                            <div className="lg:col-span-3">
                                <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Diagrama de Fluxo de Caixa</h2>
                                <div id="cashflow-chart-container" className="h-96 bg-gray-900 p-4 rounded-lg">
                                  <CashFlowChart data={cashFlows} />
                                </div>
                            </div>
                            <div className="lg:col-span-2">
                                <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Resultados e Métricas</h2>
                                <ResultsPanel results={results} />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                        <ExportControls reportRef={reportRef} />
                    </div>

                </main>
                 <footer className="text-center mt-12 text-gray-600">
                    <p>Desenvolvido para análise de projetos e planos de negócio.</p>
                </footer>
            </div>
        </div>
    );
};

export default App;
