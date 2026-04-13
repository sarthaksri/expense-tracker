import { useEffect, useMemo, useRef, useState } from 'react';
import { format } from 'date-fns';
import { ArrowLeft, Check, Home, IndianRupee, Plus, Tag, UtensilsCrossed, Car, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { expensesAPI, categoriesAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ExpenseCategory } from '@/types/expense';

const defaultCategories = [
  { id: 'food' as const, label: 'Food', icon: UtensilsCrossed },
  { id: 'transport' as const, label: 'Transport', icon: Car },
  { id: 'misc' as const, label: 'Misc', icon: Sparkles },
  { id: 'rent' as const, label: 'Rent', icon: Home },
];

const today = () => format(new Date(), 'yyyy-MM-dd');

export default function QuickAddExpense() {
  const amountRef = useRef<HTMLInputElement>(null);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('food');
  const [customCategory, setCustomCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(today());
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    amountRef.current?.focus();

    categoriesAPI.getAll()
      .then((response) => {
        if (response.data.success) {
          setCustomCategories(response.data.data.map((item: { name: string }) => item.name));
        }
      })
      .catch(() => {
        toast({
          title: 'Categories did not load',
          description: 'You can still save using the default categories.',
          variant: 'destructive',
        });
      });
  }, []);

  const selectedLabel = useMemo(() => {
    if (category === 'custom') return customCategory || 'Custom';
    return defaultCategories.find((item) => item.id === category)?.label || 'Food';
  }, [category, customCategory]);

  const resetForNextExpense = () => {
    setAmount('');
    setDescription('');
    setDate(today());
    amountRef.current?.focus();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      toast({
        title: 'Enter a valid amount',
        description: 'Amount should be greater than zero.',
        variant: 'destructive',
      });
      return;
    }

    if (category === 'custom' && !customCategory) {
      toast({
        title: 'Choose a custom category',
        description: 'Pick one of your saved custom categories.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await expensesAPI.create({
        amount: parsedAmount,
        category,
        customCategory: category === 'custom' ? customCategory : undefined,
        description,
        date,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Expense could not be saved');
      }

      toast({
        title: 'Expense added',
        description: `${selectedLabel} - Rs ${parsedAmount.toFixed(2)}`,
      });
      resetForNextExpense();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Try again in a moment.';

      toast({
        title: 'Expense not saved',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-xl border-b border-border">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3 px-4 py-3">
          <Button asChild variant="ghost" size="icon" aria-label="Back to dashboard">
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="min-w-0 text-center">
            <h1 className="truncate text-lg font-semibold">Quick Add</h1>
            <p className="text-xs text-muted-foreground">Save the payment before you forget it</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/15 text-primary">
            <IndianRupee className="h-5 w-5" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pb-28 pt-5">
        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="space-y-2">
            <Label htmlFor="quick-amount">Amount</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-semibold text-muted-foreground">Rs</span>
              <Input
                ref={amountRef}
                id="quick-amount"
                inputMode="decimal"
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                className="h-16 pl-14 text-3xl font-semibold"
                autoComplete="off"
              />
            </div>
          </section>

          <section className="space-y-3">
            <Label>Category</Label>
            <div className="grid grid-cols-2 gap-3">
              {defaultCategories.map((item) => {
                const Icon = item.icon;
                const isSelected = category === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setCategory(item.id);
                      setCustomCategory('');
                    }}
                    className={cn(
                      'flex min-h-14 items-center gap-3 rounded-md border px-3 text-left transition-colors',
                      isSelected
                        ? 'border-primary bg-primary/15 text-primary'
                        : 'border-border bg-card text-foreground hover:border-primary/60'
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {customCategories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {customCategories.map((item) => {
                  const isSelected = category === 'custom' && customCategory === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setCategory('custom');
                        setCustomCategory(item);
                      }}
                      className={cn(
                        'inline-flex min-h-10 items-center gap-2 rounded-md border px-3 text-sm transition-colors',
                        isSelected
                          ? 'border-primary bg-primary/15 text-primary'
                          : 'border-border bg-card text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <Tag className="h-4 w-4" />
                      {item}
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="quick-date">Date</Label>
              <Input
                id="quick-date"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quick-description">Description</Label>
              <Textarea
                id="quick-description"
                placeholder="Optional note"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={1}
                className="min-h-12 resize-none"
              />
            </div>
          </section>

          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 px-4 py-3 backdrop-blur-xl">
            <div className="mx-auto flex max-w-lg gap-3">
              <Button type="button" variant="outline" className="h-12 flex-1" onClick={resetForNextExpense}>
                Clear
              </Button>
              <Button type="submit" className="h-12 flex-[2]" disabled={isSaving}>
                {isSaving ? (
                  'Saving...'
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Add Expense
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Check className="h-4 w-4 text-primary" />
          Ready for fast entries after payments
        </div>
      </main>
    </div>
  );
}
