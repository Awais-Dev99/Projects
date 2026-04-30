"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user as { name?: string; email?: string; role?: string } | undefined;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* LOGO */}
        <Link href="/" className="text-2xl font-black text-blue-600 tracking-tighter">
          BLOG<span className="text-gray-900">OS</span>
        </Link>

        <div className="flex items-center gap-6">
          {!session ? (
            // PUBLIC LINKS
            <div className="flex gap-4">
              <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-gray-900">Login</Link>
              <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition">Join</Link>
            </div>
          ) : (
            // LOGGED IN VIEW
            <>
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-gray-900">{user?.name}</span>
                <span className="text-[10px] uppercase tracking-widest text-blue-500 font-bold">{user?.role}</span>
              </div>

              {/* AUTHOR ONLY: Create Button */}
              {user?.role === "author" && (
                <Link 
                  href="/author/create" 
                  className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-black transition shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Create
                </Link>
              )}

              {/* LOGOUT BUTTON (All Roles) */}
              <button 
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}