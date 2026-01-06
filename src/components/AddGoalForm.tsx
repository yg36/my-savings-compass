import { useState } from 'react';
import { Currency } from '@/types/goal';
import { Plus } from 'lucide-react';

interface AddGoalFormProps {
  onAddGoal: (name: string, targetAmount: number, currency: Currency) => void;
}

export function AddGoalForm({ onAddGoal }: AddGoalFormProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [errors, setErrors] = useState<{ name?: string; amount?: string }>({});

  const validate = () => {
    const newErrors: { name?: string; amount?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Goal name is required';
    }
    
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount)) {
      newErrors.amount = 'Valid amount is required';
    } else if (numAmount <= 0) {
      newErrors.amount = 'Amount must be positive';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    onAddGoal(name.trim(), parseFloat(amount), currency);
    setName('');
    setAmount('');
    setCurrency('USD');
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
      <h2 className="text-lg font-semibold text-foreground mb-4">Add New Goal</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Goal Name */}
        <div className="md:col-span-2">
          <label htmlFor="goalName" className="block text-sm font-medium text-muted-foreground mb-1">
            Goal Name
          </label>
          <input
            type="text"
            id="goalName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Emergency Fund"
            className={`w-full px-4 py-3 rounded-xl bg-input border ${
              errors.name ? 'border-destructive' : 'border-border'
            } text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
          />
          {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
        </div>

        {/* Target Amount */}
        <div>
          <label htmlFor="targetAmount" className="block text-sm font-medium text-muted-foreground mb-1">
            Target Amount
          </label>
          <input
            type="number"
            id="targetAmount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="10000"
            min="0"
            step="any"
            className={`w-full px-4 py-3 rounded-xl bg-input border ${
              errors.amount ? 'border-destructive' : 'border-border'
            } text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
          />
          {errors.amount && <p className="text-sm text-destructive mt-1">{errors.amount}</p>}
        </div>

        {/* Currency */}
        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-muted-foreground mb-1">
            Currency
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCurrency('USD')}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                currency === 'USD'
                  ? 'bg-primary text-primary-foreground shadow-button'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              USD
            </button>
            <button
              type="button"
              onClick={() => setCurrency('INR')}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                currency === 'INR'
                  ? 'bg-primary text-primary-foreground shadow-button'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              INR
            </button>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-xl font-semibold hover:bg-accent/90 transition-all shadow-button-accent"
      >
        <Plus className="w-5 h-5" />
        Create Goal
      </button>
    </form>
  );
}
