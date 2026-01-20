import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, isSameMonth, setMonth, setYear } from 'date-fns';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            className="flex items-center gap-3 hover:bg-primary/10 h-auto py-2"
          >
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
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="center">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Month</label>
              <Select
                value={selectedMonth.getMonth().toString()}
                onValueChange={(value) => {
                  const newDate = setMonth(selectedMonth, parseInt(value));
                  onMonthChange(startOfMonth(newDate));
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {format(new Date(2000, i, 1), 'MMMM')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Year</label>
              <Select
                value={selectedMonth.getFullYear().toString()}
                onValueChange={(value) => {
                  const newDate = setYear(selectedMonth, parseInt(value));
                  onMonthChange(startOfMonth(newDate));
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() - 5 + i;
                    return (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverContent>
      </Popover>

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
