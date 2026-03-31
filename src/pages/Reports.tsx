import React from 'react';
import { Member, Payment, User, Role, Plan } from '../types';
import { inr } from '../utils';
import { TrendingUp, Users, CreditCard, PieChart } from 'lucide-react';

interface ReportsPageProps {
  members: Member[];
  payments: Payment[];
  staff: User[];
  plans: Plan[];
  role: Role;
  dark: boolean;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ members, payments, staff, plans, role, dark }) => {
  if (role !== 'admin') return null;

  const totalRevenue = payments.filter(p => p.status === "Paid").reduce((s, p) => s + p.amount, 0);
  const totalSalaries = staff.reduce((s, u) => s + (u.salary || 0), 0);
  const netProfit = totalRevenue - totalSalaries; // Simplified costing

  const stats = [
    { label: "Total Revenue", value: inr(totalRevenue), icon: TrendingUp, color: "text-emerald-500" },
    { label: "Total Expenses (Salaries)", value: inr(totalSalaries), icon: CreditCard, color: "text-red-500" },
    { label: "Net Profit", value: inr(netProfit), icon: PieChart, color: "text-blue-500" },
    { label: "Total Members", value: members.length, icon: Users, color: "text-orange-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((s, i) => (
          <div key={i} className={`p-6 rounded-2xl border ${dark ? "bg-[#13131e] border-white/5" : "bg-white border-black/5 shadow-sm"}`}>
            <div className="flex items-center gap-3 mb-2">
              <s.icon size={18} className={s.color} />
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{s.label}</p>
            </div>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className={`p-6 rounded-2xl border ${dark ? "bg-[#13131e] border-white/5" : "bg-white border-black/5 shadow-sm"}`}>
        <p className="text-sm font-bold mb-4">Plan Distribution</p>
        <div className="space-y-4">
          {plans.map(p => {
            const count = members.filter(m => m.planId === p.id).length;
            const percent = members.length > 0 ? (count / members.length) * 100 : 0;
            return (
              <div key={p.id} className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold">
                  <span>{p.name}</span>
                  <span className="text-gray-500">{count} ({Math.round(percent)}%)</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
