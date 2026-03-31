import React from 'react';
import { Payment, Role } from '../types';
import { Plus, FileText } from 'lucide-react';
import { inr, fmtD } from '../utils';
import { Invoice } from '../components/Invoice';

interface PaymentsPageProps {
  payments: Payment[];
  role: Role;
  onAdd: () => void;
  dark: boolean;
  gymName: string;
}

export const PaymentsPage: React.FC<PaymentsPageProps> = ({ payments, role, onAdd, dark, gymName }) => {
  const [sel, setSel] = React.useState<Payment | null>(null);
  if (role !== 'admin') return null;

  return (
    <div className="space-y-4">
      {sel && <Invoice payment={sel} gymName={gymName} onClose={() => setSel(null)} />}
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-[#f0eff5]">Payment Records</p>
        <button onClick={onAdd} className="bg-orange-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
          <Plus size={16} /> Record Payment
        </button>
      </div>

      <div className={`rounded-2xl border ${dark ? "bg-[#13131e] border-white/5" : "bg-white border-black/5 shadow-sm"} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="bg-orange-500/5 text-orange-500 uppercase font-bold tracking-wider">
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-600">No payments recorded yet.</td>
                </tr>
              ) : (
                payments.map(p => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-bold">{p.memberName}</td>
                    <td className="px-4 py-3 text-gray-500">{p.planName}</td>
                    <td className="px-4 py-3 font-black text-orange-500">{inr(p.amount)}</td>
                    <td className="px-4 py-3 text-gray-500">{fmtD(p.date)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-lg font-bold ${p.status === "Paid" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSel(p)} className="p-2 hover:bg-orange-500/10 rounded-lg transition-colors text-orange-500">
                        <FileText size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
