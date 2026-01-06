# Goal-Based Savings Planner

A beautiful, client-side web application for tracking your savings goals with real-time currency conversion between INR and USD.

## Features

- **Add Savings Goals** - Create goals with name, target amount, and currency (INR/USD)
- **Progress Tracking** - Visual progress bars showing how close you are to each goal
- **Contributions** - Add contributions to goals with date tracking
- **Live Exchange Rates** - Fetches real-time INR ↔ USD rates from exchangerate-api
- **Currency Conversion** - See goal amounts converted to the alternate currency
- **Summary Dashboard** - Overview of total targets, savings, and overall progress
- **Persistent Storage** - All data saved in localStorage
- **Responsive Design** - Works beautifully on desktop and mobile

## Tech Stack

- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Lucide React (icons)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open http://localhost:5173 in your browser

## Project Structure

```
src/
├── components/
│   ├── AddGoalForm.tsx      # Form to create new goals
│   ├── ContributionModal.tsx # Modal for adding contributions
│   ├── EmptyState.tsx       # Shown when no goals exist
│   ├── GoalCard.tsx         # Individual goal display card
│   └── SummaryBanner.tsx    # Top summary with totals
├── hooks/
│   ├── useExchangeRate.ts   # Exchange rate fetching & caching
│   └── useGoals.ts          # Goals state & localStorage
├── types/
│   └── goal.ts              # TypeScript interfaces
├── pages/
│   └── Index.tsx            # Main application page
└── index.css                # Design system & Tailwind config
```

## API

Exchange rates are fetched from [exchangerate-api.com](https://www.exchangerate-api.com/). Rates are cached for 1 hour to avoid rate limits.
