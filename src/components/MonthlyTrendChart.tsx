import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Expense } from '@/types/expense';
import { formatCurrency, formatCurrencyCompact } from '@/lib/formatCurrency';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

interface MonthlyTrendChartProps {
  expenses: Expense[];
  monthsToShow?: number;
}

export function MonthlyTrendChart({ expenses, monthsToShow = 6 }: MonthlyTrendChartProps) {
  // Generate last N months data
  const monthlyData = Array.from({ length: monthsToShow }, (_, i) => {
    const date = subMonths(new Date(), monthsToShow - 1 - i);
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    
    const monthExpenses = expenses.filter(expense => {
      const expenseDate = parseISO(expense.date);
      return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
    });
    
    const total = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    return {
      month: format(date, 'MMM'),
      fullMonth: format(date, 'MMMM yyyy'),
      amount: total,
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg bg-popover border border-border shadow-xl"
        >
          <p className="text-sm text-muted-foreground">{payload[0].payload.fullMonth}</p>
          <p className="text-lg font-bold font-mono text-foreground">
            {formatCurrency(payload[0].value)}
          </p>
        </motion.div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="h-64"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={monthlyData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(160 84% 39%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(160 84% 39%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(216 34% 17%)" 
            vertical={false}
          />
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(215 20% 65%)', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(215 20% 65%)', fontSize: 12 }}
            tickFormatter={(value) => formatCurrencyCompact(value)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="hsl(160 84% 39%)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorAmount)"
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
