import React from 'react';
import { Trash2 } from 'lucide-react';

interface ConfirmProps {
  msg: string;
  sub?: string;
  onOk: () => void;
  onCancel: () => void;
}

export const Confirm: React.FC<ConfirmProps> = ({ msg, sub, onOk, onCancel }) => (
  <div onClick={onCancel} className="fixed inset-0 bg-black/75 flex items-center justify-center z-[500] p-5 backdrop-blur-sm">
    <div onClick={e => e.stopPropagation()} className="bg-[#1a1a28] border border-white/10 rounded-2xl p-6 w-full max-w-xs shadow-2xl animate-in zoom-in-95">
      <div className="w-10 h-10 bg-red-500/15 rounded-xl flex items-center justify-center mb-4">
        <Trash2 size={20} className="text-red-500" />
      </div>
      <p className="text-base font-bold text-[#f0eff5] mb-1">{msg}</p>
      {sub && <p className="text-xs text-gray-500 mb-5">{sub}</p>}
      <div className="flex gap-3 mt-4">
        <button onClick={onCancel} className="flex-1 p-2.5 rounded-xl border border-white/10 bg-transparent text-gray-400 text-sm font-medium hover:bg-white/5 transition-colors">Cancel</button>
        <button onClick={() => { onOk(); onCancel(); }} className="flex-1 p-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors">Delete</button>
      </div>
    </div>
  </div>
);
