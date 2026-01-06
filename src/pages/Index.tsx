import { useState } from 'react';
import { useGoals } from '@/hooks/useGoals';
import { useExchangeRate } from '@/hooks/useExchangeRate';
import { SummaryBanner } from '@/components/SummaryBanner';
import { AddGoalForm } from '@/components/AddGoalForm';
import { GoalCard } from '@/components/GoalCard';
import { ContributionModal } from '@/components/ContributionModal';
import { EmptyState } from '@/components/EmptyState';
import { Goal } from '@/types/goal';
import { PiggyBank } from 'lucide-react';

const Index = () => {
  const { goals, addGoal, addContribution, deleteGoal, isLoaded } = useGoals();
  const { rate, lastUpdated, isLoading, error, refresh } = useExchangeRate();
  
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      setSelectedGoal(goal);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGoal(null);
  };

  const handleAddContribution = (amount: number, date: string) => {
    if (selectedGoal) {
      addContribution(selectedGoal.id, amount, date);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-banner flex items-center justify-center shadow-button">
              <PiggyBank className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Savings Planner</h1>
              <p className="text-sm text-muted-foreground">Track your financial goals</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Summary Banner */}
        <SummaryBanner
          goals={goals}
          rate={rate}
          lastUpdated={lastUpdated}
          isLoading={isLoading}
          error={error}
          onRefreshRate={refresh}
        />

        {/* Add Goal Form */}
        <AddGoalForm onAddGoal={addGoal} />

        {/* Goals Grid */}
        {goals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                rate={rate}
                onAddContribution={handleOpenModal}
                onDelete={deleteGoal}
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </main>

      {/* Contribution Modal */}
      <ContributionModal
        isOpen={isModalOpen}
        goalName={selectedGoal?.name || ''}
        currency={selectedGoal?.currency || 'USD'}
        onClose={handleCloseModal}
        onSubmit={handleAddContribution}
      />
    </div>
  );
};

export default Index;
