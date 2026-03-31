import React from 'react';
import { AppPermissions, Role } from '../types';
import { Shield, Check, X } from 'lucide-react';

interface SettingsPageProps {
  permissions: AppPermissions;
  onUpdate: (p: AppPermissions) => void;
  dark: boolean;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ permissions, onUpdate, dark }) => {
  const roles: Role[] = ['receptionist', 'trainer'];
  const allPages = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'members', label: 'Members' },
    { id: 'plans', label: 'Plans' },
    { id: 'checkin', label: 'Check-In' },
    { id: 'payments', label: 'Payments' },
    { id: 'alerts', label: 'Alerts' },
    { id: 'reports', label: 'Reports' },
    { id: 'staff', label: 'Staff Management' },
  ];

  const allActions = [
    { id: 'member:add', label: 'Add Member' },
    { id: 'member:edit', label: 'Edit Member' },
    { id: 'member:delete', label: 'Delete Member' },
    { id: 'payment:add', label: 'Record Payment' },
    { id: 'plan:add', label: 'Manage Plans' },
    { id: 'staff:add', label: 'Manage Staff' },
  ];

  const togglePage = (role: 'receptionist' | 'trainer', pageId: string) => {
    const newPerms = { ...permissions };
    const current = newPerms[role].pages;
    if (current.includes(pageId)) {
      newPerms[role].pages = current.filter(p => p !== pageId);
    } else {
      newPerms[role].pages = [...current, pageId];
    }
    onUpdate(newPerms);
  };

  const toggleAction = (role: 'receptionist' | 'trainer', actionId: string) => {
    const newPerms = { ...permissions };
    const current = newPerms[role].actions;
    if (current.includes(actionId)) {
      newPerms[role].actions = current.filter(a => a !== actionId);
    } else {
      newPerms[role].actions = [...current, actionId];
    }
    onUpdate(newPerms);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Shield className="text-orange-500" size={20} />
        <h2 className="text-lg font-bold">Role Permissions</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map(role => (
          <div key={role} className={`p-6 rounded-3xl border ${dark ? "bg-[#13131e] border-white/5" : "bg-white border-black/5 shadow-sm"}`}>
            <p className="text-sm font-black text-orange-500 uppercase tracking-widest mb-4 capitalize">{role} Access</p>
            
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">Visible Pages</p>
                <div className="grid grid-cols-2 gap-2">
                  {allPages.map(page => {
                    const active = permissions[role as keyof AppPermissions].pages.includes(page.id);
                    return (
                      <button
                        key={page.id}
                        onClick={() => togglePage(role as any, page.id)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-[10px] font-bold transition-all ${active ? "bg-orange-500 text-white" : "bg-white/5 text-gray-500 hover:bg-white/10"}`}
                      >
                        {page.label}
                        {active ? <Check size={12} /> : <X size={12} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">Allowed Actions</p>
                <div className="grid grid-cols-1 gap-2">
                  {allActions.map(action => {
                    const active = permissions[role as keyof AppPermissions].actions.includes(action.id);
                    return (
                      <button
                        key={action.id}
                        onClick={() => toggleAction(role as any, action.id)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-[10px] font-bold transition-all ${active ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-white/5 text-gray-500 hover:bg-white/10"}`}
                      >
                        {action.label}
                        {active ? <Check size={12} /> : <X size={12} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
