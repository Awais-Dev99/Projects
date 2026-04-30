import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { approveAuthor, rejectAuthor } from "@/lib/actions";

export default async function AdminDashboard() {
  await connectDB();

  const pendingUsers = await User.find({ role: "author", status: "pending" }).sort({ createdAt: -1 });
  const approvedAuthors = await User.find({ role: "author", status: "approved" }).sort({ createdAt: -1 });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12">
      <h1 className="text-3xl font-black text-gray-900 tracking-tight">Admin Dashboard</h1>

      {/* --- SECTION 1: PENDING REQUESTS --- */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl font-bold text-gray-800">Pending Author Requests</h2>
          <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-bold">
            {pendingUsers.length}
          </span>
        </div>
        
        {pendingUsers.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed rounded-2xl p-10 text-center text-gray-400">
            No new requests to show.
          </div>
        ) : (
          <div className="grid gap-4">
            {pendingUsers.map((user) => (
              <div key={user._id.toString()} className="border p-5 rounded-2xl flex items-center justify-between bg-white shadow-sm hover:shadow-md transition">
                <div>
                  <p className="font-bold text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="flex gap-2">
                  <form action={approveAuthor}>
                    <input type="hidden" name="id" value={user._id.toString()} />
                    <button type="submit" className="bg-green-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-green-700 transition">
                      Approve
                    </button>
                  </form>

                  <form action={rejectAuthor}>
                    <input type="hidden" name="id" value={user._id.toString()} />
                    <button type="submit" className="bg-white text-red-600 border border-red-100 px-5 py-2 rounded-xl text-sm font-bold hover:bg-red-50 transition">
                      Reject
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- SECTION 2: APPROVED AUTHORS RECORD --- */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl font-bold text-gray-800">Approved Authors</h2>
          <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-bold">
            {approvedAuthors.length}
          </span>
        </div>

        {approvedAuthors.length === 0 ? (
          <p className="text-gray-400 italic">No approved authors yet.</p>
        ) : (
          <div className="overflow-hidden bg-white border border-gray-100 rounded-2xl shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-4 text-sm font-bold text-gray-600">Name</th>
                  <th className="p-4 text-sm font-bold text-gray-600">Email</th>
                  <th className="p-4 text-sm font-bold text-gray-600">Status</th>
                  <th className="p-4 text-sm font-bold text-gray-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {approvedAuthors.map((author) => (
                  <tr key={author._id.toString()} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition">
                    <td className="p-4 font-medium text-gray-900">{author.name}</td>
                    <td className="p-4 text-sm text-gray-500">{author.email}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        Active
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {/* Optional: Add a Revoke/Delete button if you want to remove an author later */}
                      <form action={rejectAuthor}>
                        <input type="hidden" name="id" value={author._id.toString()} />
                        <button className="text-xs font-bold text-red-400 hover:text-red-600 transition">
                          Remove Author
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}