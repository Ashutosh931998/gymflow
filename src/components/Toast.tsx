import React, { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle } from 'lucide-react';

interface ToastProps {
  msg: string;
  type: 'ok' | 'err' | 'warn';
  onDone: () => void;
}

export const Toast: React.FC<ToastProps> = ({ msg, type, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  const bg = type === "err" ? "bg-red-500" : type === "warn" ? "bg-amber-500" : "bg-emerald-500";
  const Icon = type === "err" ? X : type === "warn" ? AlertTriangle : CheckCircle;

  return (
    <div className={`fixed top-4 right-4 left-4 z-[9999] flex items-center gap-3 p-4 rounded-xl text-white text-sm font-semibold shadow-2xl ${bg} animate-in fade-in slide-in-from-top-4`}>
      <Icon size={18} className="shrink-0" />
      <span className="flex-1">{msg}</span>
    </div>
  );
};
