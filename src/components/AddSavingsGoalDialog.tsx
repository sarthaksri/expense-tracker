import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Plane, Laptop, TrendingUp, Shield, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SavingsGoalType } from '@/types/expense';
import { cn } from '@/lib/utils';

interface AddSavingsGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddGoal: (goal: {
    name: string;
    targetAmount: number;
    currentAmount: number;
    color: string;
    icon: string;
    goalType: 'monthly' | 'overall';
    period?: string;
  }) => void;
}

const goalTypes = [
  { id: 'tour' as const, label: 'Travel', icon: Plane, color: 'hsl(199 89% 48%)' },
  { id: 'gadget' as const, label: 'Gadget', icon: Laptop, color: 'hsl(280 65% 60%)' },
  { id: 'investment' as const, label: 'Investment', icon: TrendingUp, color: 'hsl(160 84% 39%)' },
  { id: 'emergency' as const, label: 'Emergency', icon: Shield, color: 'hsl(38 92% 50%)' },
  { id: 'custom' as const, label: 'Custom', icon: Sparkles, color: 'hsl(330 80% 55%)' },
];

const iconMap: Record<string, string> = {
  tour: 'plane',
  gadget: 'laptop',
  investment: 'trending-up',
  emergency: 'shield',
  custom: 'sparkles',
};

export function AddSavingsGoalDialog({ 
  open, 
  onOpenChange, 
  onAddGoal 
}: AddSavingsGoalDialogProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<SavingsGoalType | null>(null);
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [goalType, setGoalType] = useState<'monthly' | 'overall'>('overall');
  const [period, setPeriod] = useState(format(new Date(), 'yyyy-MM'));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !type || !targetAmount) return;

    const selectedType = goalTypes.find(t => t.id === type);
    
    onAddGoal({
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount) || 0,
      color: selectedType?.color || 'hsl(160 84% 39%)',
      icon: iconMap[type],
      goalType,
      period: goalType === 'monthly' ? period : undefined,
    });

    // Reset form
    setName('');
    setType(null);
    setTargetAmount('');
    setCurrentAmount('');
    setGoalType('overall');
    setPeriod(format(new Date(), 'yyyy-MM'));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            New Savings Goal
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Goal name */}
          <div className="space-y-2">
            <Label htmlFor="name">Goal Name</Label>
            <Input
              id="name"
              placeholder="e.g., Europe Trip"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Goal Category - Monthly vs Overall */}
          <div className="space-y-2">
            <Label>Goal Category</Label>
            <div className="grid grid-cols-2 gap-2">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setGoalType('monthly')}
                className={cn(
                  'flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all',
                  goalType === 'monthly'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <span className="text-sm font-medium">📅 Monthly Savings</span>
                <span className="text-xs text-muted-foreground">Track monthly targets</span>
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setGoalType('overall')}
                className={cn(
                  'flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all',
                  goalType === 'overall'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <span className="text-sm font-medium">🎯 Overall Goal</span>
                <span className="text-xs text-muted-foreground">Long-term targets</span>
              </motion.button>
            </div>
          </div>

          {/* Month selector for monthly goals */}
          {goalType === 'monthly' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <Label htmlFor="period">Target Month</Label>
              <Input
                id="period"
                type="month"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                required={goalType === 'monthly'}
              />
            </motion.div>
          )}

          {/* Goal type */}
          <div className="space-y-2">
            <Label>Goal Type</Label>
            <div className="grid grid-cols-3 gap-2">
              {goalTypes.map((goalType) => {
                const Icon = goalType.icon;
                return (
                  <motion.button
                    key={goalType.id}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setType(goalType.id)}
                    className={cn(
                      'flex flex-col items-center gap-2 p-3 rounded-lg border transition-all',
                      type === goalType.id 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${goalType.color}20` }}
                    >
                      <Icon 
                        className="w-5 h-5" 
                        style={{ color: goalType.color }}
                      />
                    </div>
                    <span className="text-xs font-medium">{goalType.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Target amount */}
          <div className="space-y-2">
            <Label htmlFor="targetAmount">Target Amount (₹)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
              <Input
                id="targetAmount"
                type="number"
                placeholder="0"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="pl-8 font-mono"
                required
              />
            </div>
          </div>

          {/* Current amount */}
          <div className="space-y-2">
            <Label htmlFor="currentAmount">Already Saved (₹)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
              <Input
                id="currentAmount"
                type="number"
                placeholder="0"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                className="pl-8 font-mono"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={!name || !type || !targetAmount}
            >
              Create Goal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
