import { Goal } from '@/types/goal';
import { RefreshCw, TrendingUp, Target, Wallet } from 'lucide-react';

interface SummaryBannerProps {
  goals: Goal[];
  rate: number | null;
  lastUpdated: string | null;
  isLoading: boolean;
  error: string | null;
  onRefreshRate: () => void;
}

function formatCurrency(amount: number, currency: 'INR' | 'USD') {
  return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(isoString: string) {
  return new Date(isoString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function SummaryBanner({
  goals,
  rate,
  lastUpdated,
  isLoading,
  error,
  onRefreshRate,
}: SummaryBannerProps) {
  // Convert all amounts to USD for total calculation
  const totals = goals.reduce(
    (acc, goal) => {
      const targetUSD = goal.currency === 'USD' ? goal.targetAmount : (rate ? goal.targetAmount / rate : 0);
      const savedUSD = goal.currency === 'USD' ? goal.savedAmount : (rate ? goal.savedAmount / rate : 0);
      return {
        target: acc.target + targetUSD,
        saved: acc.saved + savedUSD,
      };
    },
    { target: 0, saved: 0 }
  );

  const overallProgress = goals.length > 0
    ? goals.reduce((sum, goal) => sum + Math.min((goal.savedAmount / goal.targetAmount) * 100, 100), 0) / goals.length
    : 0;

  return (
    <div className="bg-gradient-banner rounded-2xl p-6 md:p-8 text-banner-foreground shadow-banner">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Target */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm opacity-80">Total Target</p>
            <p className="text-2xl font-bold">{formatCurrency(totals.target, 'USD')}</p>
          </div>
        </div>

        {/* Total Saved */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm opacity-80">Total Saved</p>
            <p className="text-2xl font-bold">{formatCurrency(totals.saved, 'USD')}</p>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm opacity-80">Overall Progress</p>
            <p className="text-2xl font-bold">{overallProgress.toFixed(1)}%</p>
          </div>
        </div>

        {/* Exchange Rate */}
        <div className="flex items-center gap-4">
          <button
            onClick={onRefreshRate}
            disabled={isLoading}
            className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors disabled:opacity-50"
            title="Refresh exchange rate"
          >
            <RefreshCw className={`w-6 h-6 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <div>
            <p className="text-sm opacity-80">1 USD = INR</p>
            {error ? (
              <p className="text-sm text-red-200">{error}</p>
            ) : rate ? (
              <>
                <p className="text-2xl font-bold">₹{rate.toFixed(2)}</p>
                {lastUpdated && (
                  <p className="text-xs opacity-60">Updated: {formatDate(lastUpdated)}</p>
                )}
              </>
            ) : (
              <p className="text-lg">Loading...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
