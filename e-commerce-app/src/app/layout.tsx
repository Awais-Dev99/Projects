import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// We will create this Provider component next to wrap the app in NextAuth sessions
import AuthProvider from "./../components/shared/AuthProvider"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NextShop | Premium E-commerce",
  description: "Built with Next.js, MongoDB, and Tailwind CSS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}