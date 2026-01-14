import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Expense, ExpenseCategory } from '@/types/expense';
import { formatCurrency } from '@/lib/formatCurrency';
import { cn } from '@/lib/utils';

interface CategoryBreakdownChartProps {
  expenses: Expense[];
}

const categoryColors: Record<string, string> = {
  food: '#f97316',
  transport: '#0ea5e9',
  misc: '#a855f7',
  rent: '#ef4444',
  custom: '#10b981',
};

const categoryLabels: Record<string, string> = {
  food: 'Food & Dining',
  transport: 'Transport',
  misc: 'Miscellaneous',
  rent: 'Rent & Bills',
  custom: 'Custom',
};

export function CategoryBreakdownChart({ expenses }: CategoryBreakdownChartProps) {
  const categoryData = expenses.reduce((acc, expense) => {
    const category = expense.customCategory || expense.category;
    const existing = acc.find(item => item.category === category);
    if (existing) {
      existing.amount += expense.amount;
    } else {
      acc.push({
        category,
        amount: expense.amount,
        color: categoryColors[expense.category] || categoryColors.custom,
      });
    }
    return acc;
  }, [] as { category: string; amount: number; color: string }[]);

  const total = categoryData.reduce((sum, item) => sum + item.amount, 0);
  const dataWithPercentage = categoryData.map(item => ({
    ...item,
    percentage: ((item.amount / total) * 100).toFixed(1),
    name: categoryLabels[item.category] || item.category,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 rounded-lg bg-popover border border-border shadow-xl"
        >
          <p className="font-medium text-foreground">{data.name}</p>
          <p className="text-lg font-bold font-mono">{formatCurrency(data.amount)}</p>
          <p className="text-xs text-muted-foreground">{data.percentage}% of total</p>
        </motion.div>
      );
    }
    return null;
  };

  if (expenses.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No expenses to display
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-80"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={dataWithPercentage}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={4}
            dataKey="amount"
            animationBegin={0}
            animationDuration={800}
          >
            {dataWithPercentage.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
                stroke="transparent"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            formatter={(value, entry: any) => (
              <span className="text-sm text-foreground">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
