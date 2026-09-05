import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Receipt,
  BarChart3,
  CalendarRange,
  PieChart,
  Tag,
  User,
  LogOut,
  Wallet
} from 'lucide-react';

export default function Sidebar() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Transactions', path: '/transactions', icon: Receipt },
    { label: 'Weekly Report', path: '/reports/weekly', icon: BarChart3 },
    { label: 'Monthly Report', path: '/reports/monthly', icon: CalendarRange },
    { label: 'Yearly Report', path: '/reports/yearly', icon: PieChart },
    { label: 'Categories', path: '/categories', icon: Tag },
    { label: 'Profile', path: '/profile', icon: User }
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-colors h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-3">
        <img
          src="/logoE.png"
          alt="MyExpense Logo"
          className="w-10 h-10 rounded-xl object-cover shadow-md"
        />
        <div>
          <h2 className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">
            MyExpense
          </h2>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Personal Finance
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
          Menu
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Footer Logout */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
