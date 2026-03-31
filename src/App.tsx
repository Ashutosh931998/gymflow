import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Member, Plan, Payment, Attendance, Role } from './types';
import { DB } from './db';
import { BASE_PLANS, TRAINERS, PAYMENT_METHODS } from './constants';
import { uid, toDay } from './utils';
import { Sidebar } from './components/Sidebar';
import { Login } from './components/Login';
import { Dashboard } from './pages/Dashboard';
import { MembersPage } from './pages/Members';
import { StaffPage } from './pages/Staff';
import { Toast } from './components/Toast';
import { Confirm } from './components/Confirm';
import { Modal } from './components/Modal';
import { Fld, IS, SS } from './components/FormElements';
import { Menu } from 'lucide-react';

import { PlansPage } from './pages/Plans';
import { PaymentsPage } from './pages/Payments';
import { ReportsPage } from './pages/Reports';
import { AlertsPage } from './pages/Alerts';
import { SettingsPage } from './pages/Settings';
import { AppPermissions } from './types';

const DEFAULT_PERMISSIONS: AppPermissions = {
  trainer: {
    pages: ['dashboard', 'members', 'checkin', 'alerts'],
    actions: ['member:add', 'member:edit']
  },
  receptionist: {
    pages: ['dashboard', 'members', 'checkin', 'payments', 'alerts'],
    actions: ['member:add', 'member:edit', 'payment:add']
  }
};

