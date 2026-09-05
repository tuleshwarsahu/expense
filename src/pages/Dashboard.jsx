import React from 'react';
import AppLayout from '../components/layout/AppLayout';
import SummaryCard from '../components/dashboard/SummaryCard';
import BudgetProgress from '../components/dashboard/BudgetProgress';
import QuickActions from '../components/dashboard/QuickActions';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import SpendingTrendChart from '../components/charts/SpendingTrendChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import { useDashboard } from '../hooks/useDashboard';
import { useAuth } from '../context/AuthContext';
import { CardSkeleton } from '../components/common/Skeleton';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { profile } = useAuth();
  const { metrics, loading, refreshDashboard } = useDashboard();
  const navigate = useNavigate();

  const userCurrency = profile?.currency || 'INR';

  const handleSelectCategory = (catName) => {
    navigate(`/transactions?category=${encodeURIComponent(catName)}`);
  };

  return (
    <AppLayout title="Financial Dashboard" onTransactionAdded={refreshDashboard}>
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {/* Quick Actions */}
          <QuickActions onOpenAddModal={() => {}} />

          {/* Top Summary Cards - 2 Columns on Mobile */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
            <div className="col-span-2 sm:col-span-1 lg:col-span-1">
              <SummaryCard
                title="Total Balance"
                amount={metrics.totalBalance}
                currency={userCurrency}
                icon={Wallet}
                variant="indigo"
              />
            </div>
            <SummaryCard
              title="Monthly Income"
              amount={metrics.currentMonthIncome}
              currency={userCurrency}
              change={metrics.incomeChange}
              icon={TrendingUp}
              variant="emerald"
            />
            <SummaryCard
              title="Monthly Expense"
              amount={metrics.currentMonthExpense}
              currency={userCurrency}
              change={metrics.expenseChange}
              icon={TrendingDown}
              variant="rose"
            />
          </div>

          {/* Budget Progress & All-Time Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-2">
              <BudgetProgress
                monthlyBudget={metrics.monthlyBudget}
                currentExpense={metrics.currentMonthExpense}
                currency={userCurrency}
              />
            </div>
            {/* 2 Columns on Mobile */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Total Income
                </span>
                <span className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1 truncate">
                  +{metrics.totalIncome.toLocaleString()}
                </span>
                <span className="text-[9px] sm:text-[10px] text-slate-400">All-time</span>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Total Expense
                </span>
                <span className="text-base sm:text-lg font-bold text-rose-600 dark:text-rose-400 mt-1 truncate">
                  -{metrics.totalExpense.toLocaleString()}
                </span>
                <span className="text-[9px] sm:text-[10px] text-slate-400">All-time</span>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-2">
              <SpendingTrendChart
                transactions={metrics.recentTransactions}
                currency={userCurrency}
              />
            </div>
            <div>
              <CategoryPieChart
                categoryBreakdown={metrics.categoryBreakdown}
                currency={userCurrency}
                onSelectCategory={handleSelectCategory}
              />
            </div>
          </div>

          {/* Recent Activity */}
          <RecentTransactions
            transactions={metrics.recentTransactions}
            currency={userCurrency}
            onOpenAddModal={() => {}}
          />
        </div>
      )}
    </AppLayout>
  );
}
