export type ExpenseCategory = 'food' | 'transport' | 'misc' | 'rent' | 'custom';

export type SavingsGoalType = 'tour' | 'gadget' | 'investment' | 'emergency' | 'custom';

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  customCategory?: string;
  description: string;
  date: string; // ISO date string
  createdAt: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  type: SavingsGoalType;
  targetAmount: number;
  currentAmount: number;
  color: string;
  icon: string;
  createdAt: string;
}

export interface MonthlyIncome {
  id: string;
  salary: number;
  otherIncome: number;
  month: string; // YYYY-MM format
}

export interface MonthlyRent {
  id: string;
  amount: number;
  month: string; // YYYY-MM format
  isPaid: boolean;
}

export interface DailyExpense {
  date: string;
  total: number;
  expenses: Expense[];
}

export interface MonthSummary {
  month: string;
  totalExpenses: number;
  totalIncome: number;
  rent: number;
  savings: number;
  balance: number;
}

export interface CategorySummary {
  category: ExpenseCategory | string;
  amount: number;
  percentage: number;
  color: string;
}
