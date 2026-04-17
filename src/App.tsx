import React, { useState, useMemo } from 'react';
import './App.css';
import { calculateGrowthData, calculateMonthlyPayment, TOP_ETFS, calculateHistoricalBacktest } from './utils/finance';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const App: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number | ''>(50000);
  const [loanAPR, setLoanAPR] = useState<number | ''>(5);
  const [loanTerm, setLoanTerm] = useState<number | ''>(10);
  const [selectedEtf, setSelectedEtf] = useState(TOP_ETFS[1]); // Default VOO
  const [crashYear, setCrashYear] = useState<number | ''>('');

  const nLoanAmount = Number(loanAmount) || 0;
  const nLoanAPR = Number(loanAPR) || 0;
  const nLoanTerm = Number(loanTerm) || 0;

  const monthlyPayment = useMemo(() => 
    calculateMonthlyPayment(nLoanAmount, nLoanAPR, nLoanTerm),
    [nLoanAmount, nLoanAPR, nLoanTerm]
  );

  const growthData = useMemo(() => 
    calculateGrowthData(nLoanAmount, nLoanAPR, nLoanTerm, selectedEtf, crashYear),
    [nLoanAmount, nLoanAPR, nLoanTerm, selectedEtf, crashYear]
  );

  const exportToPdf = () => {
    const element = document.getElementById('report-content');
    if (!element) return;
    
    const opt = {
      margin: 10,
      filename: `Financial_Report_${selectedEtf.symbol}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        logging: false,
        width: 1200, // Explicitly capture 1200px
        windowWidth: 1200,
        onclone: (doc: Document) => {
          const el = doc.getElementById('report-content');
          if (el) {
            el.style.width = '1200px';
            el.style.maxWidth = '1200px';
            el.style.minWidth = '1200px';
            el.style.margin = '0';
            el.style.padding = '20px';
            el.style.left = '0';
            el.style.top = '0';
          }
        }
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    (html2pdf() as any).set(opt).from(element).save();
  };

  const chartData = {
    labels: growthData.map(d => `Year ${d.year}`),
    datasets: [
      {
        label: 'Pay Off Debt First (Scenario A)',
        data: growthData.map(d => d.scenarioA),
        borderColor: '#4caf50',
        backgroundColor: 'rgba(76, 175, 80, 0.5)',
        borderWidth: 3,
        pointRadius: 0,
      },
      {
        label: 'Invest Now (Avg Case)',
        data: growthData.map(d => d.scenarioB_Avg),
        borderColor: '#2196f3',
        backgroundColor: 'rgba(33, 150, 243, 0.5)',
        borderWidth: 2,
        pointRadius: 0,
      },
      {
        label: 'Invest Now (Best Case)',
        data: growthData.map(d => d.scenarioB_Best),
        borderColor: '#03a9f4',
        backgroundColor: 'rgba(3, 169, 244, 0.1)',
        borderWidth: 1,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: '+1',
      },
      {
        label: 'Invest Now (Worst Case)',
        data: growthData.map(d => d.scenarioB_Worst),
        borderColor: '#f44336',
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        borderWidth: 1,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
      },
    ],
  };

  const finalA = growthData[growthData.length - 1].scenarioA;
  const finalBAvg = growthData[growthData.length - 1].scenarioB_Avg;
  
  const winner = finalA > finalBAvg ? 'Pay Off Debt First' : 'Invest Now (Avg)';
  const difference = Math.abs(finalA - finalBAvg);

  const totalRepayment = monthlyPayment * (nLoanTerm * 12);
  const totalInterestPaid = Math.max(0, totalRepayment - nLoanAmount);

  const backtest = calculateHistoricalBacktest(selectedEtf, nLoanTerm, nLoanAmount);

  return (
    <div className="container" id="report-content">
      <header>
        <div className="header-top">
          <h1>Enhanced Debt vs. Invest Calculator</h1>
          <button 
            className="export-btn" 
            onClick={exportToPdf}
            data-html2canvas-ignore
          >
            Export PDF
          </button>
        </div>
        <p>Analyzing probability and historical context for {selectedEtf.symbol}.</p>
      </header>

      <div className="main-grid">
        <aside className="sidebar">
          <section className="input-group">
            <h3>Loan & Horizon Details</h3>
            <label>
              Loan Amount ($)
              <input type="number" value={loanAmount} onChange={e => setLoanAmount(e.target.value === '' ? '' : Number(e.target.value))} />
            </label>
            <label>
              APR (%)
              <input type="number" value={loanAPR} step="0.1" onChange={e => setLoanAPR(e.target.value === '' ? '' : Number(e.target.value))} />
            </label>
            <label>
              Term / Horizon (Years)
              <input type="number" value={loanTerm} onChange={e => setLoanTerm(e.target.value === '' ? '' : Number(e.target.value))} />
            </label>
            <div className="info-box">
              Estimated Monthly Payment: <strong>${monthlyPayment.toFixed(2)}</strong>
            </div>
          </section>

          <section className="input-group">
            <h3>Investment Choice</h3>
            <label>
              Select Strategy ETF
              <select 
                value={selectedEtf.symbol} 
                onChange={e => {
                  const etf = TOP_ETFS.find(t => t.symbol === e.target.value);
                  if (etf) setSelectedEtf(etf);
                }}
              >
                {TOP_ETFS.map(etf => (
                  <option key={etf.symbol} value={etf.symbol}>
                    {etf.symbol} - {etf.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Simulate Crash in Year:
              <input 
                type="number" 
                placeholder="None"
                min="1"
                max={nLoanTerm}
                value={crashYear} 
                onChange={e => {
                  const val = e.target.value === '' ? '' : Number(e.target.value);
                  if (val === '' || (val >= 0 && val <= nLoanTerm)) {
                    setCrashYear(val);
                  }
                }} 
              />
            </label>
            <div className="etf-info">
              <div className="etf-stat">
                <span>Avg Return:</span>
                <strong>{selectedEtf.cagr}%</strong>
              </div>
              <div className="etf-stat">
                <span>Volatility:</span>
                <strong>{selectedEtf.volatility}%</strong>
              </div>
            </div>
          </section>
        </aside>

        <main className="content">
          <div className="summary-card" data-winner={winner.includes('Debt') ? 'Pay Off Debt First' : 'Invest Now'}>
            <h2>Recommendation: {winner}</h2>
            <p>
              Over {nLoanTerm} years, Scenario B (Avg) is projected to {finalBAvg > finalA ? 'outperform' : 'underperform'} Scenario A by <strong>${difference.toLocaleString()}</strong>.
            </p>
          </div>

          <div className="chart-container">
            <Line 
              data={chartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                  legend: { 
                    position: 'bottom' as const,
                    labels: {
                      boxWidth: 15,
                      padding: 15,
                      usePointStyle: true,
                      pointStyle: 'circle'
                    }
                  },
                  title: { display: true, text: `Projection: ${selectedEtf.symbol} vs Loan (${nLoanAPR}%)` },
                },
                scales: {
                  y: { ticks: { callback: (value) => '$' + Number(value).toLocaleString() } }
                }
              }} 
            />
          </div>

          <div className="analysis-section">
            <h3>Strategy Analysis & Justification</h3>
            <div className="analysis-content">
              <div className="analysis-card">
                <h4>Interest Impact</h4>
                <p>
                  If you choose to carry the loan for the full {nLoanTerm} years, you will pay a total of 
                  <strong> ${totalInterestPaid.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong> in interest. 
                  Paying off the debt immediately is equivalent to a guaranteed, risk-free return of <strong>{nLoanAPR}%</strong>.
                </p>
              </div>
              <div className="analysis-card">
                <h4>Recommendation Rationale</h4>
                {finalA > finalBAvg ? (
                  <p>
                    <strong>Debt Payoff is prioritized:</strong> The high cost of interest (${totalInterestPaid.toLocaleString(undefined, { maximumFractionDigits: 0 })}) 
                    outweighs the expected average growth of {selectedEtf.symbol}. By eliminating the debt, you "earn" the interest 
                    saved and build a more stable foundation through monthly contributions.
                  </p>
                ) : (
                  <p>
                    <strong>Investment is prioritized:</strong> Despite paying ${totalInterestPaid.toLocaleString(undefined, { maximumFractionDigits: 0 })} in interest, 
                    the historical {selectedEtf.cagr}% CAGR of {selectedEtf.symbol} generates significantly more wealth 
                    by keeping your capital (${nLoanAmount.toLocaleString()}) fully deployed in the market from Day 1.
                  </p>
                )}
              </div>
            </div>
            <div className="risk-disclaimer">
              * Note: Scenario A (Debt Payoff) provides a <strong>guaranteed</strong> outcome, whereas Scenario B 
              relies on market performance and carries the risk of a {selectedEtf.volatility}% historical volatility.
            </div>
          </div>

          <div className="historical-comparison">
            <h3>Historical Comparison (Backtest)</h3>
            <div className="backtest-grid">
              <div className="backtest-card">
                <h4>What if you invested ${nLoanAmount.toLocaleString()} in {selectedEtf.symbol} {nLoanTerm} years ago?</h4>
                <div className="backtest-value">${backtest.finalValue.toLocaleString()}</div>
                <p>A {backtest.multiple}x return on your capital.</p>
              </div>
              <div className="backtest-card secondary">
                <h4>What if you paid off ${nLoanAmount.toLocaleString()} debt @ {nLoanAPR}% {nLoanTerm} years ago?</h4>
                <div className="backtest-value">${finalA.toLocaleString()}</div>
                <p>Portfolio value from diverted payments.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
