import React from 'react';
import { Lead } from '../types';
import { Search, Plus, Phone, Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface FollowUpProps {
  leads: Lead[];
  onAdd: () => void;
  onEdit: (l: Lead) => void;
  onDelete: (l: Lead) => void;
  onStatusChange: (id: string, status: Lead['status']) => void;
  dark: boolean;
  search: string;
  setSearch: (s: string) => void;
}

export const FollowUpPage: React.FC<FollowUpProps> = ({ 
  leads, onAdd, onEdit, onStatusChange, dark, search, setSearch 
}) => {
  const filtered = leads.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) || 
    l.phone.includes(search)
  );

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'Joined': return 'text-green-500 bg-green-500/10';
      case 'Not interested': return 'text-red-500 bg-red-500/10';
      default: return 'text-orange-500 bg-orange-500/10';
    }
  };

  const getStatusIcon = (status: Lead['status']) => {
    switch (status) {
      case 'Joined': return <CheckCircle2 size={12} />;
      case 'Not interested': return <XCircle size={12} />;
      default: return <Clock size={12} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search leads by name or phone..." 
            className={`w-full pl-12 pr-4 py-3 rounded-2xl border text-sm outline-none transition-all ${dark ? "bg-[#13131e] border-white/5 focus:border-orange-500" : "bg-white border-black/5 focus:border-orange-500 shadow-sm"}`}
          />
        </div>
        <button 
          onClick={onAdd}
          className="bg-orange-500 text-white px-6 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all active:scale-95"
        >
          <Plus size={18} />
          Register Lead
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className={`col-span-full py-20 text-center rounded-3xl border border-dashed ${dark ? "border-white/10" : "border-black/10"}`}>
            <p className="text-gray-500 text-sm font-medium">No leads found matching your search.</p>
          </div>
        ) : (
          filtered.map(l => (
            <div key={l.id} className={`p-5 rounded-3xl border transition-all hover:scale-[1.01] ${dark ? "bg-[#13131e] border-white/5" : "bg-white border-black/5 shadow-sm"}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 font-black">
                    {l.name[0]}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">{l.name}</h3>
                    <p className="text-[10px] text-gray-500 font-medium">Registered on {new Date(l.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(l.status)}`}>
                  {getStatusIcon(l.status)}
                  {l.status}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Phone size={14} className="text-orange-500" />
                  <span className="font-medium">{l.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Calendar size={14} className="text-orange-500" />
                  <span className="font-medium">Expected: {new Date(l.expectedJoinDate).toLocaleDateString()}</span>
                </div>
                {l.notes && (
                  <p className="text-[10px] text-gray-500 italic mt-2 bg-white/5 p-2 rounded-lg border border-white/5">
                    "{l.notes}"
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                <button 
                  onClick={() => onEdit(l)}
                  className="flex-1 py-2 rounded-xl bg-white/5 text-[10px] font-bold hover:bg-white/10 transition-colors"
                >
                  Edit Details
                </button>
                <div className="flex gap-1">
                  {l.status !== 'Joined' && (
                    <button 
                      onClick={() => onStatusChange(l.id, 'Joined')}
                      className="p-2 rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all"
                      title="Mark as Joined"
                    >
                      <CheckCircle2 size={16} />
                    </button>
                  )}
                  {l.status !== 'Not interested' && (
                    <button 
                      onClick={() => onStatusChange(l.id, 'Not interested')}
                      className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                      title="Mark as Not Interested"
                    >
                      <XCircle size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
