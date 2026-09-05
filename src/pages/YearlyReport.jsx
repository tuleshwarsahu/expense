import React, { useState, useMemo } from 'react';
import AppLayout from '../components/layout/AppLayout';
import IncomeExpenseChart from '../components/charts/IncomeExpenseChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import { useTransactions } from '../hooks/useTransactions';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CardSkeleton } from '../components/common/Skeleton';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function YearlyReport() {
  const { profile } = useAuth();
  const userCurrency = profile?.currency || 'INR';

  const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear());

  const startDateStr = `${selectedYear}-01-01`;
  const endDateStr = `${selectedYear}-12-31`;

  const { transactions, loading } = useTransactions({
    datePreset: 'custom',
    startDate: startDateStr,
    endDate: endDateStr
  });

  const yearlyData = useMemo(() => {
    const monthlyList = MONTH_NAMES.map((m) => ({
      label: m,
      Income: 0,
      Expense: 0
    }));

    let totalIncome = 0;
    let totalExpense = 0;
    const categoryTotals = {};

    transactions.forEach((tx) => {
      const amt = Number(tx.amount) || 0;
      const d = new Date(tx.transaction_date);
      const monthIdx = d.getMonth();

      if (tx.type === 'expense') {
        totalExpense += amt;
        monthlyList[monthIdx].Expense += amt;
        categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + amt;
      } else if (tx.type === 'income') {
        totalIncome += amt;
        monthlyList[monthIdx].Income += amt;
      }
    });

    const categoryBreakdown = Object.keys(categoryTotals).map((catName) => {
      const val = categoryTotals[catName];
      const pct = totalExpense > 0 ? Math.round((val / totalExpense) * 100) : 0;
      return { name: catName, value: val, percentage: pct };
    }).sort((a, b) => b.value - a.value);

    return {
      monthlyList,
      totalIncome,
      totalExpense,
      netSavings: totalIncome - totalExpense,
      categoryBreakdown
    };
  }, [transactions]);

  return (
    <AppLayout title="Yearly Report">
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Yearly Summary ({selectedYear})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Month-by-month cashflow overview across 12 months
              </p>
            </div>

            {/* Year Selector */}
            <div className="flex items-center justify-between sm:justify-start gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <button
                onClick={() => setSelectedYear((y) => y - 1)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-bold px-3 text-slate-900 dark:text-white">
                {selectedYear}
              </span>
              <button
                onClick={() => setSelectedYear((y) => y + 1)}
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
                Yearly Expenses
              </span>
              <h3 className="text-lg sm:text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1 truncate">
                {formatCurrency(yearlyData.totalExpense, userCurrency)}
              </h3>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm border-l-4 border-l-emerald-500">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                Yearly Income
              </span>
              <h3 className="text-lg sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 truncate">
                {formatCurrency(yearlyData.totalIncome, userCurrency)}
              </h3>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm border-l-4 border-l-indigo-500">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                Yearly Net Savings
              </span>
              <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1 truncate">
                {formatCurrency(yearlyData.netSavings, userCurrency)}
              </h3>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-2">
              <IncomeExpenseChart
                data={yearlyData.monthlyList}
                currency={userCurrency}
              />
            </div>
            <div>
              <CategoryPieChart
                categoryBreakdown={yearlyData.categoryBreakdown}
                currency={userCurrency}
              />
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
