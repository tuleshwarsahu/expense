import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { formatCurrency } from '../../lib/utils';
import { useTheme } from '../../context/ThemeContext';

const COLORS = [
  '#f97316', '#10b981', '#ec4899', '#3b82f6',
  '#8b5cf6', '#ef4444', '#06b6d4', '#6366f1',
  '#14b8a6', '#eab308', '#64748b'
];

export default function CategoryPieChart({ categoryBreakdown = [], currency = 'INR', onSelectCategory }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!categoryBreakdown || categoryBreakdown.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Category Distribution
        </h3>
        <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
          No category spending recorded yet
        </div>
      </div>
    );
  }

  const totalExpense = categoryBreakdown.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Category Distribution
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Current month expense breakdown
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Donut Chart */}
        <div className="h-60 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {categoryBreakdown.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    className="cursor-pointer transition-opacity hover:opacity-80"
                    onClick={() => onSelectCategory && onSelectCategory(entry.name)}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-xl text-xs space-y-0.5 border border-slate-800">
                        <p className="font-bold">{data.name}</p>
                        <p className="text-indigo-400">
                          {formatCurrency(data.value, currency)} ({data.percentage}%)
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Total
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {formatCurrency(totalExpense, currency)}
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {categoryBreakdown.map((item, index) => (
            <div
              key={item.name}
              onClick={() => onSelectCategory && onSelectCategory(item.name)}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                  {item.name}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  {formatCurrency(item.value, currency)}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
