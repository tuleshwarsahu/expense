import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import { formatCurrency } from '../../lib/utils';
import { useTheme } from '../../context/ThemeContext';

export default function WeeklyBarChart({ dailyData = [], currency = 'INR' }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Find max value to highlight highest day
  const maxExpense = Math.max(...dailyData.map((d) => d.expense || 0), 0);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Daily Spending Breakdown
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Monday through Sunday spending comparison
        </p>
      </div>

      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={isDark ? '#1e293b' : '#f1f5f9'}
            />
            <XAxis
              dataKey="day"
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
                    <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-xl text-xs space-y-1 border border-slate-800">
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
            <Bar dataKey="expense" radius={[8, 8, 0, 0]}>
              {dailyData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.expense === maxExpense && maxExpense > 0 ? '#6366f1' : '#818cf8'}
                  opacity={entry.expense === maxExpense && maxExpense > 0 ? 1 : 0.65}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
