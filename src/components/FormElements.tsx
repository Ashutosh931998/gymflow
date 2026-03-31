import React from 'react';

interface FldProps {
  label: string;
  err?: string;
  children: React.ReactNode;
}

export const Fld: React.FC<FldProps> = ({ label, err, children }) => (
  <div className="mb-4">
    <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">{label}</label>
    {children}
    {err && <p className="text-red-500 text-[10px] mt-1 font-medium">{err}</p>}
  </div>
);

export const IS = (err?: string, dark: boolean = true) => 
  `w-full p-3 rounded-xl border-1.5 ${err ? "border-red-500" : dark ? "border-white/10" : "border-black/10"} ${dark ? "bg-white/5 text-[#f0eff5]" : "bg-gray-50 text-[#1a1a2e]"} text-sm outline-none focus:border-orange-500 transition-colors placeholder:text-gray-600`;

export const SS = (dark: boolean = true) => 
  `w-full p-3 rounded-xl border-1.5 ${dark ? "border-white/10 bg-[#1e1e2e] text-[#f0eff5]" : "border-black/10 bg-gray-50 text-[#1a1a2e]"} text-sm outline-none focus:border-orange-500 transition-colors cursor-pointer appearance-none`;
