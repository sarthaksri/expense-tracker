import { useState } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Check, X, Wallet, Home } from 'lucide-react';
import { MonthlyIncome, MonthlyRent } from '@/types/expense';
import { formatCurrency } from '@/lib/formatCurrency';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface IncomeRentEditorProps {
  income: MonthlyIncome;
  rent: MonthlyRent;
  onUpdateIncome: (updates: Partial<MonthlyIncome>) => void;
  onUpdateRent: (updates: Partial<MonthlyRent>) => void;
}

export function IncomeRentEditor({ 
  income, 
  rent, 
  onUpdateIncome, 
  onUpdateRent 
}: IncomeRentEditorProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleEdit = (field: string, currentValue: number) => {
    setEditingField(field);
    setEditValue(currentValue.toString());
  };

  const handleSave = () => {
    const value = parseFloat(editValue);
    if (isNaN(value)) return;

    switch (editingField) {
      case 'salary':
        onUpdateIncome({ salary: value });
        break;
      case 'otherIncome':
        onUpdateIncome({ otherIncome: value });
        break;
      case 'rent':
        onUpdateRent({ amount: value });
        break;
    }
    setEditingField(null);
    setEditValue('');
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValue('');
  };

  const EditableField = ({ 
    label, 
    field, 
    value, 
    icon: Icon,
    variant = 'default'
  }: { 
    label: string; 
    field: string; 
    value: number;
    icon: typeof Wallet;
    variant?: 'default' | 'income' | 'expense';
  }) => {
    const isEditing = editingField === field;

    const variantStyles = {
      default: 'border-border bg-card',
      income: 'border-primary/40 bg-primary/10',
      expense: 'border-expense/40 bg-expense/10',
    };

    return (
      <motion.div
        whileHover={{ scale: isEditing ? 1 : 1.02 }}
        className={cn(
          'p-5 rounded-xl border transition-all shadow-sm',
          variantStyles[variant],
          isEditing && 'ring-2 ring-primary'
        )}
      >
        <div className="flex items-center gap-2 mb-3">
          <Icon className={cn(
            'w-5 h-5',
            variant === 'income' && 'text-primary',
            variant === 'expense' && 'text-expense'
          )} />
          <span className="text-sm font-semibold text-foreground/80">{label}</span>
        </div>

        {isEditing ? (
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
              <Input
                type="number"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="pl-8 font-mono"
                autoFocus
              />
            </div>
            <Button size="icon" variant="ghost" onClick={handleSave}>
              <Check className="w-4 h-4 text-primary" />
            </Button>
            <Button size="icon" variant="ghost" onClick={handleCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div 
            className="flex items-center justify-between cursor-pointer group"
            onClick={() => handleEdit(field, value)}
          >
            <span className="text-2xl font-bold font-mono text-foreground">
              {formatCurrency(value)}
            </span>
            <Pencil className="w-4 h-4 text-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h3 className="text-lg font-bold text-foreground mb-4">Monthly Overview</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <EditableField
          label="Monthly Salary"
          field="salary"
          value={income.salary}
          icon={Wallet}
          variant="income"
        />
        <EditableField
          label="Other Income"
          field="otherIncome"
          value={income.otherIncome}
          icon={Wallet}
          variant="income"
        />
        <EditableField
          label="Monthly Rent"
          field="rent"
          value={rent.amount}
          icon={Home}
          variant="expense"
        />
      </div>
    </motion.div>
  );
}
