import React from 'react';
import { Member, Payment, Role } from '../types';
import { dLeft, inr, fmtD } from '../utils';
import { Bell, CreditCard } from 'lucide-react';

interface AlertsPageProps {
  members: Member[];
  payments: Payment[];
  role: Role;
  dark: boolean;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({ members, payments, role, dark }) => {
  const exp7 = members.filter(m => {
    const days = dLeft(m.endDate);
    return days > 0 && days <= 7;
  });

  const pendingPayments = payments.filter(p => p.status === "Pending");

  return (
    <div className="space-y-4">
      <div className={`p-4 rounded-2xl border ${dark ? "bg-[#13131e] border-orange-500/20" : "bg-white border-orange-500/20 shadow-sm"}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
            <Bell size={16} className="text-orange-500" />
          </div>
          <p className="text-sm font-bold">Expiring in 7 Days ({exp7.length})</p>
        </div>
        {exp7.length === 0 ? (
          <p className="text-xs text-gray-600 text-center py-4">No expiries soon.</p>
        ) : (
          <div className="space-y-2">
            {exp7.map(m => (
              <div key={m.id} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                <div>
                  <p className="text-xs font-bold">{m.name}</p>
                  <p className="text-[10px] text-gray-500">{m.planName} · {m.phone}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-orange-500">{dLeft(m.endDate)} days</p>
                  <p className="text-[9px] text-gray-600">{fmtD(m.endDate)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {role === 'admin' && (
        <div className={`p-4 rounded-2xl border ${dark ? "bg-[#13131e] border-red-500/20" : "bg-white border-red-500/20 shadow-sm"}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center">
              <CreditCard size={16} className="text-red-500" />
            </div>
            <p className="text-sm font-bold">Pending Payments ({pendingPayments.length})</p>
          </div>
          {pendingPayments.length === 0 ? (
            <p className="text-xs text-gray-600 text-center py-4">All clear!</p>
          ) : (
            <div className="space-y-2">
              {pendingPayments.map(p => (
                <div key={p.id} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                  <div>
                    <p className="text-xs font-bold">{p.memberName}</p>
                    <p className="text-[10px] text-gray-500">{p.planName} · {fmtD(p.date)}</p>
                  </div>
                  <p className="text-xs font-black text-red-500">{inr(p.amount)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
