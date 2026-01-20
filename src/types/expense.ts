export type ExpenseCategory = 'food' | 'transport' | 'misc' | 'rent' | 'custom';

export type SavingsGoalType = 'tour' | 'gadget' | 'investment' | 'emergency' | 'custom';

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  customCategory?: string;
  description?: string;
  date: string; // ISO date string
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  color: string;
  icon: string;
  goalType: 'monthly' | 'overall';
  period?: string; // YYYY-MM format for monthly goals
}

export interface MonthlyIncome {
  salary: number;
  otherIncome: number;
}

export interface MonthlyRent {
  amount: number;
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
