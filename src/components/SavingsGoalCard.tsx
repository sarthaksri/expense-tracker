import { motion } from 'framer-motion';
import { Plane, Laptop, TrendingUp, Shield, Sparkles, MoreVertical, Plus, Minus } from 'lucide-react';
import { SavingsGoal } from '@/types/expense';
import { formatCurrency } from '@/lib/formatCurrency';
import { AnimatedNumber } from './AnimatedNumber';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const iconMap = {
  plane: Plane,
  laptop: Laptop,
  'trending-up': TrendingUp,
  shield: Shield,
  sparkles: Sparkles,
};

interface SavingsGoalCardProps {
  goal: SavingsGoal;
  onUpdate: (id: string, updates: Partial<SavingsGoal>) => void;
  onDelete: (id: string) => void;
  delay?: number;
}

export function SavingsGoalCard({ goal, onUpdate, onDelete, delay = 0 }: SavingsGoalCardProps) {
  const Icon = iconMap[goal.icon as keyof typeof iconMap] || Sparkles;
  const progress = (goal.currentAmount / goal.targetAmount) * 100;

  const handleAddAmount = () => {
    const amount = prompt('Enter amount to add (₹):');
    if (amount && !isNaN(Number(amount))) {
      onUpdate(goal.id, { 
        currentAmount: Math.min(goal.currentAmount + Number(amount), goal.targetAmount) 
      });
    }
  };

  const handleWithdraw = () => {
    const amount = prompt('Enter amount to withdraw (₹):');
    if (amount && !isNaN(Number(amount))) {
      onUpdate(goal.id, { 
        currentAmount: Math.max(goal.currentAmount - Number(amount), 0) 
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }}
      className="relative p-5 rounded-xl bg-card border border-border overflow-hidden group"
    >
      {/* Gradient overlay */}
      <div 
        className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300"
        style={{ background: `linear-gradient(135deg, ${goal.color}, transparent)` }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div 
              className="p-2.5 rounded-lg"
              style={{ backgroundColor: `${goal.color}20` }}
              whileHover={{ rotate: 10, scale: 1.1 }}
            >
              <Icon className="w-5 h-5" style={{ color: goal.color }} />
            </motion.div>
            <div>
              <h4 className="font-semibold text-foreground">{goal.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full font-medium",
                  goal.goalType === 'monthly' 
                    ? "bg-blue-500/20 text-blue-400" 
                    : "bg-purple-500/20 text-purple-400"
                )}>
                  {goal.goalType === 'monthly' ? '📅 Monthly' : '🎯 Overall'}
                </span>
                {goal.period && (
                  <span className="text-xs text-muted-foreground">
                    {new Date(goal.period + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                )}
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleAddAmount}>
                <Plus className="w-4 h-4 mr-2" /> Add funds
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleWithdraw}>
                <Minus className="w-4 h-4 mr-2" /> Withdraw
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive" 
                onClick={() => onDelete(goal.id)}
              >
                Delete goal
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono">
              <AnimatedNumber 
                value={goal.currentAmount} 
                formatFn={formatCurrency}
                duration={0.6}
              />
            </span>
            <span className="text-sm text-muted-foreground">
              of {formatCurrency(goal.targetAmount)}
            </span>
          </div>

          <div className="relative">
            <Progress 
              value={progress} 
              className="h-2"
              style={{ 
                '--progress-color': goal.color 
              } as React.CSSProperties}
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {formatCurrency(goal.targetAmount - goal.currentAmount)} remaining
            </span>
            <span 
              className="font-medium"
              style={{ color: goal.color }}
            >
              {progress.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
