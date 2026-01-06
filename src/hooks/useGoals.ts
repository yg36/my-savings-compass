import { useState, useEffect, useCallback } from 'react';
import { Goal, Contribution, Currency } from '@/types/goal';

const STORAGE_KEY = 'savings-planner-goals';

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setGoals(JSON.parse(stored));
      } catch {
        setGoals([]);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    }
  }, [goals, isLoaded]);

  const addGoal = useCallback((name: string, targetAmount: number, currency: Currency) => {
    const newGoal: Goal = {
      id: crypto.randomUUID(),
      name,
      targetAmount,
      currency,
      savedAmount: 0,
      contributions: [],
      createdAt: new Date().toISOString(),
    };
    setGoals(prev => [...prev, newGoal]);
  }, []);

  const addContribution = useCallback((goalId: string, amount: number, date: string) => {
    const contribution: Contribution = {
      id: crypto.randomUUID(),
      amount,
      date,
    };
    setGoals(prev =>
      prev.map(goal =>
        goal.id === goalId
          ? {
              ...goal,
              savedAmount: goal.savedAmount + amount,
              contributions: [...goal.contributions, contribution],
            }
          : goal
      )
    );
  }, []);

  const deleteGoal = useCallback((goalId: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
  }, []);

  return { goals, addGoal, addContribution, deleteGoal, isLoaded };
}
