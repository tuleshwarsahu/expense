import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

export default function SummaryCard({
  title,
  amount,
  currency = 'INR',
  change = null,
  icon: Icon,
  variant = 'indigo'
}) {
  const variantStyles = {
    indigo: {
      bgIcon: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400',
      accent: 'border-l-4 border-l-indigo-500'
    },
    emerald: {
      bgIcon: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
      accent: 'border-l-4 border-l-emerald-500'
    },
    rose: {
      bgIcon: 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400',
      accent: 'border-l-4 border-l-rose-500'
    },
    amber: {
      bgIcon: 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
      accent: 'border-l-4 border-l-amber-500'
    }
  };

  const style = variantStyles[variant] || variantStyles.indigo;

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all ${style.accent}`}>
      <div className="flex items-center justify-between mb-1.5 sm:mb-3">
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
          {title}
        </span>
        {Icon && (
          <div className={`p-1.5 sm:p-2.5 rounded-xl ${style.bgIcon} shrink-0`}>
            <Icon className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-1 flex-wrap sm:flex-nowrap">
        <h3 className="text-base sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight truncate">
          {formatCurrency(amount, currency)}
        </h3>

        {change && !change.isZero && (
          <div
            className={`inline-flex items-center gap-0.5 text-[9px] sm:text-xs font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
              change.isIncrease
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
            }`}
          >
            {change.isIncrease ? (
              <ArrowUpRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
            ) : (
              <ArrowDownRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
            )}
            <span>{change.percent}%</span>
          </div>
        )}
      </div>

      {change && (
        <p className="text-[9px] sm:text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-1 sm:mt-2">
          vs last month
        </p>
      )}
    </div>
  );
}
