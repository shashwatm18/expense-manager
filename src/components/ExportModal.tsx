import React, { useState } from 'react';
import { X, Download, FileSpreadsheet, Code2, Check } from 'lucide-react';
import { Expense } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: Expense[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  expenses,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const downloadCSV = () => {
    const headers = ['ID', 'Title', 'Amount', 'Category', 'Date', 'Payment Method', 'Status', 'Notes', 'Created At'];
    const rows = expenses.map((e) => [
      e.id,
      `"${(e.title || '').replace(/"/g, '""')}"`,
      e.amount,
      `"${e.category_name}"`,
      e.date,
      `"${e.payment_method}"`,
      `"${e.status}"`,
      `"${(e.notes || '').replace(/"/g, '""')}"`,
      e.created_at || '',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `expenses_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadJSON = () => {
    const jsonContent = JSON.stringify(expenses, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `expenses_export_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(expenses, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#0F0F0F] border-4 border-[#F5F5F5] max-w-md w-full shadow-2xl text-[#F5F5F5] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b-2 border-[#F5F5F5] bg-[#141414]">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#00FF41] block">
              DATA DUMP TIER
            </span>
            <h3 className="text-xl font-black uppercase tracking-tight text-[#F5F5F5]">
              EXPORT DATASET
            </h3>
            <p className="text-[10px] font-mono text-[#F5F5F5]/50 uppercase mt-0.5">
              {expenses.length} TOTAL RECORDS LOADED
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-[#F5F5F5]/30 bg-[#0F0F0F] text-[#F5F5F5] hover:border-[#FF3333] hover:text-[#FF3333] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {/* CSV Export Option */}
            <button
              onClick={downloadCSV}
              className="p-4 border-2 border-[#F5F5F5]/30 bg-[#141414] hover:border-[#00FF41] text-left transition-all group"
            >
              <div className="w-8 h-8 bg-[#00FF41]/10 border border-[#00FF41]/30 text-[#00FF41] flex items-center justify-center mb-3">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div className="font-black text-sm uppercase tracking-tight text-[#F5F5F5] group-hover:text-[#00FF41]">
                CSV TABLE
              </div>
              <div className="text-[10px] font-mono text-[#F5F5F5]/50 mt-1 uppercase">
                EXCEL / SHEETS FORMAT
              </div>
            </button>

            {/* JSON Export Option */}
            <button
              onClick={downloadJSON}
              className="p-4 border-2 border-[#F5F5F5]/30 bg-[#141414] hover:border-[#00FF41] text-left transition-all group"
            >
              <div className="w-8 h-8 bg-[#00FF41]/10 border border-[#00FF41]/30 text-[#00FF41] flex items-center justify-center mb-3">
                <Code2 className="w-4 h-4" />
              </div>
              <div className="font-black text-sm uppercase tracking-tight text-[#F5F5F5] group-hover:text-[#00FF41]">
                JSON ARRAY
              </div>
              <div className="text-[10px] font-mono text-[#F5F5F5]/50 mt-1 uppercase">
                STRUCTURED PAYLOAD
              </div>
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={copyToClipboard}
              className="w-full py-2.5 px-3 border-2 border-[#F5F5F5]/30 bg-[#141414] text-xs font-mono font-bold uppercase tracking-wider text-[#F5F5F5] hover:border-[#00FF41] hover:text-[#00FF41] flex items-center justify-center gap-2 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#00FF41]" />
                  <span className="text-[#00FF41]">COPIED TO CLIPBOARD!</span>
                </>
              ) : (
                <>
                  <Code2 className="w-3.5 h-3.5 text-[#F5F5F5]/50" />
                  <span>COPY RAW JSON CLIPBOARD</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t-2 border-[#F5F5F5]/20 bg-[#141414] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-[#F5F5F5] bg-[#0F0F0F] border-2 border-[#F5F5F5]/30 hover:border-[#00FF41] hover:text-[#00FF41] transition-all"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
