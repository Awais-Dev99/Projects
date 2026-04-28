"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full flex justify-between items-center px-6 py-4 border-b">
      <h1 className="text-xl font-bold">My Blog</h1>

      <div className="flex gap-4">
        <Link href="/">Home</Link>
        <Link href="/login">Login</Link>
        <Link href="/signup">Signup</Link>
      </div>
    </nav>
  );
}