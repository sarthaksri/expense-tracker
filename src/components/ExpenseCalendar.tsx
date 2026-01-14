import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parseISO, isSameDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Expense } from '@/types/expense';
import { formatCurrency } from '@/lib/formatCurrency';
import { cn } from '@/lib/utils';

interface ExpenseCalendarProps {
  expenses: Expense[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onAddExpense: (date: string) => void;
}

const categoryColors = {
  food: 'bg-category-food',
  transport: 'bg-category-transport',
  misc: 'bg-category-misc',
  rent: 'bg-category-rent',
  custom: 'bg-category-custom',
};

export function ExpenseCalendar({ 
  expenses, 
  selectedDate, 
  onDateChange,
  onAddExpense 
}: ExpenseCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get the day of week for the first day (0 = Sunday)
  const startDayOfWeek = monthStart.getDay();
  const emptyDays = Array(startDayOfWeek).fill(null);

  const expensesByDate = useMemo(() => {
    const map = new Map<string, { total: number; expenses: Expense[] }>();
    expenses.forEach(expense => {
      const dateKey = expense.date;
      const existing = map.get(dateKey) || { total: 0, expenses: [] };
      existing.total += expense.amount;
      existing.expenses.push(expense);
      map.set(dateKey, existing);
    });
    return map;
  }, [expenses]);

  const maxDailyExpense = useMemo(() => {
    let max = 0;
    expensesByDate.forEach(({ total }) => {
      if (total > max) max = total;
    });
    return max || 1;
  }, [expensesByDate]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-xl bg-card border border-border"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <motion.h3 
          key={format(currentMonth, 'MMMM yyyy')}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-bold"
        >
          {format(currentMonth, 'MMMM yyyy')}
        </motion.h3>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth('prev')}
            className="h-8 w-8"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth('next')}
            className="h-8 w-8"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Week days header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div 
            key={day} 
            className="text-center text-xs font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {emptyDays.map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        
        {daysInMonth.map((day, i) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayExpenses = expensesByDate.get(dateKey);
          const isSelected = isSameDay(day, selectedDate);
          const intensity = dayExpenses ? (dayExpenses.total / maxDailyExpense) : 0;

          return (
            <motion.button
              key={dateKey}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.01 }}
              onClick={() => onDateChange(day)}
              onMouseEnter={() => setHoveredDate(dateKey)}
              onMouseLeave={() => setHoveredDate(null)}
              className={cn(
                'relative aspect-square p-1 rounded-lg transition-all duration-200',
                'hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50',
                isToday(day) && 'ring-2 ring-primary',
                isSelected && 'bg-primary/20'
              )}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <span className={cn(
                  'text-sm',
                  isToday(day) && 'font-bold text-primary',
                  !isSameMonth(day, currentMonth) && 'text-muted-foreground/50'
                )}>
                  {format(day, 'd')}
                </span>
                
                {dayExpenses && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={cn(
                      'absolute bottom-1 left-1/2 -translate-x-1/2',
                      'w-2 h-2 rounded-full bg-expense',
                      intensity > 0.7 && 'w-3 h-3',
                      intensity > 0.9 && 'w-4 h-4'
                    )}
                    style={{ opacity: 0.5 + intensity * 0.5 }}
                  />
                )}
              </div>

              {/* Tooltip */}
              <AnimatePresence>
                {hoveredDate === dateKey && dayExpenses && (
                  <motion.div
                    initial={{ opacity: 0, y: 5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 rounded-lg bg-popover border border-border shadow-xl min-w-[120px]"
                  >
                    <p className="text-xs font-medium text-foreground">
                      {formatCurrency(dayExpenses.total)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {dayExpenses.expenses.length} expense{dayExpenses.expenses.length > 1 ? 's' : ''}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {/* Add expense button */}
      <motion.div 
        className="mt-4 pt-4 border-t border-border"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Button 
          variant="outline" 
          className="w-full gap-2"
          onClick={() => onAddExpense(format(selectedDate, 'yyyy-MM-dd'))}
        >
          <Plus className="w-4 h-4" />
          Add expense for {format(selectedDate, 'MMM d')}
        </Button>
      </motion.div>
    </motion.div>
  );
}
