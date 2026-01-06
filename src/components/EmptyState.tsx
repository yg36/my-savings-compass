import { Target } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-gradient-banner flex items-center justify-center mb-6 shadow-banner">
        <Target className="w-10 h-10 text-white" />
      </div>
      <h3 className="text-2xl font-semibold text-foreground mb-2">No goals yet</h3>
      <p className="text-muted-foreground max-w-md">
        Start your savings journey by creating your first goal above. Track your progress and watch your savings grow!
      </p>
    </div>
  );
}
