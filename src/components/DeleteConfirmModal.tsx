import React, { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Expense } from '../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  expense: Expense | null;
  onClose: () => void;
  onConfirm: (id: number) => Promise<void>;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  expense,
  onClose,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !expense) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(expense.id);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#0F0F0F] border-4 border-[#FF3333] max-w-md w-full shadow-2xl text-[#F5F5F5] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b-2 border-[#FF3333]/40 bg-[#FF3333]/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#FF3333] text-[#0F0F0F] flex items-center justify-center font-black">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#FF3333] block">
                DESTRUCTIVE ACTION
              </span>
              <h3 className="text-xl font-black uppercase tracking-tight text-[#F5F5F5]">
                DELETE RECORD #{expense.id}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-[#F5F5F5]/30 bg-[#0F0F0F] text-[#F5F5F5] hover:border-[#FF3333] hover:text-[#FF3333] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-xs font-mono text-[#F5F5F5]/70 uppercase mb-4">
            ARE YOU SURE YOU WANT TO PERMANENTLY REMOVE THIS RECORD FROM THE POSTGRESQL DATA TIER? THIS ACTION CANNOT BE UNDONE.
          </p>

          <div className="p-4 bg-[#141414] border-2 border-[#F5F5F5]/20 font-mono text-xs space-y-2 mb-6">
            <div className="font-black text-sm uppercase text-[#F5F5F5]">{expense.title}</div>
            <div className="flex items-center justify-between text-[#F5F5F5]/60 uppercase">
              <span>AMOUNT: <strong className="text-[#00FF41]">${expense.amount.toFixed(2)}</strong></span>
              <span>DATE: {expense.date}</span>
            </div>
            <div className="text-[#F5F5F5]/60 uppercase">
              CATEGORY: <span className="font-bold text-[#F5F5F5]">{expense.category_name}</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-5 py-2.5 border-2 border-[#F5F5F5]/30 bg-[#141414] hover:bg-[#262626] text-[#F5F5F5] text-xs font-bold uppercase tracking-wider transition-all"
            >
              CANCEL
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-6 py-2.5 bg-[#FF3333] hover:bg-white text-[#0F0F0F] text-xs sm:text-sm font-black uppercase tracking-tight transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              <span>{isDeleting ? 'DELETING...' : 'CONFIRM DELETE'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
