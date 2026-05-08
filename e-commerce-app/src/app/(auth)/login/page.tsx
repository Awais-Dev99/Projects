"use client";

import { Button } from "./../../../components/ui/Button";
import { Input } from "./../../../components/ui/Input";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex flex-col space-y-6 w-full max-w-md p-18 justify-self-center mt-18 bg-white rounded-2xl shadow-xl">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold italic text-blue-600">Welcome Back</h1>
        <p className="text-gray-500 text-sm">Enter your credentials to access your account</p>
      </div>
      <form className="space-y-4">
        <Input type="email" placeholder="email@example.com" required />
        <Input type="password" placeholder="••••••••" required />
        <Button className="w-full">Sign In</Button>
      </form>
      <p className="text-center text-sm text-gray-600">
        Don&apos;t have an account? <Link href="/signup" className="text-blue-600 font-bold">Sign Up</Link>
      </p>
    </div>
  );
}