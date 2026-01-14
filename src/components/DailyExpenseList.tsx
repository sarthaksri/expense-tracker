import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, UtensilsCrossed, Car, Sparkles, Home, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { Expense, ExpenseCategory } from '@/types/expense';
import { formatCurrency } from '@/lib/formatCurrency';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DailyExpenseListProps {
  date: Date;
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

const categoryIcons: Record<ExpenseCategory, typeof UtensilsCrossed> = {
  food: UtensilsCrossed,
  transport: Car,
  misc: Sparkles,
  rent: Home,
  custom: Tag,
};

const categoryColors: Record<ExpenseCategory, string> = {
  food: 'text-category-food bg-category-food/20',
  transport: 'text-category-transport bg-category-transport/20',
  misc: 'text-category-misc bg-category-misc/20',
  rent: 'text-category-rent bg-category-rent/20',
  custom: 'text-category-custom bg-category-custom/20',
};

export function DailyExpenseList({ date, expenses, onDeleteExpense }: DailyExpenseListProps) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-xl bg-card border border-border"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">{format(date, 'EEEE, MMMM d')}</h3>
          <p className="text-sm text-muted-foreground">
            {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-xl font-bold font-mono text-expense">
            {formatCurrency(total)}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {expenses.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-muted-foreground py-8"
            >
              No expenses for this day
            </motion.p>
          ) : (
            expenses.map((expense, index) => {
              const Icon = categoryIcons[expense.category];
              const colorClass = categoryColors[expense.category];

              return (
                <motion.div
                  key={expense.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="group flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className={cn('p-2 rounded-lg', colorClass)}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {expense.description || expense.customCategory || expense.category}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {expense.customCategory || expense.category}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold">
                      {formatCurrency(expense.amount)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      onClick={() => onDeleteExpense(expense.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
