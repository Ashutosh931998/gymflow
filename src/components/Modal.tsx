import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => (
  <div onClick={onClose} className="fixed inset-0 bg-black/75 flex items-end sm:items-center justify-center z-[300] backdrop-blur-sm">
    <div onClick={e => e.stopPropagation()} className="bg-[#13131e] border border-white/10 rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto pb-safe shadow-2xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-4">
      <div className="flex items-center justify-between p-4 border-b border-white/5 sticky top-0 bg-[#13131e] z-10 rounded-t-3xl">
        <p className="text-sm font-bold text-[#f0eff5]">{title}</p>
        <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 transition-colors">
          <X size={16} />
        </button>
      </div>
      <div className="p-5">{children}</div>
    </div>
  </div>
);
