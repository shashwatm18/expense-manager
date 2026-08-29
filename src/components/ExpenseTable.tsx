import React from 'react';
import { Edit3, Trash2, CheckCircle, Clock, RotateCcw, Plus, CreditCard, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { Expense } from '../types';

interface ExpenseTableProps {
  expenses: Expense[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  totalResults: number;
  limit: number;
  onPageChange: (newPage: number) => void;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
  onQuickStatusChange: (id: number, newStatus: 'Paid' | 'Pending' | 'Reimbursed') => void;
  onOpenAddModal: () => void;
}

export const ExpenseTable: React.FC<ExpenseTableProps> = ({
  expenses,
  isLoading,
  page,
  totalPages,
  totalResults,
  limit,
  onPageChange,
  onEdit,
  onDelete,
  onQuickStatusChange,
  onOpenAddModal,
}) => {
  if (isLoading && expenses.length === 0) {
    return (
      <div className="bg-[#141414] p-16 border-2 border-[#F5F5F5]/20 text-center">
        <div className="w-10 h-10 border-4 border-[#00FF41] border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#00FF41]">
          SYNCHRONIZING DATA TIER...
        </p>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="bg-[#141414] p-16 border-2 border-[#F5F5F5]/20 text-center">
        <div className="w-16 h-16 bg-[#262626] border-2 border-[#F5F5F5]/20 text-[#00FF41] flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-black text-[#F5F5F5] uppercase tracking-tight mb-1">
          NO RECORDS FOUND
        </h3>
        <p className="text-xs font-mono text-[#F5F5F5]/50 max-w-md mx-auto mb-6 uppercase">
          NO TRANSACTIONS MATCH YOUR ACTIVE QUERY OR DATABASE IS EMPTY.
        </p>
        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#00FF41] hover:bg-white text-[#0F0F0F] font-black text-xs uppercase tracking-tight transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>ADD NEW ENTRY</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#141414] border-2 border-[#F5F5F5]/20 overflow-hidden">
      {/* Desktop / Tablet Table View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-[#F5F5F5] bg-[#0F0F0F] text-[#00FF41] text-[10px] font-black uppercase tracking-[0.25em]">
              <th className="py-4 px-4">CATEGORY</th>
              <th className="py-4 px-4">DESCRIPTION / TITLE</th>
              <th className="py-4 px-4">MODE</th>
              <th className="py-4 px-4 text-right">DATE</th>
              <th className="py-4 px-4 text-right">AMOUNT</th>
              <th className="py-4 px-4 text-center">STATUS</th>
              <th className="py-4 px-4 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5F5F5]/10 text-sm">
            {expenses.map((expense) => (
              <tr
                key={expense.id}
                id={`expense-row-${expense.id}`}
                className="hover:bg-[#1C1C1C] transition-colors group"
              >
                {/* Category */}
                <td className="py-4 px-4 whitespace-nowrap">
                  <span className="inline-block text-xs font-black uppercase tracking-wider text-[#F5F5F5]">
                    {expense.category_name}
                  </span>
                </td>

                {/* Title & Notes */}
                <td className="py-4 px-4">
                  <div className="font-bold text-[#F5F5F5] tracking-tight">{expense.title}</div>
                  {expense.notes && (
                    <p className="text-xs text-[#F5F5F5]/40 truncate max-w-xs mt-0.5 font-mono">
                      {expense.notes}
                    </p>
                  )}
                </td>

                {/* Payment Method */}
                <td className="py-4 px-4 whitespace-nowrap text-xs text-[#F5F5F5]/70 font-mono uppercase">
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-[#00FF41]" />
                    <span>{expense.payment_method}</span>
                  </div>
                </td>

                {/* Date */}
                <td className="py-4 px-4 whitespace-nowrap text-right font-mono text-xs font-bold text-[#F5F5F5]/60 uppercase">
                  {new Date(expense.date + 'T00:00:00').toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>

                {/* Amount */}
                <td className="py-4 px-4 whitespace-nowrap text-right">
                  <span className="text-xl sm:text-2xl font-black text-[#F5F5F5] tracking-tighter">
                    ${Number(expense.amount).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </td>

                {/* Status with Quick Toggle Dropdown */}
                <td className="py-4 px-4 whitespace-nowrap text-center">
                  <select
                    value={expense.status}
                    onChange={(e) =>
                      onQuickStatusChange(
                        expense.id,
                        e.target.value as 'Paid' | 'Pending' | 'Reimbursed'
                      )
                    }
                    className={`cursor-pointer text-[10px] font-mono font-black uppercase px-2.5 py-1 border transition-all ${
                      expense.status === 'Paid'
                        ? 'bg-[#00FF41]/10 text-[#00FF41] border-[#00FF41]'
                        : expense.status === 'Pending'
                        ? 'bg-amber-400/10 text-amber-400 border-amber-400'
                        : 'bg-sky-400/10 text-sky-400 border-sky-400'
                    }`}
                  >
                    <option value="Paid" className="bg-[#0F0F0F] text-[#00FF41]">✓ PAID</option>
                    <option value="Pending" className="bg-[#0F0F0F] text-amber-400">⏳ PENDING</option>
                    <option value="Reimbursed" className="bg-[#0F0F0F] text-sky-400">↩ REIMBURSED</option>
                  </select>
                </td>

                {/* Actions */}
                <td className="py-4 px-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100">
                    <button
                      id={`edit-expense-${expense.id}`}
                      onClick={() => onEdit(expense)}
                      className="p-1.5 border border-[#F5F5F5]/20 bg-[#0F0F0F] text-[#F5F5F5] hover:border-[#00FF41] hover:text-[#00FF41] transition-all"
                      title="Edit expense record"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      id={`delete-expense-${expense.id}`}
                      onClick={() => onDelete(expense)}
                      className="p-1.5 border border-[#F5F5F5]/20 bg-[#0F0F0F] text-[#F5F5F5]/60 hover:border-[#FF3333] hover:text-[#FF3333] transition-all"
                      title="Delete expense record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-5 py-4 border-t-2 border-[#F5F5F5]/20 bg-[#0F0F0F] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="text-[#F5F5F5]/60 uppercase">
          PAGE <strong className="text-[#F5F5F5] font-black">{page}</strong> OF{' '}
          <strong className="text-[#F5F5F5] font-black">{totalPages}</strong> &bull; TOTAL:{' '}
          <strong className="text-[#00FF41] font-black">{totalResults}</strong>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="p-2 border border-[#F5F5F5]/30 bg-[#141414] hover:bg-[#262626] disabled:opacity-30 disabled:cursor-not-allowed text-[#F5F5F5]"
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(Math.max(0, page - 3), Math.min(totalPages, page + 2))
              .map((p) => (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={`px-3 py-1.5 text-xs font-mono font-bold ${
                    p === page
                      ? 'bg-[#00FF41] text-[#0F0F0F]'
                      : 'bg-[#141414] border border-[#F5F5F5]/30 text-[#F5F5F5] hover:bg-[#262626]'
                  }`}
                >
                  {p}
                </button>
              ))}
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="p-2 border border-[#F5F5F5]/30 bg-[#141414] hover:bg-[#262626] disabled:opacity-30 disabled:cursor-not-allowed text-[#F5F5F5]"
              title="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
