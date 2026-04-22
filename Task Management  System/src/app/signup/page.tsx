"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
  const errors = data.error?.fieldErrors;

  if (errors) {
    const firstError =
      errors.password?.[0] ||
      errors.email?.[0] ||
      errors.name?.[0];

    alert(firstError || "Validation error");
  } else {
    alert("Something went wrong");
  }

  return;
}

      alert("Signup successful! Please login.");
      router.push("/login");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-80"
      >
        <h2 className="text-xl font-semibold mb-4">Signup</h2>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter Your User Name"
          className="border p-2 rounded-lg w-full mb-3"
          required
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="border p-2 rounded-lg w-full mb-3"
          required
        />

        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="border p-2 rounded-lg w-full mb-3"
          required
        />

        <button className="w-full bg-blue-500 text-white py-2 rounded-lg">
          Signup
        </button>

        <p className="text-sm mt-3 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}