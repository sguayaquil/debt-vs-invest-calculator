# Project Overview: Debt vs. Invest Strategic Calculator

## 1. Executive Summary
The **Debt vs. Invest Calculator** is an advanced financial decision-support tool designed to resolve the classic dilemma: *Should I pay off my debt immediately or invest my capital in the market?* Unlike simple calculators, this tool utilizes historical market data, volatility modeling, and stress-testing simulations to provide a multi-dimensional view of a user's financial future over a 10-to-30-year horizon.

## 2. Core Capabilities
The tool simulates two primary financial paths:
*   **Scenario A (Debt Focus):** The user clears their debt immediately using a lump sum and subsequently invests the "freed up" monthly loan payments into a selected investment vehicle.
*   **Scenario B (Investment Focus):** The user invests the lump sum immediately, allowing for maximum compound interest growth, while continuing to make minimum monthly payments toward their debt.

## 3. Key Features

### A. Dynamic Asset Selection
Users are not limited to arbitrary return rates. The tool provides a selection of the "Top 5" market-leading ETFs and cash equivalents, pre-loaded with 10-year historical CAGR (Compound Annual Growth Rate) and volatility (Standard Deviation) data:
*   **QQQ (Nasdaq-100):** High-growth technology focus.
*   **VOO (S&P 500):** Blue-chip US market standard.
*   **VTI (Total Stock Market):** Broad-based US exposure.
*   **VXUS (Total International):** Global diversification.
*   **BND (Total Bond Market):** Conservative income/stability.
*   **Savings Account:** Risk-free high-yield cash equivalent (4.0% APY).

### B. Probabilistic Risk Modeling
The tool goes beyond "average" returns by rendering a probability cone on the growth chart:
*   **Average Case:** Based on historical CAGR.
*   **Best Case (+1 SD):** Visualizes performance in a strong bull market.
*   **Worst Case (-1 SD):** Visualizes performance during market stagnation or a bear cycle.

### C. Market Crash Simulation
Users can "Stress Test" their chosen strategy by simulating a **30% market crash** in a specific year of the projection. This allows users to see if the "Investment Focus" strategy remains viable if a recession occurs early or late in their loan term.

### D. Historical Backtesting
To ground the projections in reality, the tool performs a "Backtest." It calculates what would have actually happened to a user's net worth if they had made this exact decision $X$ years ago, using the actual historical multiple of the selected asset.

### E. Integrated Strategy Analysis
The application performs an automated audit of the results:
*   **Interest Impact:** Calculates the exact dollar amount of interest paid over the life of the loan.
*   **Guaranteed vs. Variable Returns:** Justifies the recommendation by comparing the *guaranteed* risk-free return of paying off debt (the APR) against the *variable* expected return of the market.

## 4. User Experience & Design
*   **Interactive Visualizations:** Powered by `Chart.js`, offering tooltips and toggleable data series.
*   **Responsive Input Handling:** Smart fields that allow for empty-state clearing and real-time validation (e.g., crash year must be within the loan term).
*   **Professional Reporting:** One-click **Export to PDF** functionality that generates a clean, formatted A4 report suitable for financial planning records.
*   **Dark Mode Support:** A modern UI that respects system preferences for eye comfort.

## 5. Technical Stack
*   **Frontend:** React 18 with TypeScript for type-safe financial logic.
*   **Build Tool:** Vite for high-performance development and bundling.
*   **Visuals:** Chart.js 4 for rendering complex growth curves.
*   **Export:** html2pdf.js for client-side PDF generation.
