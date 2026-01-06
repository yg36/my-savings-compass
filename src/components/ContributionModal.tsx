import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

interface ContributionModalProps {
  isOpen: boolean;
  goalName: string;
  currency: 'INR' | 'USD';
  onClose: () => void;
  onSubmit: (amount: number, date: string) => void;
}

export function ContributionModal({
  isOpen,
  goalName,
  currency,
  onClose,
  onSubmit,
}: ContributionModalProps) {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  const handleClose = useCallback(() => {
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setError('');
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid positive amount');
      return;
    }

    if (!date) {
      setError('Please select a date');
      return;
    }

    onSubmit(numAmount, date);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-card rounded-2xl p-6 w-full max-w-md shadow-modal animate-modal-enter">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <h2 className="text-xl font-semibold text-foreground mb-1">Add Contribution</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Contributing to <span className="font-medium text-primary">{goalName}</span>
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Amount */}
            <div>
              <label htmlFor="contributionAmount" className="block text-sm font-medium text-muted-foreground mb-1">
                Amount ({currency})
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {currency === 'USD' ? '$' : '₹'}
                </span>
                <input
                  type="number"
                  id="contributionAmount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  min="0"
                  step="any"
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label htmlFor="contributionDate" className="block text-sm font-medium text-muted-foreground mb-1">
                Date
              </label>
              <input
                type="date"
                id="contributionDate"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 rounded-xl font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-button"
            >
              Add Contribution
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
