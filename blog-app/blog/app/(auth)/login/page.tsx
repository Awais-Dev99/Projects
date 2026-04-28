"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // ✅ important fix
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.error);
      return;
    }

    localStorage.setItem("token", data.token);

    if (data.role === "OWNER") {
      router.push("/owner/dashboard");
    } else if (data.role === "AUTHOR") {
      router.push("/author/dashboard");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 px-4">
      
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-gray-200">
        
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome Back 👋
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Login to continue to your account
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <Input
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
          />

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </div>

        {/* Footer */}
        <p className="text-sm text-center text-gray-500 mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
}