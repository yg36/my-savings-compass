import { Goal } from '@/types/goal';
import { Plus, Trash2 } from 'lucide-react';

interface GoalCardProps {
  goal: Goal;
  rate: number | null;
  onAddContribution: (goalId: string) => void;
  onDelete: (goalId: string) => void;
}

function formatCurrency(amount: number, currency: 'INR' | 'USD') {
  return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function GoalCard({ goal, rate, onAddContribution, onDelete }: GoalCardProps) {
  const progress = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100);
  const remaining = goal.targetAmount - goal.savedAmount;

  const convertedTarget = rate
    ? goal.currency === 'USD'
      ? goal.targetAmount * rate
      : goal.targetAmount / rate
    : null;

  const otherCurrency = goal.currency === 'USD' ? 'INR' : 'USD';

  return (
    <div className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-foreground">{goal.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(goal.targetAmount, goal.currency)}
            </span>
            {convertedTarget && (
              <span className="text-sm text-muted-foreground">
                ≈ {formatCurrency(convertedTarget, otherCurrency)}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => onDelete(goal.id)}
          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          title="Delete goal"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Section */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">
            Saved: {formatCurrency(goal.savedAmount, goal.currency)}
          </span>
          <span className="text-sm font-medium text-accent-foreground bg-accent/20 px-2 py-0.5 rounded-full">
            {progress.toFixed(1)}%
          </span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-progress rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        {remaining > 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            {formatCurrency(remaining, goal.currency)} remaining
          </p>
        )}
      </div>

      {/* Contributions Count */}
      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <span className="text-sm text-muted-foreground">
          {goal.contributions.length} contribution{goal.contributions.length !== 1 ? 's' : ''}
        </span>
        <button
          onClick={() => onAddContribution(goal.id)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors shadow-button"
        >
          <Plus className="w-4 h-4" />
          Add Contribution
        </button>
      </div>
    </div>
  );
}
