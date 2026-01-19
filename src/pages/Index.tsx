import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Wallet, TrendingDown, PiggyBank, IndianRupee, Plus, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useExpenseStore } from '@/hooks/useExpenseStore';
import { Navigation } from '@/components/Navigation';
import { StatCard } from '@/components/StatCard';
import { ExpenseCalendar } from '@/components/ExpenseCalendar';
import { DailyExpenseList } from '@/components/DailyExpenseList';
import { SavingsGoalCard } from '@/components/SavingsGoalCard';
import { CategoryBreakdownChart } from '@/components/CategoryBreakdownChart';
import { MonthlyTrendChart } from '@/components/MonthlyTrendChart';
import { IncomeRentEditor } from '@/components/IncomeRentEditor';
import { AddExpenseDialog } from '@/components/AddExpenseDialog';
import { AddSavingsGoalDialog } from '@/components/AddSavingsGoalDialog';
import { Button } from '@/components/ui/button';

type Tab = 'dashboard' | 'calendar' | 'savings' | 'analytics';

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const [addExpenseDate, setAddExpenseDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [addGoalOpen, setAddGoalOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const {
    expenses,
    savingsGoals,
    income,
    rent,
    customCategories,
    isLoaded,
    addExpense,
    deleteExpense,
    getExpensesForDate,
    getExpensesForMonth,
    getTotalExpensesForMonth,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    addCustomCategory,
    updateIncome,
    updateRent,
  } = useExpenseStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isLoaded) {
    return (
      <div className="dark min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your expenses...</p>
        </motion.div>
      </div>
    );
  }

  const currentMonth = format(new Date(), 'yyyy-MM');
  const totalExpenses = getTotalExpensesForMonth(currentMonth);
  const totalIncome = income.salary + income.otherIncome;
  const totalSavings = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const balance = totalIncome - totalExpenses - rent.amount;

  const handleAddExpense = (date: string) => {
    setAddExpenseDate(date);
    setAddExpenseOpen(true);
  };

  const dailyExpenses = getExpensesForDate(format(selectedDate, 'yyyy-MM-dd'));
  const monthExpenses = getExpensesForMonth(currentMonth);

  return (
    <div className="dark min-h-screen bg-background text-foreground pb-20 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/20 border border-primary/30">
                <IndianRupee className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Expense Tracker</h1>
                <p className="text-sm text-muted-foreground font-medium">{format(new Date(), 'MMMM yyyy')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-foreground">Welcome, {user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </motion.div>
        </div>
      </header>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="container mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Income" value={totalIncome} icon={Wallet} variant="income" delay={0} />
                <StatCard title="Expenses" value={totalExpenses} icon={TrendingDown} variant="expense" delay={0.1} />
                <StatCard title="Savings" value={totalSavings} icon={PiggyBank} variant="savings" delay={0.2} />
                <StatCard title="Balance" value={balance} icon={IndianRupee} variant={balance >= 0 ? 'income' : 'expense'} delay={0.3} />
              </div>

              {/* Income & Rent Editor */}
              <IncomeRentEditor
                income={income}
                rent={rent}
                onUpdateIncome={updateIncome}
                onUpdateRent={updateRent}
              />

              {/* Quick Charts */}
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-6 rounded-xl bg-card border border-border">
                  <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
                  <CategoryBreakdownChart expenses={monthExpenses} />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="p-6 rounded-xl bg-card border border-border">
                  <h3 className="text-lg font-semibold mb-4">Monthly Trend</h3>
                  <MonthlyTrendChart expenses={expenses} />
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === 'calendar' && (
            <motion.div key="calendar" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="grid lg:grid-cols-2 gap-6">
              <ExpenseCalendar expenses={expenses} selectedDate={selectedDate} onDateChange={setSelectedDate} onAddExpense={handleAddExpense} />
              <DailyExpenseList date={selectedDate} expenses={dailyExpenses} onDeleteExpense={deleteExpense} />
            </motion.div>
          )}

          {activeTab === 'savings' && (
            <motion.div key="savings" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Savings Goals</h2>
                <Button onClick={() => setAddGoalOpen(true)} className="gap-2">
                  <Plus className="w-4 h-4" /> Add Goal
                </Button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {savingsGoals.map((goal, i) => (
                  <SavingsGoalCard key={goal.id} goal={goal} onUpdate={updateSavingsGoal} onDelete={deleteSavingsGoal} delay={i * 0.1} />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div key="analytics" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
              <h2 className="text-2xl font-bold">Analytics</h2>
              <div className="grid lg:grid-cols-2 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-xl bg-card border border-border">
                  <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
                  <CategoryBreakdownChart expenses={expenses} />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 rounded-xl bg-card border border-border">
                  <h3 className="text-lg font-semibold mb-4">6-Month Trend</h3>
                  <MonthlyTrendChart expenses={expenses} monthsToShow={6} />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Dialogs */}
      <AddExpenseDialog open={addExpenseOpen} onOpenChange={setAddExpenseOpen} date={addExpenseDate} customCategories={customCategories} onAddExpense={addExpense} onAddCategory={addCustomCategory} />
      <AddSavingsGoalDialog open={addGoalOpen} onOpenChange={setAddGoalOpen} onAddGoal={addSavingsGoal} />
    </div>
  );
};

export default Index;
