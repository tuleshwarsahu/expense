import React, { useState, useMemo } from 'react';
import AppLayout from '../components/layout/AppLayout';
import IncomeExpenseChart from '../components/charts/IncomeExpenseChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import SpendingTrendChart from '../components/charts/SpendingTrendChart';
import { useTransactions } from '../hooks/useTransactions';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../lib/utils';
import { ChevronLeft, ChevronRight, Calendar, Award, Receipt } from 'lucide-react';
import { CardSkeleton } from '../components/common/Skeleton';
import { useNavigate } from 'react-router-dom';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function MonthlyReport() {
  const { profile } = useAuth();
  const userCurrency = profile?.currency || 'INR';
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  const startDateStr = new Date(year, month, 1).toISOString().split('T')[0];
  const endDateStr = new Date(year, month + 1, 0).toISOString().split('T')[0];

  const { transactions, loading } = useTransactions({
    datePreset: 'custom',
    startDate: startDateStr,
    endDate: endDateStr
  });

  const handlePrevMonth = () => {
    setSelectedDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(new Date(year, month + 1, 1));
  };

  const reportData = useMemo(() => {
    let totalExpense = 0;
    let totalIncome = 0;

    const categoryMap = {};

    transactions.forEach((tx) => {
      const amt = Number(tx.amount) || 0;
      if (tx.type === 'expense') {
        totalExpense += amt;
        categoryMap[tx.category] = (categoryMap[tx.category] || 0) + amt;
      } else if (tx.type === 'income') {
        totalIncome += amt;
      }
    });

    const netBalance = totalIncome - totalExpense;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const avgDailyExpense = Math.round(totalExpense / daysInMonth);

    let highestCat = { name: 'N/A', value: 0 };
    Object.keys(categoryMap).forEach((cat) => {
      if (categoryMap[cat] > highestCat.value) {
        highestCat = { name: cat, value: categoryMap[cat] };
      }
    });

    const categoryBreakdown = Object.keys(categoryMap).map((catName) => {
      const val = categoryMap[catName];
      const pct = totalExpense > 0 ? Math.round((val / totalExpense) * 100) : 0;
      return { name: catName, value: val, percentage: pct };
    }).sort((a, b) => b.value - a.value);

    const chartComparison = [
      { label: MONTH_NAMES[month], Income: totalIncome, Expense: totalExpense }
    ];

    return {
      totalExpense,
      totalIncome,
      netBalance,
      avgDailyExpense,
      highestCat,
      categoryBreakdown,
      chartComparison,
      txCount: transactions.length
    };
  }, [transactions, month, year]);

  return (
    <AppLayout title="Monthly Report">
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {/* Header & Month Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Monthly Performance
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Detailed income, expense, and category breakdown
              </p>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between sm:justify-start gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs sm:text-sm font-bold px-2 text-slate-900 dark:text-white min-w-[120px] text-center">
                {MONTH_NAMES[month]} {year}
              </span>
              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Metric Summary Cards - 2 Columns on Mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm border-l-4 border-l-rose-500">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                Expenses
              </span>
              <h3 className="text-lg sm:text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1 truncate">
                {formatCurrency(reportData.totalExpense, userCurrency)}
              </h3>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm border-l-4 border-l-emerald-500">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                Income
              </span>
              <h3 className="text-lg sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 truncate">
                {formatCurrency(reportData.totalIncome, userCurrency)}
              </h3>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm border-l-4 border-l-indigo-500">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                Net Savings
              </span>
              <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1 truncate">
                {formatCurrency(reportData.netBalance, userCurrency)}
              </h3>
            </div>
          </div>

          {/* Statistics Grid - 2 Columns on Mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2.5">
              <div className="p-2 sm:p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 shrink-0">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase block truncate">
                  Avg Daily
                </span>
                <p className="text-xs sm:text-base font-bold text-slate-900 dark:text-white truncate">
                  {formatCurrency(reportData.avgDailyExpense, userCurrency)}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2.5">
              <div className="p-2 sm:p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 shrink-0">
                <Award className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase block truncate">
                  Top Category
                </span>
                <p className="text-xs sm:text-base font-bold text-slate-900 dark:text-white truncate">
                  {reportData.highestCat.name}
                </p>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2.5">
              <div className="p-2 sm:p-3 rounded-xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 shrink-0">
                <Receipt className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase block truncate">
                  Records
                </span>
                <p className="text-xs sm:text-base font-bold text-slate-900 dark:text-white truncate">
                  {reportData.txCount} records
                </p>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <IncomeExpenseChart
              data={reportData.chartComparison}
              currency={userCurrency}
            />
            <CategoryPieChart
              categoryBreakdown={reportData.categoryBreakdown}
              currency={userCurrency}
              onSelectCategory={(cat) => navigate(`/transactions?category=${encodeURIComponent(cat)}`)}
            />
          </div>

          {/* Monthly Spending Trend */}
          <SpendingTrendChart
            transactions={transactions}
            currency={userCurrency}
          />
        </div>
      )}
    </AppLayout>
  );
}
