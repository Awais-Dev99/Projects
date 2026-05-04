import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import EditForm from "@/components/EditForm";

export default async function EditArticlePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // 1. Await parameters as per Next.js 15 requirement
  const { id } = await params;

  await connectDB();
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  const post = await Post.findById(id);
  
  // Security check: ensure post exists and requester is the author
  if (!post || post.author.toString() !== userId) {
    redirect("/author/dashboard");
  }

  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
      <nav className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="w-full px-6 md:px-12 py-5 flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <Link href="/author/dashboard" className="text-slate-400 hover:text-slate-900 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
              Editing Draft
            </span>
          </div>
          <div className="text-xs font-medium text-slate-300 hidden sm:block">
            Saved to Cloud
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto w-full px-6 pt-16 pb-40">
         {/* Pass serialized data to Client Component */}
         <EditForm post={JSON.parse(JSON.stringify(post))} />
      </main>
    </div>
  );
}