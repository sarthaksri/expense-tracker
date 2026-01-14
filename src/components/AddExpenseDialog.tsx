import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, UtensilsCrossed, Car, Sparkles, Home, Tag } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ExpenseCategory } from '@/types/expense';
import { cn } from '@/lib/utils';

interface AddExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: string;
  customCategories: string[];
  onAddExpense: (expense: {
    amount: number;
    category: ExpenseCategory;
    customCategory?: string;
    description: string;
    date: string;
  }) => void;
  onAddCategory: (category: string) => void;
}

const defaultCategories = [
  { id: 'food' as const, label: 'Food', icon: UtensilsCrossed, color: 'bg-category-food' },
  { id: 'transport' as const, label: 'Transport', icon: Car, color: 'bg-category-transport' },
  { id: 'misc' as const, label: 'Misc', icon: Sparkles, color: 'bg-category-misc' },
  { id: 'rent' as const, label: 'Rent', icon: Home, color: 'bg-category-rent' },
];

export function AddExpenseDialog({ 
  open, 
  onOpenChange, 
  date, 
  customCategories,
  onAddExpense,
  onAddCategory 
}: AddExpenseDialogProps) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory | null>(null);
  const [customCategory, setCustomCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;

    onAddExpense({
      amount: parseFloat(amount),
      category,
      customCategory: category === 'custom' ? customCategory : undefined,
      description,
      date,
    });

    // Reset form
    setAmount('');
    setCategory(null);
    setCustomCategory('');
    setDescription('');
    onOpenChange(false);
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim());
      setCustomCategory(newCategory.trim());
      setCategory('custom');
      setNewCategory('');
      setIsAddingCategory(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Add Expense
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
              <Input
                id="amount"
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 text-xl font-mono"
                required
              />
            </div>
          </div>

          {/* Category selection */}
          <div className="space-y-2">
            <Label>Category</Label>
            <div className="grid grid-cols-2 gap-2">
              {defaultCategories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <motion.button
                    key={cat.id}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setCategory(cat.id);
                      setCustomCategory('');
                    }}
                    className={cn(
                      'flex items-center gap-2 p-3 rounded-lg border transition-all',
                      category === cat.id 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className={cn('p-1.5 rounded-md', cat.color, 'bg-opacity-20')}>
                      <Icon className="w-4 h-4" style={{ color: cat.color.replace('bg-', '') }} />
                    </div>
                    <span className="text-sm font-medium">{cat.label}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Custom categories */}
            {customCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {customCategories.map((cat) => (
                  <motion.button
                    key={cat}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setCategory('custom');
                      setCustomCategory(cat);
                    }}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all',
                      category === 'custom' && customCategory === cat
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <Tag className="w-3 h-3" />
                    {cat}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Add new category */}
            <AnimatePresence>
              {isAddingCategory ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex gap-2 mt-2"
                >
                  <Input
                    placeholder="Category name"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="button" size="sm" onClick={handleAddCategory}>
                    Add
                  </Button>
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="ghost"
                    onClick={() => setIsAddingCategory(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </motion.div>
              ) : (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  type="button"
                  onClick={() => setIsAddingCategory(true)}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mt-2"
                >
                  <Plus className="w-4 h-4" />
                  Add custom category
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="What was this expense for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={!amount || !category}
            >
              Add Expense
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
