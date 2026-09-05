import React, { useState } from 'react';
import { Search, Download, Filter, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { DATE_PRESETS } from '../../lib/constants';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function TransactionFilters({
  filters,
  onFilterChange,
  categories = [],
  onExportPDF,
  onExportCSV
}) {
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const handleExport = onExportPDF || onExportCSV;

  const selectedMonthDate = filters.selectedMonthDate || new Date();
  const year = selectedMonthDate.getFullYear();
  const month = selectedMonthDate.getMonth();

  const handlePrevMonth = () => {
    const prevDate = new Date(year, month - 1, 1);
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];
    onFilterChange({
      datePreset: 'month',
      selectedMonthDate: prevDate,
      startDate,
      endDate
    });
  };

  const handleNextMonth = () => {
    const nextDate = new Date(year, month + 1, 1);
    const startDate = new Date(year, month + 1, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month + 2, 0).toISOString().split('T')[0];
    onFilterChange({
      datePreset: 'month',
      selectedMonthDate: nextDate,
      startDate,
      endDate
    });
  };

  const handleMonthPickerChange = (e) => {
    if (!e.target.value) return;
    const [yStr, mStr] = e.target.value.split('-');
    const pickedYear = parseInt(yStr, 10);
    const pickedMonth = parseInt(mStr, 10) - 1;
    const pickedDate = new Date(pickedYear, pickedMonth, 1);
    const startDate = new Date(pickedYear, pickedMonth, 1).toISOString().split('T')[0];
    const endDate = new Date(pickedYear, pickedMonth + 1, 0).toISOString().split('T')[0];
    onFilterChange({
      datePreset: 'month',
      selectedMonthDate: pickedDate,
      startDate,
      endDate
    });
  };

  const handlePresetChange = (e) => {
    const val = e.target.value;
    if (val === 'month') {
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
      onFilterChange({
        datePreset: 'month',
        selectedMonthDate: now,
        startDate,
        endDate
      });
    } else {
      onFilterChange({ datePreset: val, startDate: '', endDate: '' });
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
      {/* Search Bar & Mobile Filter Toggle */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search category or description..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs sm:text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setShowFiltersMobile((prev) => !prev)}
          className="sm:hidden p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0"
          title="Toggle filters"
        >
          <Filter className="w-4 h-4" />
        </button>

        {/* Export PDF Button */}
        {handleExport && (
          <button
            onClick={handleExport}
            className="hidden sm:inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors shadow-sm shrink-0"
          >
            <Download className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Export PDF</span>
          </button>
        )}
      </div>

      {/* Selectors Grid */}
      <div className={`${showFiltersMobile ? 'grid' : 'hidden sm:grid'} grid-cols-2 sm:grid-cols-4 gap-2 pt-1`}>
        {/* Type Filter */}
        <select
          value={filters.type || 'all'}
          onChange={(e) => onFilterChange({ type: e.target.value })}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          <option value="all">All Types</option>
          <option value="expense">Expenses Only</option>
          <option value="income">Income Only</option>
        </select>

        {/* Category Filter */}
        <select
          value={filters.category || 'all'}
          onChange={(e) => onFilterChange({ category: e.target.value })}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none truncate"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id || cat.name} value={cat.name}>
              {cat.name} ({cat.type})
            </option>
          ))}
        </select>

        {/* Date Preset */}
        <select
          value={filters.datePreset || 'all'}
          onChange={handlePresetChange}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          {DATE_PRESETS.map((preset) => (
            <option key={preset.value} value={preset.value}>
              {preset.label}
            </option>
          ))}
        </select>

        {/* Sort By */}
        <select
          value={filters.sortBy || 'newest'}
          onChange={(e) => onFilterChange({ sortBy: e.target.value })}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest Amount</option>
          <option value="lowest">Lowest Amount</option>
        </select>

        {/* Mobile Export Button */}
        {handleExport && (
          <div className="col-span-2 sm:hidden pt-2">
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Export PDF</span>
            </button>
          </div>
        )}
      </div>

      {/* Previous Months Navigation Control (Same as Monthly Report) */}
      {filters.datePreset === 'month' && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900/60 transition-all">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold transition-colors flex items-center gap-1 text-xs shadow-xs"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Prev Month</span>
            </button>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xs">
              <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white min-w-[110px] text-center">
                {MONTH_NAMES[month]} {year}
              </span>
            </div>

            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold transition-colors flex items-center gap-1 text-xs shadow-xs"
              title="Next Month"
            >
              <span>Next Month</span>
              <ChevronRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">Select Month:</span>
            <input
              type="month"
              value={`${year}-${String(month + 1).padStart(2, '0')}`}
              onChange={handleMonthPickerChange}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none shadow-xs"
            />
          </div>
        </div>
      )}

      {/* Custom Date Range Controls */}
      {filters.datePreset === 'custom' && (
        <div className="flex flex-col sm:flex-row items-center gap-2 p-3 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/50 text-xs">
          <div className="flex items-center justify-between w-full sm:w-auto gap-2">
            <span className="font-semibold text-slate-600 dark:text-slate-300 shrink-0">From:</span>
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => onFilterChange({ startDate: e.target.value })}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium flex-1 sm:flex-initial"
            />
          </div>
          <div className="flex items-center justify-between w-full sm:w-auto gap-2">
            <span className="font-semibold text-slate-600 dark:text-slate-300 shrink-0">To:</span>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => onFilterChange({ endDate: e.target.value })}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium flex-1 sm:flex-initial"
            />
          </div>
        </div>
      )}
    </div>
  );
}
