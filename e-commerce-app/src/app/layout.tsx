// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "./../components/shared/AuthProvider"; 
import { CartProvider } from "./../context/CartContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NextShop | Premium E-commerce",
  description: "Built with Next.js, MongoDB, and Tailwind CSS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            {/* REMOVED Navbar from here to prevent duplication */}
            <Toaster position="bottom-right" />
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}