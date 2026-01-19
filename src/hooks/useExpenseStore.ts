import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Expense, SavingsGoal, MonthlyIncome, MonthlyRent, ExpenseCategory } from '@/types/expense';
import { format, parseISO, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';

const DEFAULT_SAVINGS_GOALS: Omit<SavingsGoal, 'id'>[] = [
  { name: 'Tour Fund', targetAmount: 50000, currentAmount: 0, color: '#0ea5e9', icon: 'plane' },
  { name: 'Gadget Fund', targetAmount: 30000, currentAmount: 0, color: '#a855f7', icon: 'smartphone' },
  { name: 'Investment', targetAmount: 100000, currentAmount: 0, color: '#10b981', icon: 'trending-up' },
];

const currentMonth = format(new Date(), 'yyyy-MM');

export function useExpenseStore() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [income, setIncome] = useState<MonthlyIncome>({ salary: 0, otherIncome: 0 });
  const [rent, setRent] = useState<MonthlyRent>({ amount: 0, isPaid: false });
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch all data from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch expenses
        const { data: expensesData } = await supabase
          .from('expenses')
          .select('*')
          .order('date', { ascending: false });

        if (expensesData) {
          setExpenses(expensesData.map(e => ({
            id: e.id,
            amount: Number(e.amount),
            category: e.category as ExpenseCategory,
            customCategory: e.custom_category || undefined,
            description: e.description || undefined,
            date: e.date,
          })));
        }

        // Fetch savings goals
        const { data: goalsData } = await supabase.from('savings_goals').select('*');
        
        if (goalsData && goalsData.length > 0) {
          setSavingsGoals(goalsData.map(g => ({
            id: g.id,
            name: g.name,
            targetAmount: Number(g.target_amount),
            currentAmount: Number(g.current_amount),
            color: g.color,
            icon: g.icon,
          })));
        } else {
          // Create default savings goals
          const defaultGoals: SavingsGoal[] = [];
          for (const goal of DEFAULT_SAVINGS_GOALS) {
            const { data } = await supabase
              .from('savings_goals')
              .insert({
                name: goal.name,
                target_amount: goal.targetAmount,
                current_amount: goal.currentAmount,
                color: goal.color,
                icon: goal.icon,
              })
              .select()
              .single();
            if (data) {
              defaultGoals.push({
                id: data.id,
                name: data.name,
                targetAmount: Number(data.target_amount),
                currentAmount: Number(data.current_amount),
                color: data.color,
                icon: data.icon,
              });
            }
          }
          setSavingsGoals(defaultGoals);
        }

        // Fetch monthly income
        const { data: incomeData } = await supabase
          .from('monthly_income')
          .select('*')
          .eq('month', currentMonth)
          .maybeSingle();

        if (incomeData) {
          setIncome({
            salary: Number(incomeData.salary),
            otherIncome: Number(incomeData.other_income),
          });
        } else {
          // Create default income record
          await supabase.from('monthly_income').insert({
            month: currentMonth,
            salary: 0,
            other_income: 0,
          });
        }

        // Fetch monthly rent
        const { data: rentData } = await supabase
          .from('monthly_rent')
          .select('*')
          .eq('month', currentMonth)
          .maybeSingle();

        if (rentData) {
          setRent({
            amount: Number(rentData.amount),
            isPaid: rentData.is_paid,
          });
        } else {
          // Create default rent record
          await supabase.from('monthly_rent').insert({
            month: currentMonth,
            amount: 0,
            is_paid: false,
          });
        }

        // Fetch custom categories
        const { data: categoriesData } = await supabase.from('custom_categories').select('*');
        if (categoriesData) {
          setCustomCategories(categoriesData.map(c => c.name));
        }

        setIsLoaded(true);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoaded(true);
      }
    };

    fetchData();
  }, []);

  const addExpense = useCallback(async (expense: Omit<Expense, 'id'>) => {
    const { data, error } = await supabase
      .from('expenses')
      .insert({
        amount: expense.amount,
        category: expense.category,
        custom_category: expense.customCategory || null,
        description: expense.description || null,
        date: expense.date,
      })
      .select()
      .single();

    if (data && !error) {
      const newExpense: Expense = {
        id: data.id,
        amount: Number(data.amount),
        category: data.category as ExpenseCategory,
        customCategory: data.custom_category || undefined,
        description: data.description || undefined,
        date: data.date,
      };
      setExpenses(prev => [newExpense, ...prev]);
    }
  }, []);

  const updateExpense = useCallback(async (id: string, updates: Partial<Expense>) => {
    const { error } = await supabase
      .from('expenses')
      .update({
        amount: updates.amount,
        category: updates.category,
        custom_category: updates.customCategory || null,
        description: updates.description || null,
        date: updates.date,
      })
      .eq('id', id);

    if (!error) {
      setExpenses(prev => prev.map(e => (e.id === id ? { ...e, ...updates } : e)));
    }
  }, []);

  const deleteExpense = useCallback(async (id: string) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (!error) {
      setExpenses(prev => prev.filter(e => e.id !== id));
    }
  }, []);

  const addSavingsGoal = useCallback(async (goal: Omit<SavingsGoal, 'id'>) => {
    const { data, error } = await supabase
      .from('savings_goals')
      .insert({
        name: goal.name,
        target_amount: goal.targetAmount,
        current_amount: goal.currentAmount,
        color: goal.color,
        icon: goal.icon,
      })
      .select()
      .single();

    if (data && !error) {
      const newGoal: SavingsGoal = {
        id: data.id,
        name: data.name,
        targetAmount: Number(data.target_amount),
        currentAmount: Number(data.current_amount),
        color: data.color,
        icon: data.icon,
      };
      setSavingsGoals(prev => [...prev, newGoal]);
    }
  }, []);

  const updateSavingsGoal = useCallback(async (id: string, updates: Partial<SavingsGoal>) => {
    const { error } = await supabase
      .from('savings_goals')
      .update({
        name: updates.name,
        target_amount: updates.targetAmount,
        current_amount: updates.currentAmount,
        color: updates.color,
        icon: updates.icon,
      })
      .eq('id', id);

    if (!error) {
      setSavingsGoals(prev => prev.map(g => (g.id === id ? { ...g, ...updates } : g)));
    }
  }, []);

  const deleteSavingsGoal = useCallback(async (id: string) => {
    const { error } = await supabase.from('savings_goals').delete().eq('id', id);
    if (!error) {
      setSavingsGoals(prev => prev.filter(g => g.id !== id));
    }
  }, []);

  const addCustomCategory = useCallback(async (name: string) => {
    if (!customCategories.includes(name)) {
      const { error } = await supabase.from('custom_categories').insert({ name });
      if (!error) {
        setCustomCategories(prev => [...prev, name]);
      }
    }
  }, [customCategories]);

  const updateIncome = useCallback(async (updates: Partial<MonthlyIncome>) => {
    const { error } = await supabase
      .from('monthly_income')
      .update({
        salary: updates.salary ?? income.salary,
        other_income: updates.otherIncome ?? income.otherIncome,
      })
      .eq('month', currentMonth);

    if (!error) {
      setIncome(prev => ({ ...prev, ...updates }));
    }
  }, [income]);

  const updateRent = useCallback(async (updates: Partial<MonthlyRent>) => {
    const { error } = await supabase
      .from('monthly_rent')
      .update({
        amount: updates.amount ?? rent.amount,
        is_paid: updates.isPaid ?? rent.isPaid,
      })
      .eq('month', currentMonth);

    if (!error) {
      setRent(prev => ({ ...prev, ...updates }));
    }
  }, [rent]);

  const getExpensesForDate = useCallback((date: string) => {
    return expenses.filter(e => e.date === date);
  }, [expenses]);

  const getExpensesForMonth = useCallback((month: string) => {
    const monthStart = startOfMonth(parseISO(`${month}-01`));
    const monthEnd = endOfMonth(parseISO(`${month}-01`));
    return expenses.filter(e => {
      const expenseDate = parseISO(e.date);
      return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
    });
  }, [expenses]);

  const getTotalExpensesForMonth = useCallback((month: string) => {
    return getExpensesForMonth(month).reduce((sum, e) => sum + e.amount, 0);
  }, [getExpensesForMonth]);

  return {
    expenses,
    savingsGoals,
    income,
    rent,
    customCategories,
    isLoaded,
    addExpense,
    updateExpense,
    deleteExpense,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    addCustomCategory,
    updateIncome,
    updateRent,
    getExpensesForDate,
    getExpensesForMonth,
    getTotalExpensesForMonth,
  };
}
