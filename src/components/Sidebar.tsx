import React from 'react';
import { LayoutGrid, Users, CreditCard, CheckCircle, Bell, BarChart3, LogOut, Sun, Moon, Menu, Settings, Phone, Video } from 'lucide-react';
import { Role, AppPermissions } from '../types';

interface SidebarProps {
  page: string;
  setPage: (p: string) => void;
  role: Role;
  dark: boolean;
  setDark: (d: boolean) => void;
  onLogout: () => void;
  gymName: string;
  userName: string;
  sideOpen: boolean;
  setSideOpen: (o: boolean) => void;
  permissions: AppPermissions;
}

export const Sidebar: React.FC<SidebarProps> = ({ page, setPage, role, dark, setDark, onLogout, gymName, userName, sideOpen, setSideOpen, permissions }) => {
  const navItems = [
    { id: "dashboard", icon: LayoutGrid, label: "Dashboard", roles: ["admin", "receptionist", "trainer"] },
    { id: "members", icon: Users, label: "Members", roles: ["admin", "receptionist", "trainer"] },
    { id: "followup", icon: Phone, label: "Follow Up", roles: ["admin", "receptionist"] },
    { id: "plans", icon: CreditCard, label: "Plans", roles: ["admin", "receptionist", "trainer"] },
    { id: "checkin", icon: CheckCircle, label: "Check-In", roles: ["admin", "receptionist", "trainer"] },
    { id: "payments", icon: CreditCard, label: "Payments", roles: ["admin", "receptionist", "trainer"] },
    { id: "alerts", icon: Bell, label: "Alerts", roles: ["admin", "receptionist", "trainer"] },
    { id: "reports", icon: BarChart3, label: "Reports", roles: ["admin", "receptionist", "trainer"] },
    { id: "staff", icon: Users, label: "Staff", roles: ["admin", "receptionist", "trainer"] },
    { id: "promo", icon: Video, label: "Promo Reel", roles: ["admin"] },
    { id: "settings", icon: Settings, label: "Settings", roles: ["admin"] },
  ].filter(n => {
    if (role === 'admin') return n.roles.includes(role);
    const perms = permissions[role as keyof AppPermissions];
    return perms.pages.includes(n.id);
  });

  const go = (id: string) => {
    setPage(id);
    setSideOpen(false);
  };

  return (
    <>
      {sideOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSideOpen(false)} />}
      <aside className={`fixed top-0 left-0 h-full w-64 z-50 transition-transform lg:translate-x-0 ${sideOpen ? "translate-x-0" : "-translate-x-full"} ${dark ? "bg-[#0e0e16] border-r border-white/5" : "bg-white border-r border-black/5 shadow-xl"}`}>
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
            <Users size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-black text-orange-500 leading-none">GymFlow</p>
            <p className="text-[10px] text-gray-500 truncate mt-1">{gymName}</p>
          </div>
        </div>
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-180px)]">
          {navItems.map(item => (
            <button key={item.id} onClick={() => go(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${page === item.id ? "bg-orange-500/10 text-orange-500" : "text-gray-500 hover:bg-white/5 hover:text-gray-300"}`}>
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-white/5 space-y-1">
          <button onClick={() => setDark(!dark)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-white/5 transition-all">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
            {dark ? "Light Mode" : "Dark Mode"}
          </button>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all">
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};
