import React, { useMemo } from 'react';
import AppLayout from '../components/layout/AppLayout';
import WeeklyBarChart from '../components/charts/WeeklyBarChart';
import { useTransactions } from '../hooks/useTransactions';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../lib/utils';
import { Calendar, Award, ArrowDownCircle } from 'lucide-react';
import { CardSkeleton } from '../components/common/Skeleton';

export default function WeeklyReport() {
  const { profile } = useAuth();
  const userCurrency = profile?.currency || 'INR';

  const { transactions, loading } = useTransactions({ datePreset: 'week' });

  const weeklyData = useMemo(() => {
    const days = [
      { day: 'Mon', full: 'Monday', expense: 0, income: 0 },
      { day: 'Tue', full: 'Tuesday', expense: 0, income: 0 },
      { day: 'Wed', full: 'Wednesday', expense: 0, income: 0 },
      { day: 'Thu', full: 'Thursday', expense: 0, income: 0 },
      { day: 'Fri', full: 'Friday', expense: 0, income: 0 },
      { day: 'Sat', full: 'Saturday', expense: 0, income: 0 },
      { day: 'Sun', full: 'Sunday', expense: 0, income: 0 }
    ];

    let totalExpense = 0;
    let totalIncome = 0;

    transactions.forEach((tx) => {
      const amt = Number(tx.amount) || 0;
      const d = new Date(tx.transaction_date);
      const dayIdx = (d.getDay() + 6) % 7;

      if (tx.type === 'expense') {
        totalExpense += amt;
        days[dayIdx].expense += amt;
      } else if (tx.type === 'income') {
        totalIncome += amt;
        days[dayIdx].income += amt;
      }
    });

    const weeklyBalance = totalIncome - totalExpense;
    const avgDailyExpense = Math.round(totalExpense / 7);

    let highest = days[0];
    let lowest = days[0];

    days.forEach((d) => {
      if (d.expense > highest.expense) highest = d;
      if (d.expense < lowest.expense) lowest = d;
    });

    return {
      days,
      totalExpense,
      totalIncome,
      weeklyBalance,
      avgDailyExpense,
      highestDay: highest.expense > 0 ? highest : null,
      lowestDay: lowest
    };
  }, [transactions]);

  return (
    <AppLayout title="Weekly Report">
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              This Week's Analytics
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Monday through Sunday cashflow summary
            </p>
          </div>

          {/* Metric Cards - 2 Columns on Mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm border-l-4 border-l-rose-500">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                Weekly Spending
              </span>
              <h3 className="text-lg sm:text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1 truncate">
                {formatCurrency(weeklyData.totalExpense, userCurrency)}
              </h3>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm border-l-4 border-l-emerald-500">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                Weekly Income
              </span>
              <h3 className="text-lg sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 truncate">
                {formatCurrency(weeklyData.totalIncome, userCurrency)}
              </h3>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm border-l-4 border-l-indigo-500">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                Weekly Net Balance
              </span>
              <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1 truncate">
                {formatCurrency(weeklyData.weeklyBalance, userCurrency)}
              </h3>
            </div>
          </div>

          {/* Highlights Row - 2 Columns on Mobile */}
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
                  {formatCurrency(weeklyData.avgDailyExpense, userCurrency)}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2.5">
              <div className="p-2 sm:p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 shrink-0">
                <Award className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase block truncate">
                  Highest Day
                </span>
                <p className="text-xs sm:text-base font-bold text-slate-900 dark:text-white truncate">
                  {weeklyData.highestDay ? weeklyData.highestDay.day : 'N/A'}
                </p>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2.5">
              <div className="p-2 sm:p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 shrink-0">
                <ArrowDownCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase block truncate">
                  Lowest Day
                </span>
                <p className="text-xs sm:text-base font-bold text-slate-900 dark:text-white truncate">
                  {weeklyData.lowestDay.day}
                </p>
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <WeeklyBarChart dailyData={weeklyData.days} currency={userCurrency} />
        </div>
      )}
    </AppLayout>
  );
}
