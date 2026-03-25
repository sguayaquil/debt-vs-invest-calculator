# Debt vs. Invest Calculator

A modern, interactive tool to help determine if it's better to pay off debt or invest your savings.

## Features
- **Dynamic Comparisons:** Compares two strategies: "Pay Off Debt First" vs. "Invest Lump Sum Now".
- **Interactive Charts:** Visualizes portfolio growth over a 10-30 year horizon.
- **Customizable Portfolio:** Set your own stock/bond mix and expected return rates.
- **Financial Logic:** Calculates exact monthly payments and compound interest growth.

## How to Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:5173`.

## Financial Formula
- **Scenario A (Pay Debt):** Assumes the user pays off the loan immediately using a lump sum and then invests the equivalent of the `Monthly Payment` into the market every month.
- **Scenario B (Invest Now):** Assumes the user invests the lump sum immediately and continues to pay the `Monthly Payment` to the bank until the loan is cleared. Once cleared, the `Monthly Payment` is diverted into the investment portfolio.
