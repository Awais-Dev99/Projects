// app/page.tsx
import { ShieldCheck, Lock, User } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      {/* Brand Identity */}
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center shadow-xl shadow-blue-200 mb-4">
          <ShieldCheck className="text-white" size={32} />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">EMS PORTAL</h1>
        <p className="text-slate-500 text-sm font-medium">Employee Management System</p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100 p-8 md:p-10">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-800">Welcome Back</h2>
          <p className="text-slate-400 text-sm">Please enter the credentials provided by Admin.</p>
        </div>

        <form className="space-y-6">
          {/* Username Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
              Username
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <User size={18} />
              </span>
              <input 
                type="text" 
                placeholder="e.g. guard_01"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-medium"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
              Secret Password
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock size={18} />
              </span>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-medium"
                required
              />
            </div>
          </div>

          {/* Login Button */}
          <button 
            type="submit" 
            className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-blue-600 active:scale-[0.98] transition-all shadow-lg shadow-slate-200"
          >
            Log In to Dashboard
          </button>
        </form>

       
        
      </div>

      {/* Footer Info */}
      <p className="mt-8 text-slate-400 text-xs text-center max-w-[250px] leading-relaxed">
        Forgot your password? <br />
        Please contact your <strong>HR Manager</strong> for a credential reset.
      </p>
    </div>
  );
}