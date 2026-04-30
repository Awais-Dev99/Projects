import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-xl font-black text-blue-600 tracking-tighter">
              BLOG<span className="text-slate-900">OS</span>
            </Link>
            <p className="mt-4 text-slate-500 max-w-sm leading-relaxed">
              A modern platform for thinkers, writers, and readers. 
              Join our community to share stories that matter.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">
              Platform
            </h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-slate-500 hover:text-blue-600 transition text-sm">Browse Stories</Link></li>
              <li><Link href="/register" className="text-slate-500 hover:text-blue-600 transition text-sm">Become an Author</Link></li>
              <li><Link href="/login" className="text-slate-500 hover:text-blue-600 transition text-sm">Sign In</Link></li>
            </ul>
          </div>

          {/* Legal/Support */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">
              Support
            </h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-500 hover:text-blue-600 transition text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-500 hover:text-blue-600 transition text-sm">Terms of Service</a></li>
              <li><a href="#" className="text-slate-500 hover:text-blue-600 transition text-sm">Contact Us</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-xs">
            © {new Date().getFullYear()} BlogOS. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-slate-900 transition">
              <span className="sr-only">Twitter</span>
              {/* Replace with actual Icon if using Lucide or Heroicons */}
              <p className="text-xs font-bold uppercase tracking-tighter">Twitter</p>
            </a>
            <a href="#" className="text-slate-400 hover:text-slate-900 transition">
              <span className="sr-only">GitHub</span>
              <p className="text-xs font-bold uppercase tracking-tighter">GitHub</p>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}