import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { formatCurrency } from '../../lib/utils';

const COLORS = [
  '#f97316', '#10b981', '#ec4899', '#3b82f6',
  '#8b5cf6', '#ef4444', '#06b6d4', '#6366f1',
  '#14b8a6', '#eab308', '#64748b'
];

export default function CategoryPieChart({ categoryBreakdown = [], currency = 'INR', onSelectCategory }) {
  if (!categoryBreakdown || categoryBreakdown.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Category Distribution
        </h3>
        <div className="h-56 flex items-center justify-center text-slate-400 text-xs sm:text-sm">
          No category spending recorded yet
        </div>
      </div>
    );
  }

  const totalExpense = categoryBreakdown.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between overflow-hidden h-full space-y-3">
      {/* Card Header */}
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Category Distribution
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Current period expense breakdown
        </p>
      </div>

      <div className="flex flex-col items-center w-full flex-1 justify-center space-y-3">
        {/* Donut Chart Container - 1:1 Aspect Ratio Square to Guarantee Perfect Circle */}
        <div className="w-44 h-44 sm:w-48 sm:h-48 aspect-square relative flex items-center justify-center shrink-0 mx-auto">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <Pie
                data={categoryBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={72}
                paddingAngle={3}
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

          {/* Center text inside Donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
              TOTAL
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate max-w-[100px]">
              {formatCurrency(totalExpense, currency)}
            </span>
          </div>
        </div>

        {/* Legend Breakdown List Below Donut */}
        <div className="w-full space-y-1 max-h-40 overflow-y-auto pt-2 border-t border-slate-100 dark:border-slate-800">
          {categoryBreakdown.map((item, index) => (
            <div
              key={item.name}
              onClick={() => onSelectCategory && onSelectCategory(item.name)}
              className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors text-xs"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="font-semibold text-slate-700 dark:text-slate-200 truncate">
                  {item.name}
                </span>
              </div>
              <div className="text-right shrink-0 flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatCurrency(item.value, currency)}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold w-7 text-right">
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
