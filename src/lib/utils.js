import { CURRENCIES } from './constants';

/**
 * Formats a numeric value into currency format
 */
export function formatCurrency(amount, currencyCode = 'INR') {
  const currencyObj = CURRENCIES.find((c) => c.code === currencyCode) || { symbol: '₹' };
  const num = Number(amount) || 0;
  
  // Format with commas based on locale
  const formattedNum = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  }).format(num);

  return `${currencyObj.symbol}${formattedNum}`;
}

/**
 * Formats date into readable string e.g. "05 Sep 2026"
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
}

/**
 * Calculates percentage change between current and previous values safely
 */
export function calculatePercentageChange(current, previous) {
  const curr = Number(current) || 0;
  const prev = Number(previous) || 0;
  
  if (prev === 0) {
    if (curr === 0) return { percent: 0, isIncrease: true, isZero: true };
    return { percent: 100, isIncrease: true, isZero: false };
  }

  const change = ((curr - prev) / prev) * 100;
  return {
    percent: Math.abs(Math.round(change * 10) / 10),
    isIncrease: change >= 0,
    isZero: false
  };
}

export { exportToPDF } from './pdfExport';

/**
 * Exports JSON transactions array to CSV download file
 */
export function exportToCSV(transactions, filename = 'transactions.csv') {
  if (!transactions || transactions.length === 0) {
    alert('No transactions available to export.');
    return;
  }

  const headers = ['ID', 'Date', 'Type', 'Category', 'Description', 'Amount'];
  const rows = transactions.map((t) => [
    t.id,
    t.transaction_date,
    t.type,
    `"${(t.category || '').replace(/"/g, '""')}"`,
    `"${(t.description || '').replace(/"/g, '""')}"`,
    t.amount
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
