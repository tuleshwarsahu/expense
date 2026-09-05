import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { formatCurrency } from '../../lib/utils';
import { useTheme } from '../../context/ThemeContext';

export default function SpendingTrendChart({ transactions = [], currency = 'INR' }) {
  const [range, setRange] = useState('30d');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const chartData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    const now = new Date();
    let daysToInclude = 30;
    if (range === '7d') daysToInclude = 7;
    if (range === '3m') daysToInclude = 90;
    if (range === '6m') daysToInclude = 180;
    if (range === '1y') daysToInclude = 365;

    const startDate = new Date();
    startDate.setDate(now.getDate() - daysToInclude);

    // Group expenses by date
    const dailyMap = {};

    // Initialize all dates in range with 0
    for (let i = daysToInclude; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dailyMap[dateKey] = { dateKey, label, expense: 0, income: 0 };
    }

    transactions.forEach((tx) => {
      const txDate = tx.transaction_date;
      if (dailyMap[txDate]) {
        const amt = Number(tx.amount) || 0;
        if (tx.type === 'expense') {
          dailyMap[txDate].expense += amt;
        } else if (tx.type === 'income') {
          dailyMap[txDate].income += amt;
        }
      }
    });

    return Object.values(dailyMap);
  }, [transactions, range]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Spending Trend
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Daily expense pattern over selected duration
          </p>
        </div>

        {/* Range Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-auto">
          {[
            { label: '7D', value: '7d' },
            { label: '30D', value: '30d' },
            { label: '3M', value: '3m' },
            { label: '6M', value: '6m' },
            { label: '1Y', value: '1y' }
          ].map((btn) => (
            <button
              key={btn.value}
              onClick={() => setRange(btn.value)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                range === btn.value
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full pt-2">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm">
            No spending data available for this range
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={isDark ? '#1e293b' : '#f1f5f9'}
              />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 11 }}
                tickFormatter={(val) => `${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-800">
                        <p className="font-semibold text-slate-300">{label}</p>
                        <p className="text-indigo-400 font-bold">
                          Expense: {formatCurrency(payload[0].value, currency)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="expense"
                stroke="#6366f1"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#expenseGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
