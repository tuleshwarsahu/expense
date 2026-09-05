import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency, formatDate } from './utils';

/**
 * Exports transactions array to a beautifully styled PDF document
 */
export function exportToPDF(transactions, currencyCode = 'INR', filename = 'transactions_report.pdf') {
  if (!transactions || transactions.length === 0) {
    alert('No transactions available to export.');
    return;
  }

  const doc = new jsPDF();

  // Summary statistics
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const netBalance = totalIncome - totalExpense;

  // Header Bar
  doc.setFillColor(79, 70, 229); // Indigo 600
  doc.rect(0, 0, 210, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Transaction Statement', 14, 18);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const todayStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  doc.text(`Generated: ${todayStr}`, 145, 18);

  // Summary Card Box
  doc.setFillColor(248, 250, 252); // Slate 50
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.roundedRect(14, 34, 182, 22, 3, 3, 'FD');

  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139); // Slate 500
  doc.text('Total Records', 20, 42);
  doc.text('Total Income', 65, 42);
  doc.text('Total Expense', 110, 42);
  doc.text('Net Balance', 155, 42);

  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42); // Slate 900
  doc.text(`${transactions.length}`, 20, 50);

  doc.setTextColor(16, 185, 129); // Emerald 500
  doc.text(formatCurrency(totalIncome, currencyCode), 65, 50);

  doc.setTextColor(244, 63, 94); // Rose 500
  doc.text(formatCurrency(totalExpense, currencyCode), 110, 50);

  const isPositive = netBalance >= 0;
  doc.setTextColor(isPositive ? 16 : 244, isPositive ? 185 : 63, isPositive ? 129 : 94);
  doc.text(formatCurrency(netBalance, currencyCode), 155, 50);

  // Table Rows Data
  const tableData = transactions.map((t, idx) => [
    idx + 1,
    formatDate(t.transaction_date),
    t.type ? t.type.toUpperCase() : 'EXPENSE',
    t.category || 'Uncategorized',
    t.description || '-',
    t.type === 'income'
      ? `+${formatCurrency(t.amount, currencyCode)}`
      : `-${formatCurrency(t.amount, currencyCode)}`
  ]);

  autoTable(doc, {
    startY: 62,
    head: [['#', 'Date', 'Type', 'Category', 'Description', 'Amount']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [79, 70, 229],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [51, 65, 85]
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 28 },
      2: { cellWidth: 22, fontStyle: 'bold' },
      3: { cellWidth: 35 },
      4: { cellWidth: 55 },
      5: { cellWidth: 32, halign: 'right', fontStyle: 'bold' }
    },
    didParseCell: function (data) {
      if (data.section === 'body' && data.column.index === 2) {
        if (data.cell.raw === 'INCOME') {
          data.cell.styles.textColor = [16, 185, 129];
        } else {
          data.cell.styles.textColor = [244, 63, 94];
        }
      }
      if (data.section === 'body' && data.column.index === 5) {
        const text = String(data.cell.raw || '');
        if (text.startsWith('+')) {
          data.cell.styles.textColor = [16, 185, 129];
        } else {
          data.cell.styles.textColor = [225, 29, 72];
        }
      }
    },
    didDrawPage: function (data) {
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Page ${data.pageNumber} of ${pageCount}`,
        data.settings.margin.left,
        doc.internal.pageSize.height - 10
      );
    }
  });

  doc.save(filename);
}
