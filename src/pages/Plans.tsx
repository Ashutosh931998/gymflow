import React from 'react';
import { Plan, Role } from '../types';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { inr } from '../utils';

interface PlansPageProps {
  plans: Plan[];
  role: Role;
  onAdd: () => void;
  onEdit: (p: Plan) => void;
  onDelete: (p: Plan) => void;
  dark: boolean;
}

export const PlansPage: React.FC<PlansPageProps> = ({ plans, role, onAdd, onEdit, onDelete, dark }) => {
  if (role !== 'admin') return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold">Membership Plans ({plans.length})</p>
        <button onClick={onAdd} className="bg-orange-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
          <Plus size={16} /> New Plan
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {plans.map(p => (
          <div key={p.id} className={`p-5 rounded-2xl border ${dark ? "bg-[#13131e] border-white/5" : "bg-white border-black/5 shadow-sm"} relative overflow-hidden`}>
            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-orange-500/5" />
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-bold mb-1">{p.name}</p>
                <p className="text-[10px] text-gray-500">{p.duration} Month{p.duration > 1 ? "s" : ""}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => onEdit(p)} className="p-2 rounded-lg bg-white/5 text-gray-500 hover:text-white transition-colors"><Edit2 size={14} /></button>
                <button onClick={() => onDelete(p)} className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
            <p className="text-2xl font-black text-orange-500 mb-2">{inr(p.price)}</p>
            <p className="text-[11px] text-gray-500 leading-relaxed">{p.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
