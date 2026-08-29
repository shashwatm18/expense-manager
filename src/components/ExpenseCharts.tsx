import React from 'react';
import { PieChart, TrendingUp, CreditCard } from 'lucide-react';
import { ExpenseStats } from '../types';

interface ExpenseChartsProps {
  stats: ExpenseStats | null;
}

export const ExpenseCharts: React.FC<ExpenseChartsProps> = ({ stats }) => {
  if (!stats || stats.byCategory.length === 0) return null;

  const maxCategoryTotal = Math.max(...stats.byCategory.map((c) => c.total), 1);
  const maxMonthTotal = Math.max(...(stats.byMonth?.map((m) => m.total) || [1]), 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      {/* 1. Category Distribution Breakdown */}
      <div className="bg-[#141414] p-6 border-2 border-[#F5F5F5]/20 lg:col-span-2 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] font-black text-[#00FF41] mb-1">
                SECTOR ALLOCATION
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-[#F5F5F5] tracking-tighter uppercase">
                SPENDING BY CATEGORY
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#F5F5F5]/70 bg-[#262626] px-2.5 py-1 border border-[#F5F5F5]/20">
              {stats.byCategory.length} ACTIVE SECTORS
            </span>
          </div>

          <div className="space-y-4">
            {stats.byCategory.slice(0, 6).map((cat) => {
              const barWidth = Math.max(Math.round((cat.total / maxCategoryTotal) * 100), 3);
              return (
                <div key={cat.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#F5F5F5] uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#00FF41] inline-block" />
                      {cat.category}
                    </span>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="font-black text-sm text-[#F5F5F5] tracking-tight">
                        ${cat.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-[#00FF41] text-xs font-black w-10 text-right">
                        {cat.percentage}%
                      </span>
                    </div>
                  </div>
                  {/* Horizontal Progress Bar */}
                  <div className="w-full bg-[#262626] h-2 overflow-hidden">
                    <div
                      className="h-full bg-[#00FF41] transition-all duration-500"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Payment Method & Monthly Trend Insights */}
      <div className="bg-[#141414] p-6 border-2 border-[#F5F5F5]/20 flex flex-col justify-between space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] font-black text-[#00FF41] mb-1">
                CHANNEL MIX
              </p>
              <h3 className="text-xl font-black text-[#F5F5F5] tracking-tighter uppercase">
                PAYMENT MODES
              </h3>
            </div>
            <CreditCard className="w-4 h-4 text-[#00FF41]" />
          </div>

          <div className="space-y-3">
            {stats.byPaymentMethod.map((pm) => {
              const percent = stats.totalSpent > 0 ? Math.round((pm.total / stats.totalSpent) * 100) : 0;
              return (
                <div key={pm.payment_method} className="flex items-center justify-between text-xs border-b border-[#F5F5F5]/10 pb-2">
                  <span className="text-[#F5F5F5]/80 font-bold uppercase tracking-wider">{pm.payment_method}</span>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="font-bold text-[#F5F5F5]">${pm.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    <span className="text-[11px] font-black text-[#0F0F0F] bg-[#F5F5F5] px-1.5 py-0.5">
                      {percent}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Trend Mini-Bar */}
        {stats.byMonth && stats.byMonth.length > 0 && (
          <div className="pt-4 border-t-2 border-[#F5F5F5]/10">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-[#F5F5F5] uppercase tracking-wider mb-3">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#00FF41]" />
                <span>MONTHLY VOLUME</span>
              </span>
              <span className="text-[10px] text-[#F5F5F5]/50">LAST 4 CYCLES</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {stats.byMonth.slice(-4).map((m) => {
                const heightPercent = Math.max(Math.round((m.total / maxMonthTotal) * 100), 12);
                return (
                  <div key={m.month} className="text-center">
                    <div className="h-16 bg-[#262626] flex items-end justify-center p-1 border border-[#F5F5F5]/10">
                      <div
                        className="w-full bg-[#00FF41] hover:bg-white transition-all cursor-pointer"
                        style={{ height: `${heightPercent}%` }}
                        title={`${m.month_name}: $${m.total}`}
                      />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#F5F5F5]/70 block truncate mt-1.5 uppercase">
                      {m.month_name.slice(0, 3)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
