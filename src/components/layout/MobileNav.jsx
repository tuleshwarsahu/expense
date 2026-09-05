import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  BarChart3,
  User,
  Plus
} from 'lucide-react';

export default function MobileNav({ onOpenAddModal }) {
  const location = useLocation();
  const currentPath = location.pathname;

  const leftItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'History', path: '/transactions', icon: Receipt }
  ];

  const rightItems = [
    { label: 'Reports', path: '/reports/monthly', icon: BarChart3, isReports: true },
    { label: 'Profile', path: '/profile', icon: User }
  ];

  const isItemActive = (item) => {
    if (item.isReports) {
      return currentPath.startsWith('/reports');
    }
    return currentPath === item.path;
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 px-2 py-2 shadow-2xl transition-colors pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="grid grid-cols-5 items-center max-w-md mx-auto relative">
        {/* Left Nav items */}
        {leftItems.map((item) => {
          const Icon = item.icon;
          const active = isItemActive(item);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 py-1.5 px-1 rounded-2xl transition-all duration-200 ${
                active
                  ? 'text-indigo-600 dark:text-indigo-400 font-extrabold scale-105'
                  : 'text-slate-500 dark:text-slate-400 font-medium active:scale-95'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </NavLink>
          );
        })}

        {/* Floating Center Action Button */}
        <div className="flex items-center justify-center relative -top-3">
          <button
            onClick={onOpenAddModal}
            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/40 active:scale-90 transition-transform border-2 border-white dark:border-slate-900"
            aria-label="Add transaction record"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Right Nav items */}
        {rightItems.map((item) => {
          const Icon = item.icon;
          const active = isItemActive(item);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 py-1.5 px-1 rounded-2xl transition-all duration-200 ${
                active
                  ? 'text-indigo-600 dark:text-indigo-400 font-extrabold scale-105'
                  : 'text-slate-500 dark:text-slate-400 font-medium active:scale-95'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
