import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, isSameMonth } from 'date-fns';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MonthSelectorProps {
  selectedMonth: Date;
  onMonthChange: (month: Date) => void;
}

export function MonthSelector({ selectedMonth, onMonthChange }: MonthSelectorProps) {
  const isCurrentMonth = isSameMonth(selectedMonth, new Date());

  const handlePrevMonth = () => {
    onMonthChange(startOfMonth(subMonths(selectedMonth, 1)));
  };

  const handleNextMonth = () => {
    onMonthChange(startOfMonth(addMonths(selectedMonth, 1)));
  };

  const handleToday = () => {
    onMonthChange(startOfMonth(new Date()));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between gap-4 p-4 rounded-xl bg-card border border-border"
    >
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrevMonth}
        className="gap-2"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Previous</span>
      </Button>

      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
          <Calendar className="w-5 h-5 text-primary" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground">
            {format(selectedMonth, 'MMMM yyyy')}
          </h2>
          {!isCurrentMonth && (
            <p className="text-xs text-muted-foreground">
              {format(new Date(), 'MMMM yyyy')} is current
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {!isCurrentMonth && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToday}
            className="gap-2"
          >
            <span>Today</span>
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextMonth}
          className="gap-2"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}
