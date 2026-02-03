import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { AnimatedNumber } from './AnimatedNumber';
import { formatCurrency } from '@/lib/formatCurrency';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: number;
  variant?: 'default' | 'income' | 'expense' | 'savings';
  delay?: number;
}

const variantStyles = {
  default: 'from-card to-card border-border',
  income: 'from-primary/15 to-primary/5 border-primary/40',
  expense: 'from-expense/15 to-expense/5 border-expense/40',
  savings: 'from-savings/15 to-savings/5 border-savings/40',
};

const iconStyles = {
  default: 'bg-muted text-foreground',
  income: 'bg-primary/25 text-primary',
  expense: 'bg-expense/25 text-expense',
  savings: 'bg-savings/25 text-savings',
};

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  variant = 'default',
  delay = 0 
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={cn(
        'relative p-4 sm:p-6 rounded-xl border bg-gradient-to-br overflow-hidden',
        'backdrop-blur-xl shadow-lg',
        variantStyles[variant]
      )}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500">
        <div className={cn(
          'absolute inset-0 blur-2xl',
          variant === 'income' && 'bg-primary/10',
          variant === 'expense' && 'bg-expense/10',
          variant === 'savings' && 'bg-savings/10'
        )} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <span className="text-xs sm:text-sm font-semibold text-foreground/80">{title}</span>
          <div className={cn('p-2 sm:p-2.5 rounded-lg', iconStyles[variant])}>
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-xl sm:text-2xl font-bold font-mono text-foreground">
            <AnimatedNumber 
              value={value} 
              formatFn={formatCurrency}
              duration={0.8}
            />
          </h3>
          
          {trend !== undefined && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.3 }}
              className={cn(
                'text-xs font-medium',
                trend >= 0 ? 'text-primary' : 'text-expense'
              )}
            >
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
