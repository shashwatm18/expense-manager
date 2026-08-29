import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, Tag, CreditCard, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { Category, Expense } from '../types';

interface ExpenseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (expenseData: Partial<Expense>) => Promise<boolean>;
  editingExpense: Expense | null;
  categories: Category[];
}

export const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingExpense,
  categories,
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryName, setCategoryName] = useState('Food & Dining');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [status, setStatus] = useState<'Paid' | 'Pending' | 'Reimbursed'>('Paid');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title);
      setAmount(editingExpense.amount.toString());
      setCategoryName(editingExpense.category_name);
      setDate(editingExpense.date);
      setPaymentMethod(editingExpense.payment_method);
      setStatus(editingExpense.status);
      setNotes(editingExpense.notes || '');
    } else {
      setTitle('');
      setAmount('');
      setCategoryName(categories[0]?.name || 'Food & Dining');
      setDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('Credit Card');
      setStatus('Paid');
      setNotes('');
    }
    setErrorMessage(null);
  }, [editingExpense, isOpen, categories]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Form Validations
    if (!title.trim()) {
      setErrorMessage('Please enter an expense title.');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage('Please enter a valid amount greater than $0.00.');
      return;
    }

    if (!date) {
      setErrorMessage('Please select a valid date.');
      return;
    }

    const matchedCategory = categories.find((c) => c.name === categoryName);

    setIsSubmitting(true);
    try {
      const payload: Partial<Expense> = {
        title: title.trim(),
        amount: parsedAmount,
        category_name: categoryName,
        category_id: matchedCategory ? matchedCategory.id : null,
        date,
        payment_method: paymentMethod,
        status,
        notes: notes.trim() || null,
      };

      if (editingExpense) {
        payload.id = editingExpense.id;
      }

      const success = await onSubmit(payload);
      if (success) {
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#0F0F0F] border-4 border-[#F5F5F5] max-w-lg w-full shadow-2xl text-[#F5F5F5] overflow-hidden transform transition-all">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b-2 border-[#F5F5F5] bg-[#141414]">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#00FF41] block">
              DATA ENTRY TIER
            </span>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#F5F5F5]">
              {editingExpense ? 'MODIFY TRANSACTION' : 'NEW EXPENSE ENTRY'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-[#F5F5F5]/30 bg-[#0F0F0F] text-[#F5F5F5] hover:border-[#FF3333] hover:text-[#FF3333] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-[#FF3333]/10 border-2 border-[#FF3333] text-[#FF3333] text-xs font-mono font-bold uppercase flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Amount input banner */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#00FF41] mb-1.5">
              AMOUNT ($ USD) *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-[#00FF41]">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-3xl font-black font-mono bg-[#141414] border-2 border-[#F5F5F5]/30 text-[#F5F5F5] placeholder:text-[#F5F5F5]/20 focus:border-[#00FF41] outline-none transition-all"
                required
                autoFocus
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#00FF41] mb-1.5">
              EXPENSE TITLE / VENDOR *
            </label>
            <input
              type="text"
              placeholder="e.g. Grocery Store, Internet Bill, Flight Ticket"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#141414] border-2 border-[#F5F5F5]/30 text-[#F5F5F5] placeholder:text-[#F5F5F5]/30 focus:border-[#00FF41] outline-none transition-all"
              required
            />
          </div>

          {/* Category and Date (Two Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#00FF41] mb-1.5">
                CATEGORY *
              </label>
              <select
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full px-3 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#141414] border-2 border-[#F5F5F5]/30 text-[#F5F5F5] focus:border-[#00FF41] outline-none transition-all cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name} className="bg-[#0F0F0F] text-[#F5F5F5]">
                    {cat.name.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#00FF41] mb-1.5">
                TRANSACTION DATE *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 text-xs font-mono font-bold uppercase bg-[#141414] border-2 border-[#F5F5F5]/30 text-[#F5F5F5] focus:border-[#00FF41] outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Payment Method and Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Payment Method */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#00FF41] mb-1.5">
                PAYMENT METHOD *
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#141414] border-2 border-[#F5F5F5]/30 text-[#F5F5F5] focus:border-[#00FF41] outline-none transition-all cursor-pointer"
              >
                <option value="Credit Card" className="bg-[#0F0F0F]">CREDIT CARD</option>
                <option value="Debit Card" className="bg-[#0F0F0F]">DEBIT CARD</option>
                <option value="Bank Transfer" className="bg-[#0F0F0F]">BANK TRANSFER</option>
                <option value="Cash" className="bg-[#0F0F0F]">CASH</option>
                <option value="Apple Pay / UPI" className="bg-[#0F0F0F]">APPLE PAY / UPI</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#00FF41] mb-1.5">
                PAYMENT STATUS
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['Paid', 'Pending', 'Reimbursed'] as const).map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`py-2 px-1 text-[10px] font-mono font-black uppercase border transition-all ${
                      status === s
                        ? s === 'Paid'
                          ? 'bg-[#00FF41] text-[#0F0F0F] border-[#00FF41]'
                          : s === 'Pending'
                          ? 'bg-amber-400 text-[#0F0F0F] border-amber-400'
                          : 'bg-sky-400 text-[#0F0F0F] border-sky-400'
                        : 'bg-[#141414] border-[#F5F5F5]/20 text-[#F5F5F5]/60 hover:text-[#F5F5F5]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notes / Description */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#00FF41] mb-1.5">
              NOTES & DESCRIPTION (OPTIONAL)
            </label>
            <textarea
              rows={2}
              placeholder="Add details, receipt reference, or purpose..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono bg-[#141414] border-2 border-[#F5F5F5]/30 text-[#F5F5F5] placeholder:text-[#F5F5F5]/30 focus:border-[#00FF41] outline-none transition-all"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t-2 border-[#F5F5F5]/20 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border-2 border-[#F5F5F5]/30 bg-[#141414] hover:bg-[#262626] text-[#F5F5F5] text-xs font-bold uppercase tracking-wider transition-all"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#00FF41] hover:bg-white text-[#0F0F0F] text-xs sm:text-sm font-black uppercase tracking-tight transition-all disabled:opacity-50"
            >
              {isSubmitting
                ? 'COMMITTING...'
                : editingExpense
                ? 'UPDATE RECORD'
                : 'COMMIT TO DB'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
