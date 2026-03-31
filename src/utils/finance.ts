export const calculateMonthlyPayment = (principal: number, annualRate: number, termYears: number): number => {
  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = termYears * 12;
  
  if (monthlyRate === 0) return principal / numberOfPayments;
  
  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
  );
};

export interface ETF {
  symbol: string;
  name: string;
  cagr: number;
  volatility: number;
}

export const TOP_ETFS: ETF[] = [
  { symbol: 'QQQ', name: 'Invesco QQQ (Nasdaq-100)', cagr: 19.62, volatility: 23.99 },
  { symbol: 'VOO', name: 'Vanguard S&P 500', cagr: 14.29, volatility: 15.17 },
  { symbol: 'VTI', name: 'Vanguard Total Stock Market', cagr: 13.69, volatility: 15.63 },
  { symbol: 'VXUS', name: 'Vanguard Total Intl Stock', cagr: 8.39, volatility: 14.34 },
  { symbol: 'BND', name: 'Vanguard Total Bond Market', cagr: 1.82, volatility: 4.21 },
  { symbol: 'SAVINGS', name: 'High-Yield Savings Account', cagr: 4.00, volatility: 0.50 },
];

export interface PortfolioDataPoint {
  month: number;
  year: number;
  scenarioA: number; // Pay Debt First
  scenarioB_Avg: number; // Invest Now (Average)
  scenarioB_Best: number; // Invest Now (+1 SD)
  scenarioB_Worst: number; // Invest Now (-1 SD)
}

export const calculateGrowthData = (
  loanAmount: number,
  loanAPR: number,
  loanTermYears: number,
  selectedEtf: ETF
): PortfolioDataPoint[] => {
  const monthlyPayment = calculateMonthlyPayment(loanAmount, loanAPR, loanTermYears);
  const totalMonths = loanTermYears * 12;
  
  const avgMonthlyReturn = selectedEtf.cagr / 100 / 12;
  const bestMonthlyReturn = (selectedEtf.cagr + selectedEtf.volatility) / 100 / 12;
  const worstMonthlyReturn = (selectedEtf.cagr - selectedEtf.volatility) / 100 / 12;
  
  const data: PortfolioDataPoint[] = [];
  
  let balanceA = 0;
  let balanceB_Avg = loanAmount;
  let balanceB_Best = loanAmount;
  let balanceB_Worst = loanAmount;
  
  data.push({
    month: 0,
    year: 0,
    scenarioA: balanceA,
    scenarioB_Avg: balanceB_Avg,
    scenarioB_Best: balanceB_Best,
    scenarioB_Worst: balanceB_Worst
  });
  
  for (let m = 1; m <= totalMonths; m++) {
    // Scenario A: Invest the monthly payment from month 1 (using average return for conservative A)
    balanceA = balanceA * (1 + avgMonthlyReturn) + monthlyPayment;
    
    // Scenario B: Growth only (as loan payoff is sync'd with comparison horizon, loan is active for whole period)
    balanceB_Avg = balanceB_Avg * (1 + avgMonthlyReturn);
    balanceB_Best = balanceB_Best * (1 + bestMonthlyReturn);
    balanceB_Worst = balanceB_Worst * (1 + worstMonthlyReturn);
    
    if (m % 12 === 0) {
      data.push({
        month: m,
        year: m / 12,
        scenarioA: Math.round(balanceA),
        scenarioB_Avg: Math.round(balanceB_Avg),
        scenarioB_Best: Math.round(balanceB_Best),
        scenarioB_Worst: Math.round(balanceB_Worst)
      });
    }
  }
  
  return data;
};

export const calculateHistoricalBacktest = (etf: ETF, yearsAgo: number, initialAmount: number) => {
  // Simple simulation using historical CAGR
  const totalGrowth = Math.pow(1 + etf.cagr / 100, yearsAgo);
  const finalValue = initialAmount * totalGrowth;
  return {
    finalValue: Math.round(finalValue),
    multiple: totalGrowth.toFixed(2)
  };
};
