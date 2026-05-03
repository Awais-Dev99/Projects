"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "reader", // Default role
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        if (formData.role === "author") {
          router.push("/login?message=pending");
        } else {
          router.push("/login");
        }
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* 
       FORCE CENTER: Uses fixed inset-0 to stay centered even 
       if the parent layout tries to push it to the side.
    */
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-50 px-4 overflow-y-auto py-10">
      
      <div className="w-full max-w-md bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-gray-100 transition-all">
        
        {/* Branding */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-black text-blue-600 tracking-tighter">
            BLOG<span className="text-gray-900">OS</span>
          </Link>
          <p className="text-gray-400 text-sm mt-2 font-medium">Join our community today</p>
        </div>

        <h2 className="text-3xl font-black text-gray-900 text-center mb-8 tracking-tight">Create Account</h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm border border-red-100 font-semibold flex items-center gap-3 animate-shake">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-2">Full Name</label>
            <input
              type="text"
              required
              placeholder="John Doe"
              className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-gray-50/50 focus:bg-white"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-2">Email Address</label>
            <input
              type="email"
              required
              placeholder="john@example.com"
              className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-gray-50/50 focus:bg-white"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-2">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-gray-50/50 focus:bg-white"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 ml-2">Join as a:</label>
            <select
              className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-gray-50/50 focus:bg-white appearance-none cursor-pointer"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="reader">Reader (Instant Access)</option>
              <option value="author">Author (Requires Approval)</option>
            </select>
          </div>

          <button
            disabled={loading}
            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl active:scale-[0.98] disabled:bg-gray-400 mt-4"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
            ) : "Sign Up"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400 font-medium">
          Already have an account? <Link href="/login" className="text-blue-600 font-black hover:underline underline-offset-4">Login</Link>
        </p>
      </div>

      {/* Footer link for mobile ease */}
      <div className="mt-8">
         <Link href="/" className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest">
           ← Back to Home
         </Link>
      </div>
    </div>
  );
}