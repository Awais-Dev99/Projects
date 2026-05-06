// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "../components/Providers"; // Import the new component

export const metadata: Metadata = {
  title: "EMS | Employee Management System",
  description: "Secure Admin & Employee Portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">
        {/* The Providers wrapper allows NextAuth to track the login status */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}