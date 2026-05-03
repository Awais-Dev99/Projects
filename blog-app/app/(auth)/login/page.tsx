"use client";

import { signIn, getSession } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false, 
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      const session = await getSession();
      const role = (session?.user as any)?.role;

      if (role === "admin") {
        router.push("/admin/dashboard");
      } else if (role === "author") {
        router.push("/author/dashboard");
      } else if (role === "reader") {
        router.push("/reader/dashboard");
      } else {
        router.push("/");
      }
      
      router.refresh();
    }
  };

  return (
    /* 
       min-h-screen: Ensures it takes the full vertical view.
       items-center justify-center: Centers the box perfectly.
       bg-slate-50: Matches your layout.tsx background.
    */
   <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-50 px-4">
      
      {/* 
          - max-w-md: Limits width on laptops/desktops.
          - w-full: Takes full width on mobile (minus the padding).
          - p-6 md:p-10: More compact padding on phones, spacious on laptops.
      */}
      <div className="w-full max-w-md bg-white p-6 md:p-10 rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-gray-100 transition-all">
        
        {/* LOGO AREA (Optional but recommended for branding) */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-black text-blue-600 tracking-tighter">
            BLOG<span className="text-gray-900">OS</span>
          </Link>
          <p className="text-gray-400 text-sm mt-2 font-medium">Welcome back to your dashboard</p>
        </div>

        <h2 className="text-2xl md:text-3xl font-black text-gray-900 text-center mb-6 tracking-tight">Login</h2>

        {message === "pending" && (
          <div className="bg-amber-50 text-amber-700 p-4 rounded-2xl mb-6 text-sm border border-amber-100 flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>Account created! Please wait for Admin approval before logging in.</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm border border-red-100 font-semibold flex items-center gap-3">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="group">
            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-gray-50/50 focus:bg-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="group">
            <input
              type="password"
              placeholder="Password"
              className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-gray-50/50 focus:bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button
            disabled={loading}
            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-[0.98] disabled:bg-gray-400 disabled:shadow-none mt-4"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Authenticating...
              </span>
            ) : "Login"}
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-gray-400 font-medium">
          New here? <Link href="/register" className="text-blue-600 font-black hover:underline underline-offset-4">Create an account</Link>
        </p>
      </div>

      {/* Footer link for mobile ease */}
      <div className="mt-8">
         <Link href="/" className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest">
           ← Back to Articles
         </Link>
      </div>
    </div>
  );
}