import React from 'react';
import { User, Role } from '../types';
import { Mail, Lock, User as UserIcon, Shield } from 'lucide-react';

import { DB } from '../db';

interface LoginProps {
  onLogin: (u: User, gymName: string) => void;
  dark: boolean;
}

export const Login: React.FC<LoginProps> = ({ onLogin, dark }) => {
  const [tab, setTab] = React.useState<'login' | 'signup'>('login');
  const [form, setForm] = React.useState({ name: '', email: '', gymName: '', pass: '', cpass: '' });
  const [errs, setErrs] = React.useState<any>({});

  const handleLogin = async () => {
    const e: any = {};
    if (!form.email.trim()) e.email = "Email required";
    if (!form.pass.trim()) e.pass = "Password required";
    if (Object.keys(e).length) return setErrs(e);

    const email = form.email.toLowerCase().trim();
    
    // 1. Check default admin
    if (email === "admin@gmail.com" && form.pass === "admin") {
      onLogin({ id: "1", name: "Admin User", email, phone: "9876543210", role: "admin", joinDate: new Date().toISOString() }, "PowerFit Gym");
      return;
    }
    
    // 2. Check registry
    const reg = await DB.getRegistry();
    const found = reg[email];
    if (found && found.password === form.pass) {
      onLogin({ 
        id: Math.random().toString(36).slice(2), 
        name: found.name, 
        email, 
        phone: "", 
        role: found.role, 
        joinDate: new Date().toISOString() 
      }, found.gymName);
      return;
    }
    
    setErrs({ pass: "Invalid credentials. Check email or password." });
  };

  const handleSignup = async () => {
    const e: any = {};
    if (!form.name.trim()) e.name = "Name required";
    if (!form.gymName.trim()) e.gymName = "Gym name required";
    if (!form.email.trim()) e.email = "Email required";
    if (form.pass.length < 6) e.pass = "Min 6 chars";
    if (form.pass !== form.cpass) e.cpass = "Passwords mismatch";
    if (Object.keys(e).length) return setErrs(e);

    const email = form.email.toLowerCase().trim();
    const gym = form.gymName.trim();
    
    // Save to registry
    await DB.saveToRegistry(email, { 
      password: form.pass, 
      role: "admin", 
      gymName: gym, 
      name: form.name 
    });

    onLogin({ 
      id: Math.random().toString(36).slice(2), 
      name: form.name, 
      email, 
      phone: "", 
      role: "admin", 
      joinDate: new Date().toISOString() 
    }, gym);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0a0a0f] relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/10 rounded-full blur-[100px]" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-orange-500/20">
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-black text-orange-500 tracking-tighter">GymFlow</h1>
          <p className="text-gray-500 text-xs uppercase tracking-widest mt-2 font-bold">Professional Gym Management</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex bg-white/5 p-1 rounded-xl mb-8">
            <button onClick={() => setTab('login')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${tab === 'login' ? "bg-orange-500 text-white shadow-lg" : "text-gray-500"}`}>Sign In</button>
            <button onClick={() => setTab('signup')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${tab === 'signup' ? "bg-orange-500 text-white shadow-lg" : "text-gray-500"}`}>Sign Up</button>
          </div>

          <div className="space-y-4">
            {tab === 'signup' && (
              <>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5 ml-1">Full Name</label>
                  <div className="relative">
                    <UserIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white outline-none focus:border-orange-500 transition-colors" placeholder="John Doe" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5 ml-1">Gym Name</label>
                  <input value={form.gymName} onChange={e => setForm({ ...form, gymName: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-orange-500 transition-colors" placeholder="PowerFit Gym" />
                </div>
              </>
            )}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5 ml-1">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white outline-none focus:border-orange-500 transition-colors" placeholder="admin@gmail.com" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5 ml-1">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                <input type="password" value={form.pass} onChange={e => setForm({ ...form, pass: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white outline-none focus:border-orange-500 transition-colors" placeholder="••••••••" />
              </div>
              {errs.pass && <p className="text-red-500 text-[10px] mt-2 ml-1 font-medium">{errs.pass}</p>}
            </div>
            {tab === 'signup' && (
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5 ml-1">Confirm Password</label>
                <input type="password" value={form.cpass} onChange={e => setForm({ ...form, cpass: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-orange-500 transition-colors" placeholder="••••••••" />
              </div>
            )}
            
            <button onClick={tab === 'login' ? handleLogin : handleSignup} className="w-full bg-orange-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all transform active:scale-95 mt-4">
              {tab === 'login' ? "Sign In" : "Create Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
