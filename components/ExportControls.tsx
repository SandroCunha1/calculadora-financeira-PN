
import React from 'react';

declare const html2canvas: any;
declare const jspdf: any;

interface ExportControlsProps {
    reportRef: React.RefObject<HTMLDivElement>;
}

export const ExportControls: React.FC<ExportControlsProps> = ({ reportRef }) => {
    
    const exportChartAsPNG = async () => {
        const chartElement = document.getElementById('cashflow-chart-container');
        if (chartElement) {
            const canvas = await html2canvas(chartElement, { backgroundColor: '#1e1e1e' });
            const image = canvas.toDataURL('image/png', 1.0);
            const link = document.createElement('a');
            link.href = image;
            link.download = 'diagrama-fluxo-caixa.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };
    
    const exportDataAsTXT = () => {
        const resultsElement = reportRef.current;
        if (resultsElement) {
            const data = Array.from(resultsElement.querySelectorAll('.flex.justify-between'))
                .map(row => {
                    const label = (row.children[0] as HTMLElement).innerText;
                    const value = (row.children[1] as HTMLElement).innerText;
                    return `${label}: ${value}`;
                })
                .join('\n');

            const blob = new Blob([`Resultados Financeiros\n\n${data}`], { type: 'text/plain;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'dados-financeiros.txt';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };
    
    const exportAsPDF = async () => {
        const reportElement = reportRef.current;
        if (reportElement) {
            const { jsPDF } = jspdf;
            const doc = new jsPDF('p', 'mm', 'a4');
            
            const canvas = await html2canvas(reportElement, {
                backgroundColor: '#1e1e1e',
                scale: 2 // Higher scale for better quality
            });
            const imgData = canvas.toDataURL('image/png');
            
            const imgProps= doc.getImageProperties(imgData);
            const pdfWidth = doc.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            doc.save('relatorio-financeiro.pdf');
        }
    };

    const DownloadIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
    );

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Exportar Relatório</h2>
            <div className="flex flex-wrap gap-4">
                <button onClick={exportChartAsPNG} className="flex items-center bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                    <DownloadIcon /> Baixar Gráfico (PNG)
                </button>
                <button onClick={exportDataAsTXT} className="flex items-center bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                    <DownloadIcon /> Baixar Dados (TXT)
                </button>
                <button onClick={exportAsPDF} className="flex items-center bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                    <DownloadIcon /> Baixar Relatório Completo (PDF)
                </button>
            </div>
        </div>
    );
};
