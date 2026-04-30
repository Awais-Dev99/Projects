"use client";

import { signIn, getSession } from "next-auth/react"; // 1. Import getSession
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
      // 2. Fetch the updated session to see the user's role
      const session = await getSession();
      const role = (session?.user as any)?.role; // Casting to 'any' bypasses the TS error

      // 3. Conditional redirection logic
      if (role === "admin") {
        router.push("/admin/dashboard");
      } else if (role === "author") {
        router.push("/author/dashboard");
      } else if (role === "reader") {
        router.push("/reader/dashboard"); // Or wherever readers go
      } else {
        router.push("/"); // Fallback
      }
      
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-black text-gray-900 text-center mb-6 tracking-tight">Login</h2>

        {message === "pending" && (
          <div className="bg-amber-50 text-amber-700 p-3 rounded-lg mb-4 text-sm border border-amber-100">
            Account created! Please wait for Admin approval before logging in.
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-100 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            disabled={loading}
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition shadow-lg disabled:bg-gray-400"
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          New here? <Link href="/register" className="text-blue-600 font-bold hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}