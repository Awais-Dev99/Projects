import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import HomeClient from "@/components/HomeClient";


export default async function HomePage() {
  await connectDB();
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  const rawPosts = await Post.find({ status: "published" })
    .populate("author", "name")
    .sort({ createdAt: -1 })
    .lean();

  const posts = JSON.parse(JSON.stringify(rawPosts));

  return (
    
    /* 
       md:h-screen: Only lock the height on medium screens (tablets/laptops) and up.
       This allows mobile users to use the natural browser bounce/scroll if needed.
    */
    <div className="flex flex-col h-screen md:h-screen overflow-hidden bg-white">
      
      {/* Content Wrapper */}
      <div className="flex flex-1 overflow-hidden relative">
        <HomeClient posts={posts} userId={userId} />
      </div>
    </div>
  );
}