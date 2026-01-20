import { useState, useEffect, useCallback } from 'react';
import { expensesAPI, savingsGoalsAPI, monthlyDataAPI, categoriesAPI } from '@/lib/api';
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

  // Fetch all data from backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch expenses
        const expensesResponse = await expensesAPI.getAll();
        if (expensesResponse.data.success) {
          setExpenses(expensesResponse.data.data.map((e: any) => ({
            id: e._id,
            amount: Number(e.amount),
            category: e.category as ExpenseCategory,
            customCategory: e.customCategory || undefined,
            description: e.description || undefined,
            date: e.date,
          })));
        }

        // Fetch savings goals
        const goalsResponse = await savingsGoalsAPI.getAll();
        if (goalsResponse.data.success) {
          const goalsData = goalsResponse.data.data;

          if (goalsData && goalsData.length > 0) {
            setSavingsGoals(goalsData.map((g: any) => ({
              id: g._id,
              name: g.name,
              targetAmount: Number(g.targetAmount),
              currentAmount: Number(g.currentAmount),
              color: g.color,
              icon: g.icon,
            })));
          } else {
            // Create default savings goals
            const defaultGoals: SavingsGoal[] = [];
            for (const goal of DEFAULT_SAVINGS_GOALS) {
              const response = await savingsGoalsAPI.create(goal);
              if (response.data.success) {
                const data = response.data.data;
                defaultGoals.push({
                  id: data._id,
                  name: data.name,
                  targetAmount: Number(data.targetAmount),
                  currentAmount: Number(data.currentAmount),
                  color: data.color,
                  icon: data.icon,
                });
              }
            }
            setSavingsGoals(defaultGoals);
          }
        }

        // Fetch monthly income
        const incomeResponse = await monthlyDataAPI.getIncome(currentMonth);
        if (incomeResponse.data.success) {
          const incomeData = incomeResponse.data.data;
          setIncome({
            salary: Number(incomeData.salary),
            otherIncome: Number(incomeData.otherIncome),
          });
        }

        // Fetch monthly rent
        const rentResponse = await monthlyDataAPI.getRent(currentMonth);
        if (rentResponse.data.success) {
          const rentData = rentResponse.data.data;
          setRent({
            amount: Number(rentData.amount),
            isPaid: rentData.isPaid,
          });
        }

        // Fetch custom categories
        const categoriesResponse = await categoriesAPI.getAll();
        if (categoriesResponse.data.success) {
          setCustomCategories(categoriesResponse.data.data.map((c: any) => c.name));
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
    try {
      const response = await expensesAPI.create(expense);
      if (response.data.success) {
        const data = response.data.data;
        const newExpense: Expense = {
          id: data._id,
          amount: Number(data.amount),
          category: data.category as ExpenseCategory,
          customCategory: data.customCategory || undefined,
          description: data.description || undefined,
          date: data.date,
        };
        setExpenses(prev => [newExpense, ...prev]);
      }
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  }, []);

  const updateExpense = useCallback(async (id: string, updates: Partial<Expense>) => {
    try {
      const response = await expensesAPI.update(id, updates);
      if (response.data.success) {
        setExpenses(prev => prev.map(e => (e.id === id ? { ...e, ...updates } : e)));
      }
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  }, []);

  const deleteExpense = useCallback(async (id: string) => {
    try {
      const response = await expensesAPI.delete(id);
      if (response.data.success) {
        setExpenses(prev => prev.filter(e => e.id !== id));
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  }, []);

  const addSavingsGoal = useCallback(async (goal: Omit<SavingsGoal, 'id'>) => {
    try {
      const response = await savingsGoalsAPI.create(goal);
      if (response.data.success) {
        const data = response.data.data;
        const newGoal: SavingsGoal = {
          id: data._id,
          name: data.name,
          targetAmount: Number(data.targetAmount),
          currentAmount: Number(data.currentAmount),
          color: data.color,
          icon: data.icon,
        };
        setSavingsGoals(prev => [...prev, newGoal]);
      }
    } catch (error) {
      console.error('Error adding savings goal:', error);
    }
  }, []);

  const updateSavingsGoal = useCallback(async (id: string, updates: Partial<SavingsGoal>) => {
    try {
      const response = await savingsGoalsAPI.update(id, updates);
      if (response.data.success) {
        setSavingsGoals(prev => prev.map(g => (g.id === id ? { ...g, ...updates } : g)));
      }
    } catch (error) {
      console.error('Error updating savings goal:', error);
    }
  }, []);

  const deleteSavingsGoal = useCallback(async (id: string) => {
    try {
      const response = await savingsGoalsAPI.delete(id);
      if (response.data.success) {
        setSavingsGoals(prev => prev.filter(g => g.id !== id));
      }
    } catch (error) {
      console.error('Error deleting savings goal:', error);
    }
  }, []);

  const addCustomCategory = useCallback(async (name: string) => {
    if (!customCategories.includes(name)) {
      try {
        const response = await categoriesAPI.create({ name });
        if (response.data.success) {
          setCustomCategories(prev => [...prev, name]);
        }
      } catch (error) {
        console.error('Error adding custom category:', error);
      }
    }
  }, [customCategories]);

  const updateIncome = useCallback(async (updates: Partial<MonthlyIncome>) => {
    try {
      const response = await monthlyDataAPI.updateIncome(currentMonth, updates);
      if (response.data.success) {
        setIncome(prev => ({ ...prev, ...updates }));
      }
    } catch (error) {
      console.error('Error updating income:', error);
    }
  }, []);

  const updateRent = useCallback(async (updates: Partial<MonthlyRent>) => {
    try {
      const response = await monthlyDataAPI.updateRent(currentMonth, updates);
      if (response.data.success) {
        setRent(prev => ({ ...prev, ...updates }));
      }
    } catch (error) {
      console.error('Error updating rent:', error);
    }
  }, []);

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

  const fetchMonthlyData = useCallback(async (month: string) => {
    try {
      // Fetch monthly income
      const incomeResponse = await monthlyDataAPI.getIncome(month);
      if (incomeResponse.data.success) {
        const incomeData = incomeResponse.data.data;
        setIncome({
          salary: Number(incomeData.salary),
          otherIncome: Number(incomeData.otherIncome),
        });
      }

      // Fetch monthly rent
      const rentResponse = await monthlyDataAPI.getRent(month);
      if (rentResponse.data.success) {
        const rentData = rentResponse.data.data;
        setRent({
          amount: Number(rentData.amount),
          isPaid: rentData.isPaid,
        });
      }
    } catch (error) {
      console.error('Error fetching monthly data:', error);
    }
  }, []);

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
    fetchMonthlyData,
  };
}
