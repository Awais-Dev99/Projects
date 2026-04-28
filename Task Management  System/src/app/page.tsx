"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirects to /login immediately upon landing
    router.push("/login");
  }, [router]);

  return null; // Returning null because the user won't stay here long
}