import Link from "next/link";

export default function Unauthorized() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
      <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 className="text-4xl font-black text-slate-900 mb-4">Access Denied</h1>
      <p className="text-slate-500 max-w-md mb-8">
        You don't have the permissions to view this page. If you are a new Author, your account might still be pending approval.
      </p>
      <Link href="/" className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-black transition">
        Back to Home
      </Link>
    </div>
  );
}