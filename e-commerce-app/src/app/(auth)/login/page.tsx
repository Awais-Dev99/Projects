"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./../../../components/ui/Button";
import { Input } from "./../../../components/ui/Input";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Loader2, Lock, Mail } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Get callback URL from query params
  const callbackUrl = searchParams.get('callback') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // The 'credentials' ID must match the provider ID in your [...nextauth]/route.ts
      const res = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false, // Prevents automatic reload so we can handle errors
      });

      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Welcome back!");
        router.push(callbackUrl); // Redirect to callback URL or home
        router.refresh();
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600 text-sm md:text-base">Sign in to your account to continue shopping</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="pl-12 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input 
                type="password" 
                placeholder="Enter your password" 
                className="pl-12 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required 
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base transition-all duration-200 shadow-lg hover:shadow-xl" 
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={20} />
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
<Button 
            onClick={()=>router.push("/")} 
            className="mt-7 w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base transition-all duration-200 shadow-lg hover:shadow-xl" 
            > Home Screen
          </Button>
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}