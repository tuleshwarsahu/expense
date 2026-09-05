import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { formatCurrency } from '../../lib/utils';
import { useTheme } from '../../context/ThemeContext';

export default function IncomeExpenseChart({ data = [], currency = 'INR' }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Income vs Expense
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Comparative analysis over time
        </p>
      </div>

      <div className="h-64 sm:h-72 w-full pt-2">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm">
            No income or expense data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                        {payload.map((entry) => (
                          <p
                            key={entry.name}
                            className={`font-bold ${
                              entry.name === 'Income' ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {entry.name}: {formatCurrency(entry.value, currency)}
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: 10, fontSize: 12 }}
                formatter={(val) => (
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {val}
                  </span>
                )}
              />
              <Bar dataKey="Income" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Expense" fill="#f43f5e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
