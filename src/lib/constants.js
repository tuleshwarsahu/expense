import {
  Utensils,
  ShoppingBag,
  Car,
  Receipt,
  Film,
  HeartPulse,
  GraduationCap,
  Plane,
  Home,
  MoreHorizontal,
  Briefcase,
  Laptop,
  Building,
  TrendingUp,
  Gift,
  DollarSign,
  Tag,
  CreditCard,
  Coffee,
  Smartphone,
  ShieldAlert,
  Dumbbell,
  BookOpen,
  Music,
  Zap,
  Package
} from 'lucide-react';

export const ICON_MAP = {
  Utensils,
  ShoppingBag,
  Car,
  Receipt,
  Film,
  HeartPulse,
  GraduationCap,
  Plane,
  Home,
  MoreHorizontal,
  Briefcase,
  Laptop,
  Building,
  TrendingUp,
  Gift,
  DollarSign,
  Tag,
  CreditCard,
  Coffee,
  Smartphone,
  ShieldAlert,
  Dumbbell,
  BookOpen,
  Music,
  Zap,
  Package
};

export const DEFAULT_EXPENSE_CATEGORIES = [
  { name: 'Food', icon: 'Utensils', color: '#f97316' },
  { name: 'Grocery', icon: 'ShoppingBag', color: '#10b981' },
  { name: 'Shopping', icon: 'CreditCard', color: '#ec4899' },
  { name: 'Transport', icon: 'Car', color: '#3b82f6' },
  { name: 'Bills', icon: 'Receipt', color: '#ef4444' },
  { name: 'Entertainment', icon: 'Film', color: '#8b5cf6' },
  { name: 'Health', icon: 'HeartPulse', color: '#06b6d4' },
  { name: 'Education', icon: 'GraduationCap', color: '#6366f1' },
  { name: 'Travel', icon: 'Plane', color: '#14b8a6' },
  { name: 'Rent', icon: 'Home', color: '#eab308' },
  { name: 'Other', icon: 'MoreHorizontal', color: '#64748b' }
];

export const DEFAULT_INCOME_CATEGORIES = [
  { name: 'Salary', icon: 'Briefcase', color: '#10b981' },
  { name: 'Freelance', icon: 'Laptop', color: '#3b82f6' },
  { name: 'Business', icon: 'Building', color: '#8b5cf6' },
  { name: 'Investment', icon: 'TrendingUp', color: '#f59e0b' },
  { name: 'Bonus', icon: 'Gift', color: '#ec4899' },
  { name: 'Other', icon: 'DollarSign', color: '#64748b' }
];

export const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (INR)' },
  { code: 'USD', symbol: '$', name: 'US Dollar (USD)' },
  { code: 'EUR', symbol: '€', name: 'Euro (EUR)' },
  { code: 'GBP', symbol: '£', name: 'British Pound (GBP)' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen (JPY)' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar (AUD)' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar (CAD)' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar (SGD)' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham (AED)' }
];

export const DATE_PRESETS = [
  { label: 'All Time', value: 'all' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'This Year', value: 'year' },
  { label: 'Custom', value: 'custom' }
];
