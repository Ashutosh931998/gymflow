import React from 'react';
import { User, Role } from '../types';
import { Plus, Edit2, Trash2, Mail, Phone, Shield } from 'lucide-react';
import { avt, inr, fmtD } from '../utils';

interface StaffPageProps {
  staff: User[];
  role: Role;
  onAdd: () => void;
  onEdit: (u: User) => void;
  onDelete: (u: User) => void;
  dark: boolean;
}

export const StaffPage: React.FC<StaffPageProps> = ({ staff, role, onAdd, onEdit, onDelete, dark }) => {
  if (role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-6">
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-4">
          <Shield size={32} className="text-red-500" />
        </div>
        <p className="text-lg font-black mb-2">Access Restricted</p>
        <p className="text-sm text-gray-500 max-w-xs">Only Admin can view and manage staff members.</p>
      </div>
    );
  }

  const totalSalary = staff.reduce((s, u) => s + (u.salary || 0), 0);

  return (
    <div className="space-y-4">
      <div className={`p-5 rounded-2xl border border-orange-500/30 bg-orange-500/5 flex items-center justify-between`}>
        <div>
          <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wider mb-1">Total Monthly Salary</p>
          <p className="text-3xl font-black text-orange-500">{inr(totalSalary)}</p>
        </div>
        <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
          <TrendingUp size={24} className="text-orange-500" />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm font-bold">Staff Members ({staff.length})</p>
        <button onClick={onAdd} className="bg-orange-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
          <Plus size={16} /> Add Staff
        </button>
      </div>

      <div className="space-y-3">
        {staff.map(u => (
          <div key={u.id} className={`p-4 rounded-2xl border ${dark ? "bg-[#13131e] border-white/5" : "bg-white border-black/5 shadow-sm"}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black shrink-0 ${u.role === 'trainer' ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"}`}>
                  {avt(u.name)}
                </div>
                <div>
                  <p className="text-sm font-bold">{u.name}</p>
                  <p className="text-[10px] text-gray-500 flex items-center gap-2"><Mail size={10} /> {u.email}</p>
                  <p className="text-[10px] text-gray-500 flex items-center gap-2"><Phone size={10} /> {u.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black px-2 py-1 rounded-lg capitalize ${u.role === 'trainer' ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"}`}>
                  {u.role}
                </span>
                <button onClick={() => onEdit(u)} className="p-2 rounded-lg bg-white/5 text-gray-500 hover:text-white transition-colors"><Edit2 size={14} /></button>
                <button onClick={() => onDelete(u)} className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/5">
              <div>
                <p className="text-[9px] text-gray-600 uppercase font-bold mb-0.5">Monthly Salary</p>
                <p className="text-[11px] font-bold text-orange-500">{inr(u.salary || 0)}</p>
              </div>
              <div>
                <p className="text-[9px] text-gray-600 uppercase font-bold mb-0.5">Joined</p>
                <p className="text-[11px] font-bold">{fmtD(u.joinDate)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import { TrendingUp } from 'lucide-react';
