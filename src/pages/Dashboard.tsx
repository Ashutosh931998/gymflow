import React from 'react';
import { User, Member, Payment, Attendance, Role } from '../types';
import { inr } from '../utils';
import { Users, CheckCircle, TrendingUp, Calendar } from 'lucide-react';

interface DashboardProps {
  members: Member[];
  attendance: Attendance[];
  payments: Payment[];
  role: Role;
  dark: boolean;
  onNavigate: (page: string) => void;
  onCheckOut: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ members, attendance, payments, role, dark, onNavigate, onCheckOut }) => {
  const activeM = members.filter(m => {
    const days = Math.ceil((new Date(m.endDate).getTime() - new Date().getTime()) / 864e5);
    return days > 0;
  });
  const today = new Date().toISOString().slice(0, 10);
  const todayAtt = attendance.filter(a => a.date === today);
  const currentlyIn = todayAtt.filter(a => !a.checkOutTime).length;
  const month = new Date().toISOString().slice(0, 7);
  const monthRev = payments.filter(p => p.date.startsWith(month) && p.status === "Paid").reduce((s, p) => s + p.amount, 0);

  const kpis = [
    { label: "Total Members", value: members.length, sub: "All time", color: "text-orange-500", bg: "bg-orange-500/10", icon: Users, page: "members", roles: ["admin", "receptionist", "trainer"] },
    { label: "Currently In", value: currentlyIn, sub: "Active now", color: "text-emerald-500", bg: "bg-emerald-500/10", icon: CheckCircle, page: "checkin", roles: ["admin", "receptionist", "trainer"] },
    { label: "Today Check-ins", value: todayAtt.length, sub: "Total today", color: "text-blue-500", bg: "bg-blue-500/10", icon: Calendar, page: "checkin", roles: ["admin", "receptionist", "trainer"] },
    { label: "Monthly Revenue", value: inr(monthRev), sub: new Date().toLocaleString("default", { month: "long" }), color: "text-purple-500", bg: "bg-purple-500/10", icon: TrendingUp, page: "payments", roles: ["admin"] },
  ].filter(k => k.roles.includes(role));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {kpis.map((k, i) => (
          <div key={i} onClick={() => onNavigate(k.page)} className={`p-4 rounded-2xl border ${dark ? "bg-[#13131e] border-white/5" : "bg-white border-black/5 shadow-sm"} cursor-pointer hover:scale-[1.02] transition-transform relative overflow-hidden`}>
            <div className={`absolute -top-4 -right-4 w-12 h-12 rounded-full ${k.bg}`} />
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{k.label}</p>
            <p className={`text-2xl font-black ${k.color} leading-none mb-1`}>{k.value}</p>
            <p className="text-[10px] text-gray-600">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className={`p-4 rounded-2xl border ${dark ? "bg-[#13131e] border-white/5" : "bg-white border-black/5 shadow-sm"}`}>
        <p className="text-xs font-bold mb-3">Recent Activity</p>
        {todayAtt.length === 0 ? (
          <p className="text-xs text-gray-600 text-center py-4">No activity yet today.</p>
        ) : (
          <div className="space-y-2">
            {todayAtt.slice(0, 5).map((a, i) => (
              <div key={a.id} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                <div className="flex flex-col">
                  <span className="text-xs font-medium">{a.memberName}</span>
                  <span className="text-[8px] text-gray-500 uppercase font-bold tracking-widest">
                    {a.checkOutTime ? "Checked Out" : "Checked In"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[10px] text-emerald-500 font-bold">In: {new Date(a.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    {a.checkOutTime && (
                      <p className="text-[10px] text-red-500 font-bold">Out: {new Date(a.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    )}
                  </div>
                  {!a.checkOutTime && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onCheckOut(a.id);
                      }}
                      className="px-2 py-1 bg-red-500/10 text-red-500 text-[8px] font-bold rounded-lg hover:bg-red-500 hover:text-white transition-all"
                    >
                      Check-out
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
