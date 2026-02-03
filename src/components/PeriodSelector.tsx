import { motion } from 'framer-motion';
import { Calendar, TrendingUp, BarChart3, PieChart } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AnalyticsPeriod = 'monthly' | 'quarterly' | '6-month' | 'annual';

interface PeriodSelectorProps {
  selectedPeriod: AnalyticsPeriod;
  onPeriodChange: (period: AnalyticsPeriod) => void;
}

const periods = [
  { id: 'monthly' as const, label: 'Monthly', icon: Calendar, months: 1 },
  { id: 'quarterly' as const, label: 'Quarterly', icon: TrendingUp, months: 3 },
  { id: '6-month' as const, label: '6 Months', icon: BarChart3, months: 6 },
  { id: 'annual' as const, label: 'Annual', icon: PieChart, months: 12 },
];

export function PeriodSelector({ selectedPeriod, onPeriodChange }: PeriodSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {periods.map((period) => {
        const Icon = period.icon;
        const isActive = selectedPeriod === period.id;
        
        return (
          <motion.button
            key={period.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onPeriodChange(period.id)}
            className={cn(
              'flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium transition-all',
              'border-2 text-xs sm:text-sm',
              isActive
                ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20'
                : 'bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
            )}
          >
            <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{period.label}</span>
            <span className="sm:hidden">{period.months}M</span>
          </motion.button>
        );
      })}
    </div>
  );
}
