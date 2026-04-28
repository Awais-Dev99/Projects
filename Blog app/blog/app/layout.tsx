import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "My Blog App",
  description: "Full stack blog with roles",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Global Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}