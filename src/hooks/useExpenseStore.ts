import { useState, useEffect, useCallback } from 'react';
import { Expense, SavingsGoal, MonthlyIncome, MonthlyRent } from '@/types/expense';
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

const STORAGE_KEYS = {
  expenses: 'expense_tracker_expenses',
  savings: 'expense_tracker_savings',
  income: 'expense_tracker_income',
  rent: 'expense_tracker_rent',
  categories: 'expense_tracker_custom_categories',
};

const defaultSavingsGoals: SavingsGoal[] = [
  {
    id: 'tour-1',
    name: 'Dream Vacation',
    type: 'tour',
    targetAmount: 50000,
    currentAmount: 12500,
    color: 'hsl(199 89% 48%)',
    icon: 'plane',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'gadget-1',
    name: 'New Laptop',
    type: 'gadget',
    targetAmount: 80000,
    currentAmount: 35000,
    color: 'hsl(280 65% 60%)',
    icon: 'laptop',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'investment-1',
    name: 'Mutual Funds',
    type: 'investment',
    targetAmount: 100000,
    currentAmount: 67000,
    color: 'hsl(160 84% 39%)',
    icon: 'trending-up',
    createdAt: new Date().toISOString(),
  },
];

const defaultIncome: MonthlyIncome = {
  id: 'income-1',
  salary: 75000,
  otherIncome: 5000,
  month: format(new Date(), 'yyyy-MM'),
};

const defaultRent: MonthlyRent = {
  id: 'rent-1',
  amount: 15000,
  month: format(new Date(), 'yyyy-MM'),
  isPaid: true,
};

const sampleExpenses: Expense[] = [
  { id: '1', amount: 250, category: 'food', description: 'Groceries', date: format(new Date(), 'yyyy-MM-dd'), createdAt: new Date().toISOString() },
  { id: '2', amount: 100, category: 'transport', description: 'Metro card recharge', date: format(new Date(), 'yyyy-MM-dd'), createdAt: new Date().toISOString() },
  { id: '3', amount: 500, category: 'food', description: 'Restaurant dinner', date: format(new Date(Date.now() - 86400000), 'yyyy-MM-dd'), createdAt: new Date().toISOString() },
  { id: '4', amount: 1200, category: 'misc', description: 'Netflix subscription', date: format(new Date(Date.now() - 172800000), 'yyyy-MM-dd'), createdAt: new Date().toISOString() },
  { id: '5', amount: 800, category: 'transport', description: 'Uber rides', date: format(new Date(Date.now() - 259200000), 'yyyy-MM-dd'), createdAt: new Date().toISOString() },
];

export function useExpenseStore() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [income, setIncome] = useState<MonthlyIncome>(defaultIncome);
  const [rent, setRent] = useState<MonthlyRent>(defaultRent);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const loadedExpenses = localStorage.getItem(STORAGE_KEYS.expenses);
    const loadedSavings = localStorage.getItem(STORAGE_KEYS.savings);
    const loadedIncome = localStorage.getItem(STORAGE_KEYS.income);
    const loadedRent = localStorage.getItem(STORAGE_KEYS.rent);
    const loadedCategories = localStorage.getItem(STORAGE_KEYS.categories);

    setExpenses(loadedExpenses ? JSON.parse(loadedExpenses) : sampleExpenses);
    setSavingsGoals(loadedSavings ? JSON.parse(loadedSavings) : defaultSavingsGoals);
    setIncome(loadedIncome ? JSON.parse(loadedIncome) : defaultIncome);
    setRent(loadedRent ? JSON.parse(loadedRent) : defaultRent);
    setCustomCategories(loadedCategories ? JSON.parse(loadedCategories) : []);
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEYS.expenses, JSON.stringify(expenses));
      localStorage.setItem(STORAGE_KEYS.savings, JSON.stringify(savingsGoals));
      localStorage.setItem(STORAGE_KEYS.income, JSON.stringify(income));
      localStorage.setItem(STORAGE_KEYS.rent, JSON.stringify(rent));
      localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(customCategories));
    }
  }, [expenses, savingsGoals, income, rent, customCategories, isLoaded]);

  const addExpense = useCallback((expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: `expense-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setExpenses(prev => [...prev, newExpense]);
    return newExpense;
  }, []);

  const updateExpense = useCallback((id: string, updates: Partial<Expense>) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  }, []);

  const getExpensesForMonth = useCallback((month: string) => {
    const monthStart = startOfMonth(parseISO(`${month}-01`));
    const monthEnd = endOfMonth(monthStart);
    
    return expenses.filter(expense => {
      const expenseDate = parseISO(expense.date);
      return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
    });
  }, [expenses]);

  const getExpensesForDate = useCallback((date: string) => {
    return expenses.filter(expense => expense.date === date);
  }, [expenses]);

  const getTotalExpensesForMonth = useCallback((month: string) => {
    return getExpensesForMonth(month).reduce((sum, e) => sum + e.amount, 0);
  }, [getExpensesForMonth]);

  const addSavingsGoal = useCallback((goal: Omit<SavingsGoal, 'id' | 'createdAt'>) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: `goal-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setSavingsGoals(prev => [...prev, newGoal]);
    return newGoal;
  }, []);

  const updateSavingsGoal = useCallback((id: string, updates: Partial<SavingsGoal>) => {
    setSavingsGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  }, []);

  const deleteSavingsGoal = useCallback((id: string) => {
    setSavingsGoals(prev => prev.filter(g => g.id !== id));
  }, []);

  const addCustomCategory = useCallback((category: string) => {
    if (!customCategories.includes(category)) {
      setCustomCategories(prev => [...prev, category]);
    }
  }, [customCategories]);

  const updateIncome = useCallback((updates: Partial<MonthlyIncome>) => {
    setIncome(prev => ({ ...prev, ...updates }));
  }, []);

  const updateRent = useCallback((updates: Partial<MonthlyRent>) => {
    setRent(prev => ({ ...prev, ...updates }));
  }, []);

  const getMonthBalance = useCallback((month: string) => {
    const totalExpenses = getTotalExpensesForMonth(month);
    const totalIncome = income.salary + income.otherIncome;
    const totalSavingsContributions = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);
    return totalIncome - totalExpenses - rent.amount;
  }, [getTotalExpensesForMonth, income, rent, savingsGoals]);

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
    getExpensesForMonth,
    getExpensesForDate,
    getTotalExpensesForMonth,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    addCustomCategory,
    updateIncome,
    updateRent,
    getMonthBalance,
  };
}
