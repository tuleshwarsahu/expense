import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { calculatePercentageChange } from '../lib/utils';

export function useDashboard() {
  const { user, profile } = useAuth();
  const [metrics, setMetrics] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
    currentMonthIncome: 0,
    currentMonthExpense: 0,
    previousMonthIncome: 0,
    previousMonthExpense: 0,
    incomeChange: { percent: 0, isIncrease: true, isZero: true },
    expenseChange: { percent: 0, isIncrease: true, isZero: true },
    categoryBreakdown: [],
    recentTransactions: [],
    monthlyBudget: 0,
    budgetUsedPercent: 0,
    budgetRemaining: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const calculateDashboardData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch all transactions for user
      const { data: transactions, error: dbError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('transaction_date', { ascending: false })
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;

      const txs = transactions || [];

      // Calculate totals
      let totalIncome = 0;
      let totalExpense = 0;

      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth(); // 0-indexed

      const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);
      const prevYear = prevMonthDate.getFullYear();
      const prevMonth = prevMonthDate.getMonth();

      let currentMonthIncome = 0;
      let currentMonthExpense = 0;
      let previousMonthIncome = 0;
      let previousMonthExpense = 0;

      const categoryTotals = {};

      txs.forEach((tx) => {
        const amt = Number(tx.amount) || 0;
        const txDate = new Date(tx.transaction_date);
        const txYear = txDate.getFullYear();
        const txMonth = txDate.getMonth();

        if (tx.type === 'income') {
          totalIncome += amt;
          if (txYear === currentYear && txMonth === currentMonth) {
            currentMonthIncome += amt;
          } else if (txYear === prevYear && txMonth === prevMonth) {
            previousMonthIncome += amt;
          }
        } else if (tx.type === 'expense') {
          totalExpense += amt;
          if (txYear === currentYear && txMonth === currentMonth) {
            currentMonthExpense += amt;
            // Category aggregation for current month
            categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + amt;
          } else if (txYear === prevYear && txMonth === prevMonth) {
            previousMonthExpense += amt;
          }
        }
      });

      const totalBalance = totalIncome - totalExpense;

      const incomeChange = calculatePercentageChange(currentMonthIncome, previousMonthIncome);
      const expenseChange = calculatePercentageChange(currentMonthExpense, previousMonthExpense);

      // Convert category totals to array
      const categoryBreakdown = Object.keys(categoryTotals).map((catName) => {
        const val = categoryTotals[catName];
        const pct = currentMonthExpense > 0 ? Math.round((val / currentMonthExpense) * 100) : 0;
        return { name: catName, value: val, percentage: pct };
      }).sort((a, b) => b.value - a.value);

      // Budget metrics
      const monthlyBudget = Number(profile?.monthly_budget) || 0;
      const budgetUsedPercent = monthlyBudget > 0 ? Math.round((currentMonthExpense / monthlyBudget) * 100) : 0;
      const budgetRemaining = Math.max(0, monthlyBudget - currentMonthExpense);

      setMetrics({
        totalBalance,
        totalIncome,
        totalExpense,
        currentMonthIncome,
        currentMonthExpense,
        previousMonthIncome,
        previousMonthExpense,
        incomeChange,
        expenseChange,
        categoryBreakdown,
        recentTransactions: txs.slice(0, 8),
        monthlyBudget,
        budgetUsedPercent,
        budgetRemaining
      });
    } catch (err) {
      console.error('Dashboard calculation error:', err);
      setError('Failed to compute dashboard metrics');
    } finally {
      setLoading(false);
    }
  }, [user, profile]);

  useEffect(() => {
    calculateDashboardData();
  }, [calculateDashboardData]);

  return {
    metrics,
    loading,
    error,
    refreshDashboard: calculateDashboardData
  };
}
