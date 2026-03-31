import React from 'react';
import { Member, Role } from '../types';
import { Search, Plus, Edit2, Trash2, Phone } from 'lucide-react';
import { avt, dLeft, inr } from '../utils';

interface MembersPageProps {
  members: Member[];
  role: Role;
  search: string;
  setSearch: (s: string) => void;
  filter: string;
  setFilter: (f: string) => void;
  onAdd: () => void;
  onEdit: (m: Member) => void;
  onDelete: (m: Member) => void;
  dark: boolean;
}

export const MembersPage: React.FC<MembersPageProps> = ({ members, role, search, setSearch, filter, setFilter, onAdd, onEdit, onDelete, dark }) => {
  const filtered = members.filter(m => {
    const q = search.toLowerCase();
    const match = !q || m.name.toLowerCase().includes(q) || m.phone.includes(q);
    const days = dLeft(m.endDate);
    const fMatch = filter === "All" || (filter === "Active" && days > 0) || (filter === "Expired" && days <= 0);
    return match && fMatch;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          {["All", "Active", "Expired"].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${filter === f ? "bg-orange-500 text-white" : "bg-white/5 text-gray-500"}`}>{f}</button>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3">
            <Search size={14} className="text-gray-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members..." className="bg-transparent border-none outline-none py-2.5 text-xs w-full" />
          </div>
          <button onClick={onAdd} className="bg-orange-500 text-white p-2.5 rounded-xl hover:bg-orange-600 transition-colors">
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map(m => {
          const days = dLeft(m.endDate);
          const active = days > 0;
          return (
            <div key={m.id} className={`p-4 rounded-2xl border ${dark ? "bg-[#13131e] border-white/5" : "bg-white border-black/5 shadow-sm"}`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${active ? "bg-orange-500 text-white" : "bg-gray-800 text-gray-500"}`}>
                    {avt(m.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{m.name}</p>
                    <p className="text-[10px] text-gray-500 flex items-center gap-1"><Phone size={10} /> {m.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${active ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>
                    {active ? `${days}d` : "EXP"}
                  </span>
                  <button onClick={() => onEdit(m)} className="p-2 rounded-lg bg-white/5 text-gray-500 hover:text-white transition-colors"><Edit2 size={14} /></button>
                  {role === 'admin' && (
                    <button onClick={() => onDelete(m)} className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={14} /></button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/5">
                <div>
                  <p className="text-[9px] text-gray-600 uppercase font-bold mb-0.5">Plan</p>
                  <p className="text-[11px] font-bold truncate">{m.planName}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-600 uppercase font-bold mb-0.5">Trainer</p>
                  <p className="text-[11px] font-bold truncate">{m.trainer.split(" ")[0]}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-600 uppercase font-bold mb-0.5">Payment</p>
                  <p className={`text-[11px] font-bold ${m.paymentStatus === "Paid" ? "text-emerald-500" : "text-red-500"}`}>{m.paymentStatus}</p>
                </div>
                {role === 'admin' && (
                  <div>
                    <p className="text-[9px] text-gray-600 uppercase font-bold mb-0.5">Cost</p>
                    <p className="text-[11px] font-bold text-orange-500">{inr(m.planPrice || 0)}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
