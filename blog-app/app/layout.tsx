import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import "./globals.css"; // Ensure the path is correct

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50">
        <Providers>
          <Navbar />
          <main className="max-w-7xl mx-auto py-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}