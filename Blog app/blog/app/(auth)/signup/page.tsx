"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "READER",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      alert(data.message);
      router.push("/login");
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 px-4">
      
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-gray-200">
        
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Create Account
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Join and start exploring articles
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <Input
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="John Doe"
          />

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

          {/* Role Selection */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Select Role
            </label>

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="READER">Reader</option>
              <option value="AUTHOR">Author</option>
            </select>
          </div>

          {/* Button */}
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Signup"}
          </Button>
        </div>

        {/* Footer */}
        <p className="text-sm text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}