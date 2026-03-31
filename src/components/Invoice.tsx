import React from 'react';
import { Payment } from '../types';
import { inr, fmtD } from '../utils';
import { Printer, X, Shield } from 'lucide-react';

interface InvoiceProps {
  payment: Payment;
  gymName: string;
  onClose: () => void;
}

export const Invoice: React.FC<InvoiceProps> = ({ payment, gymName, onClose }) => {
  const print = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-sans invoice-overlay">
      <div className="bg-white text-gray-900 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white">
              <Shield size={18} />
            </div>
            <p className="font-black text-orange-500 tracking-tighter text-lg">GymFlow</p>
          </div>
          <div className="flex gap-2">
            <button onClick={print} className="p-2 hover:bg-gray-200 rounded-xl transition-colors text-gray-600">
              <Printer size={20} />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-xl transition-colors text-gray-600">
              <X size={20} />
            </button>
          </div>
        </div>

        <div id="printable-invoice" className="p-10 space-y-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-1 uppercase tracking-tighter">Invoice</h2>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">#{payment.id.slice(-6).toUpperCase()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-gray-900">{gymName}</p>
              <p className="text-[10px] text-gray-500 font-medium">Official Payment Receipt</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 py-8 border-y border-gray-100">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Billed To</p>
              <p className="text-sm font-black text-gray-900">{payment.memberName}</p>
              <p className="text-xs text-gray-500 mt-1">Gym Member</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Date Issued</p>
              <p className="text-sm font-black text-gray-900">{fmtD(payment.date)}</p>
              <p className="text-xs text-gray-500 mt-1">Payment Method: {payment.method}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">
              <span>Description</span>
              <span>Amount</span>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-black text-gray-900">{payment.planName} Membership</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Full access to gym facilities</p>
              </div>
              <p className="text-sm font-black text-gray-900">{inr(payment.amount)}</p>
            </div>
          </div>

          <div className="pt-8 flex justify-between items-end">
            <div>
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-2">
                <Shield size={24} />
              </div>
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Payment {payment.status}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
              <p className="text-4xl font-black text-orange-500 tracking-tighter">{inr(payment.amount)}</p>
            </div>
          </div>

          <div className="pt-10 text-center">
            <p className="text-[10px] text-gray-400 font-medium italic">Thank you for being a part of {gymName}!</p>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* Hide everything by default */
          body * { display: none !important; }
          
          /* Show only the invoice and its parents */
          #printable-invoice, 
          #printable-invoice *,
          .invoice-overlay, 
          .invoice-overlay * { 
            display: block !important; 
            visibility: visible !important;
          }

          /* Reset positioning for print */
          .invoice-overlay { 
            position: absolute !important; 
            top: 0 !important; 
            left: 0 !important; 
            width: 100% !important; 
            height: auto !important;
            background: white !important;
            padding: 0 !important;
          }

          /* Hide modal header/buttons during print */
          .bg-gray-50\/50, .bg-gray-50\/50 * { display: none !important; }
          
          /* Ensure invoice is full width */
          #printable-invoice {
            width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
          }
        }
      `}} />
    </div>
  );
};
