import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="bg-white h-screen overflow-hidden flex flex-col">
        <Providers>
          {/* 1. Navbar stays at the very top */}
          <Navbar />
          
          {/* 2. Main wrapper must be full width (w-full) with NO max-width */}
          <main className="flex-1 flex overflow-hidden w-full">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}