export default function App() {
  const [authed, setAuthed] = useState(false);
  const [curUser, setCurUser] = useState<User | null>(null);
  const [gymName, setGymName] = useState("");
  const [page, setPage] = useState("dashboard");
  const [dark, setDark] = useState(true);
  const [sideOpen, setSideOpen] = useState(false);
  
  const [plans, setPlans] = useState<Plan[]>(BASE_PLANS);
  const [members, setMembers] = useState<Member[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [staff, setStaff] = useState<User[]>([]);
  const [permissions, setPermissions] = useState<AppPermissions>(DEFAULT_PERMISSIONS);
  
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' | 'warn' } | null>(null);
  const [confirm, setConfirm] = useState<{ msg: string; sub?: string; fn: () => void } | null>(null);
  const [modal, setModal] = useState<{ type: string; data?: any } | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const notify = (msg: string, type: 'ok' | 'err' | 'warn' = 'ok') => setToast({ msg, type });

  useEffect(() => {
    if (authed && curUser && gymName) {
      const data = DB.load(gymName);
      if (data) {
        setPlans(data.plans || BASE_PLANS);
        setMembers(data.members || []);
        setPayments(data.payments || []);
        setAttendance(data.attendance || []);
        setStaff(data.staff || []);
        setPermissions(data.permissions || DEFAULT_PERMISSIONS);
      }
    }
  }, [authed, curUser, gymName]);

  useEffect(() => {
    if (authed && curUser && gymName) {
      DB.save(gymName, { plans, members, payments, attendance, staff, permissions, meta: { gymName } });
    }
  }, [plans, members, payments, attendance, staff, permissions, gymName, authed, curUser]);

  const handleLogin = (u: User, g: string) => {
    setCurUser(u);
    setGymName(g);
    setAuthed(true);
  };

  const handleLogout = () => {
    setAuthed(false);
    setCurUser(null);
  };

  if (!authed || !curUser) {
    return <Login onLogin={handleLogin} dark={dark} />;
  }

  const can = (action: string) => {
    if (curUser?.role === 'admin') return true;
    return permissions[curUser?.role as keyof AppPermissions]?.actions.includes(action);
  };

  return (
    <div className={`min-h-screen flex font-sans ${dark ? "bg-[#0a0a0f] text-[#f0eff5]" : "bg-gray-50 text-[#1a1a2e]"}`}>
      <Sidebar 
        page={page} setPage={setPage} role={curUser.role} 
        dark={dark} setDark={setDark} onLogout={handleLogout} 
        gymName={gymName} userName={curUser.name} 
        sideOpen={sideOpen} setSideOpen={setSideOpen} 
        permissions={permissions}
      />

      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className={`h-14 border-b flex items-center justify-between px-4 sticky top-0 z-30 ${dark ? "bg-[#0e0e16] border-white/5" : "bg-white border-black/5 shadow-sm"}`}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSideOpen(true)} className="lg:hidden p-2 text-gray-500 hover:text-white transition-colors">
              <Menu size={20} />
            </button>
            <h2 className="text-sm font-bold capitalize">{page}</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
              <div className="w-6 h-6 bg-orange-500 rounded-lg flex items-center justify-center text-[10px] font-black text-white">
                {curUser.name[0]}
              </div>
              <div className="hidden sm:block">
                <p className="text-[10px] font-bold leading-none">{curUser.name.split(" ")[0]}</p>
                <p className="text-[8px] text-orange-500 font-bold uppercase tracking-widest mt-0.5">{curUser.role}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 max-w-4xl mx-auto w-full pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {page === "dashboard" && (
                <Dashboard 
                  members={members} attendance={attendance} 
                  payments={payments} role={curUser.role} 
                  dark={dark} onNavigate={setPage} 
                  onCheckOut={(id) => {
                    setAttendance(prev => prev.map(x => x.id === id ? { ...x, checkOutTime: new Date().toISOString() } : x));
                    notify("Checked out");
                  }}
                />
              )}
              {page === "members" && (
                <MembersPage 
                  members={members} role={curUser.role} 
                  search={search} setSearch={setSearch} 
                  filter={filter} setFilter={setFilter} 
                  onAdd={() => can('member:add') ? setModal({ type: "member" }) : notify("Access denied", "err")} 
                  onEdit={(m) => can('member:edit') ? setModal({ type: "member", data: m }) : notify("Access denied", "err")} 
                  onDelete={(m) => can('member:delete') ? setConfirm({ msg: `Delete ${m.name}?`, sub: "This will remove all member data.", fn: () => setMembers(p => p.filter(x => x.id !== m.id)) }) : notify("Access denied", "err")} 
                  dark={dark} 
                />
              )}
              {page === "staff" && (
                <StaffPage 
                  staff={staff} role={curUser.role} 
                  onAdd={() => can('staff:add') ? setModal({ type: "staff" }) : notify("Access denied", "err")} 
                  onEdit={(u) => can('staff:add') ? setModal({ type: "staff", data: u }) : notify("Access denied", "err")} 
                  onDelete={(u) => can('staff:add') ? setConfirm({ 
                    msg: `Remove ${u.name}?`, 
                    sub: "They will lose access immediately.", 
                    fn: () => {
                      setStaff(p => p.filter(x => x.id !== u.id));
                      DB.removeFromRegistry(u.email);
                    } 
                  }) : notify("Access denied", "err")} 
                  dark={dark} 
                />
              )}
              {page === "plans" && (
                <PlansPage 
                  plans={plans} role={curUser.role} 
                  onAdd={() => can('plan:add') ? setModal({ type: "plan" }) : notify("Access denied", "err")} 
                  onEdit={(p) => can('plan:add') ? setModal({ type: "plan", data: p }) : notify("Access denied", "err")} 
                  onDelete={(p) => can('plan:add') ? setConfirm({ msg: `Delete plan "${p.name}"?`, sub: "Members on this plan won't be affected.", fn: () => setPlans(prev => prev.filter(x => x.id !== p.id)) }) : notify("Access denied", "err")} 
                  dark={dark} 
                />
              )}
              {page === "payments" && (
                <PaymentsPage 
                  payments={payments} role={curUser.role} 
                  onAdd={() => can('payment:add') ? setModal({ type: "payment" }) : notify("Access denied", "err")} 
                  dark={dark} gymName={gymName}
                />
              )}
              {page === "settings" && (
                <SettingsPage 
                  permissions={permissions} 
                  onUpdate={setPermissions} 
                  dark={dark} 
                />
              )}
              {page === "reports" && (
                <ReportsPage 
                  members={members} payments={payments} 
                  staff={staff} plans={plans} 
                  role={curUser.role} dark={dark} 
                />
              )}
              {page === "alerts" && (
                <AlertsPage 
                  members={members} payments={payments} 
                  role={curUser.role} dark={dark} 
                />
              )}
              {page === "checkin" && (
                <div className="space-y-4">
                  <div className={`p-6 rounded-2xl border ${dark ? "bg-[#13131e] border-white/5" : "bg-white border-black/5 shadow-sm"}`}>
                    <p className="text-sm font-bold mb-4">Quick Check-In</p>
                    <select 
                      className={SS(dark)} 
                      onChange={(e) => {
                        const m = members.find(x => x.id === e.target.value);
                        if (m) {
                          const todayAtt = attendance.filter(a => a.memberId === m.id && a.date === toDay());
                          const lastAtt = todayAtt[0]; // attendance is sorted newest first
                          if (lastAtt && !lastAtt.checkOutTime) {
                            notify(`${m.name} already checked in`, 'warn');
                            return;
                          }
                          setAttendance(p => [{ id: uid(), memberId: m.id, memberName: m.name, date: toDay(), time: new Date().toISOString() }, ...p]);
                          notify(`${m.name} checked in`);
                        }
                      }}
                    >
                      <option value="">Select Member...</option>
                      {members
                        .filter(m => {
                          const todayAtt = attendance.filter(a => a.memberId === m.id && a.date === toDay());
                          const lastAtt = todayAtt[0];
                          return !lastAtt || !!lastAtt.checkOutTime;
                        })
                        .map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                  </div>

                  <div className={`p-6 rounded-2xl border ${dark ? "bg-[#13131e] border-white/5" : "bg-white border-black/5 shadow-sm"}`}>
                    <p className="text-sm font-bold mb-4">Currently Checked-In</p>
                    <div className="space-y-3">
                      {attendance
                        .filter(a => a.date === toDay() && !a.checkOutTime)
                        .length === 0 ? (
                          <p className="text-xs text-gray-500 text-center py-4">No members currently in the gym.</p>
                        ) : (
                          attendance
                            .filter(a => a.date === toDay() && !a.checkOutTime)
                            .map(a => (
                              <div key={a.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                <div>
                                  <p className="text-sm font-bold">{a.memberName}</p>
                                  <p className="text-[10px] text-gray-500">In: {new Date(a.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                                <button 
                                  onClick={() => {
                                    setAttendance(prev => prev.map(x => x.id === a.id ? { ...x, checkOutTime: new Date().toISOString() } : x));
                                    notify(`${a.memberName} checked out`);
                                  }}
                                  className="px-3 py-1.5 bg-red-500/10 text-red-500 text-[10px] font-bold rounded-lg hover:bg-red-500 hover:text-white transition-all"
                                >
                                  Check-out
                                </button>
                              </div>
                            ))
                        )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
      {confirm && <Confirm msg={confirm.msg} sub={confirm.sub} onOk={confirm.fn} onCancel={() => setConfirm(null)} />}
      
      {modal?.type === "member" && (
        <MemberModal 
          data={modal.data} plans={plans} dark={dark} 
          onClose={() => setModal(null)} 
          onSave={(m: any) => {
            if (modal.data) setMembers(p => p.map(x => x.id === m.id ? m : x));
            else setMembers(p => [m, ...p]);
            setModal(null);
            notify(modal.data ? "Member updated" : "Member added");
          }} 
        />
      )}

      {modal?.type === "staff" && (
        <StaffModal 
          data={modal.data} dark={dark} 
          onClose={() => setModal(null)} 
          onSave={(s: any) => {
            if (modal.data) setStaff(p => p.map(x => x.id === s.id ? s : x));
            else setStaff(p => [s, ...p]);
            // Sync to registry for login
            DB.saveToRegistry(s.email, { 
              password: s.password, 
              role: s.role, 
              gymName: gymName, 
              name: s.name 
            });
            setModal(null);
            notify(modal.data ? "Staff updated" : "Staff added");
          }} 
        />
      )}

      {modal?.type === "plan" && (
        <PlanModal 
          data={modal.data} dark={dark} 
          onClose={() => setModal(null)} 
          onSave={(p: any) => {
            if (modal.data) setPlans(prev => prev.map(x => x.id === p.id ? p : x));
            else setPlans(prev => [...prev, p]);
            setModal(null);
            notify(modal.data ? "Plan updated" : "Plan added");
          }} 
        />
      )}

      {modal?.type === "payment" && (
        <PaymentModal 
          members={members} dark={dark} 
          onClose={() => setModal(null)} 
          onSave={(p: any) => {
            setPayments(prev => [p, ...prev]);
            setModal(null);
            notify("Payment recorded");
          }} 
        />
      )}
    </div>
  );
}

// ── MODAL COMPONENTS ───────────────────────────────────────

const MemberModal = ({ data: init, plans, dark, onSave, onClose }: any) => {
  const [f, setF] = useState(init || { name: "", phone: "", email: "", planId: plans[0]?.id || "", trainer: TRAINERS[0], startDate: toDay(), endDate: "", paymentStatus: "Paid", status: "Active", dob: "", notes: "" });
  const [errs, setErrs] = useState<any>({});
  
  const sel = plans.find((p: any) => p.id === f.planId);
  
  useEffect(() => {
    if (f.startDate && sel) {
      const d = new Date(f.startDate);
      d.setMonth(d.getMonth() + Number(sel.duration));
      setF((p: any) => ({ ...p, endDate: d.toISOString().slice(0, 10) }));
    }
  }, [f.startDate, f.planId, sel]);

  const save = () => {
    const e: any = {};
    if (!f.name.trim()) e.name = "Name required";
    if (!f.phone.trim()) e.phone = "Phone required";
    if (Object.keys(e).length) return setErrs(e);
    onSave({ ...f, id: init?.id || uid(), planName: sel?.name || "", planPrice: sel?.price || 0 });
  };

  return (
    <Modal title={init ? "Edit Member" : "Add Member"} onClose={onClose}>
      <Fld label="Full Name *" err={errs.name}><input value={f.name} onChange={e => setF({ ...f, name: e.target.value })} className={IS(errs.name, dark)} placeholder="Member name" /></Fld>
      <div className="grid grid-cols-2 gap-3">
        <Fld label="Phone *" err={errs.phone}><input value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} className={IS(errs.phone, dark)} placeholder="98xxxxxxxx" /></Fld>
        <Fld label="Email"><input value={f.email} onChange={e => setF({ ...f, email: e.target.value })} className={IS(null, dark)} placeholder="email@gmail.com" /></Fld>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Fld label="Plan"><select value={f.planId} onChange={e => setF({ ...f, planId: e.target.value })} className={SS(dark)}>{plans.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></Fld>
        <Fld label="Trainer"><select value={f.trainer} onChange={e => setF({ ...f, trainer: e.target.value })} className={SS(dark)}>{TRAINERS.map(t => <option key={t} value={t}>{t}</option>)}</select></Fld>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Fld label="Start Date"><input type="date" value={f.startDate} onChange={e => setF({ ...f, startDate: e.target.value })} className={IS(null, dark)} /></Fld>
        <Fld label="End Date"><input type="date" value={f.endDate} readOnly className={`${IS(null, dark)} opacity-50`} /></Fld>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Fld label="Payment"><select value={f.paymentStatus} onChange={e => setF({ ...f, paymentStatus: e.target.value as any })} className={SS(dark)}><option value="Paid">Paid</option><option value="Pending">Pending</option></select></Fld>
        <Fld label="Status"><select value={f.status} onChange={e => setF({ ...f, status: e.target.value as any })} className={SS(dark)}><option value="Active">Active</option><option value="Inactive">Inactive</option></select></Fld>
      </div>
      <button onClick={save} className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl mt-4">{init ? "Update Member" : "Add Member"}</button>
    </Modal>
  );
};

const StaffModal = ({ data: init, dark, onSave, onClose }: any) => {
  const [f, setF] = useState(init || { name: "", email: "", phone: "", role: "receptionist", salary: "", joinDate: toDay(), password: "" });
  const [errs, setErrs] = useState<any>({});

  const save = () => {
    const e: any = {};
    if (!f.name.trim()) e.name = "Name required";
    if (!f.email.trim()) e.email = "Email required";
    if (!f.salary) e.salary = "Salary required";
    if (Object.keys(e).length) return setErrs(e);
    onSave({ ...f, id: init?.id || uid(), salary: Number(f.salary) });
  };

  return (
    <Modal title={init ? "Edit Staff" : "Add Staff"} onClose={onClose}>
      <Fld label="Full Name *" err={errs.name}><input value={f.name} onChange={e => setF({ ...f, name: e.target.value })} className={IS(errs.name, dark)} placeholder="Staff name" /></Fld>
      <div className="grid grid-cols-2 gap-3">
        <Fld label="Email *" err={errs.email}><input value={f.email} onChange={e => setF({ ...f, email: e.target.value })} className={IS(errs.email, dark)} placeholder="name@gmail.com" /></Fld>
        <Fld label="Phone"><input value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} className={IS(null, dark)} placeholder="98xxxxxxxx" /></Fld>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Fld label="Role"><select value={f.role} onChange={e => setF({ ...f, role: e.target.value as any })} className={SS(dark)}><option value="receptionist">Receptionist</option><option value="trainer">Trainer</option></select></Fld>
        <Fld label="Monthly Salary *" err={errs.salary}><input type="number" value={f.salary} onChange={e => setF({ ...f, salary: e.target.value })} className={IS(errs.salary, dark)} placeholder="15000" /></Fld>
      </div>
      <Fld label="Login Password"><input type="password" value={f.password} onChange={e => setF({ ...f, password: e.target.value })} className={IS(null, dark)} placeholder="••••••••" /></Fld>
      <button onClick={save} className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl mt-4">{init ? "Update Staff" : "Add Staff"}</button>
    </Modal>
  );
};

const PlanModal = ({ data: init, dark, onSave, onClose }: any) => {
  const [f, setF] = useState(init || { name: "", duration: 1, price: "", description: "" });
  const [errs, setErrs] = useState<any>({});

  const save = () => {
    const e: any = {};
    if (!f.name.trim()) e.name = "Name required";
    if (!f.price) e.price = "Price required";
    if (Object.keys(e).length) return setErrs(e);
    onSave({ ...f, id: init?.id || uid(), price: Number(f.price), duration: Number(f.duration) });
  };

  return (
    <Modal title={init ? "Edit Plan" : "New Plan"} onClose={onClose}>
      <Fld label="Plan Name *" err={errs.name}><input value={f.name} onChange={e => setF({ ...f, name: e.target.value })} className={IS(errs.name, dark)} placeholder="Monthly Basic" /></Fld>
      <div className="grid grid-cols-2 gap-3">
        <Fld label="Duration (Months)"><select value={f.duration} onChange={e => setF({ ...f, duration: e.target.value })} className={SS(dark)}>{[1, 3, 6, 12].map(d => <option key={d} value={d}>{d} Month{d > 1 ? "s" : ""}</option>)}</select></Fld>
        <Fld label="Price (₹) *" err={errs.price}><input type="number" value={f.price} onChange={e => setF({ ...f, price: e.target.value })} className={IS(errs.price, dark)} placeholder="999" /></Fld>
      </div>
      <Fld label="Description"><textarea value={f.description} onChange={e => setF({ ...f, description: e.target.value })} className={`${IS(null, dark)} resize-none`} rows={2} placeholder="Description..." /></Fld>
      <button onClick={save} className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl mt-4">{init ? "Update Plan" : "Create Plan"}</button>
    </Modal>
  );
};

const PaymentModal = ({ members, dark, onSave, onClose }: any) => {
  const [f, setF] = useState({ memberId: members[0]?.id || "", amount: "", method: "Cash", date: toDay(), status: "Paid" });
  const [errs, setErrs] = useState<any>({});

  const save = () => {
    const e: any = {};
    if (!f.amount) e.amount = "Amount required";
    if (Object.keys(e).length) return setErrs(e);
    const m = members.find((x: any) => x.id === f.memberId);
    onSave({ ...f, id: uid(), memberName: m?.name || "", planName: m?.planName || "", amount: Number(f.amount) });
  };

  return (
    <Modal title="Record Payment" onClose={onClose}>
      <Fld label="Member"><select value={f.memberId} onChange={e => setF({ ...f, memberId: e.target.value })} className={SS(dark)}>{members.map((m: any) => <option key={m.id} value={m.id}>{m.name}</option>)}</select></Fld>
      <div className="grid grid-cols-2 gap-3">
        <Fld label="Amount (₹) *" err={errs.amount}><input type="number" value={f.amount} onChange={e => setF({ ...f, amount: e.target.value })} className={IS(errs.amount, dark)} placeholder="0" /></Fld>
        <Fld label="Method"><select value={f.method} onChange={e => setF({ ...f, method: e.target.value })} className={SS(dark)}>{PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}</select></Fld>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Fld label="Date"><input type="date" value={f.date} onChange={e => setF({ ...f, date: e.target.value })} className={IS(null, dark)} /></Fld>
        <Fld label="Status"><select value={f.status} onChange={e => setF({ ...f, status: e.target.value as any })} className={SS(dark)}><option value="Paid">Paid</option><option value="Pending">Pending</option></select></Fld>
      </div>
      <button onClick={save} className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl mt-4">Record Payment</button>
    </Modal>
  );
};
