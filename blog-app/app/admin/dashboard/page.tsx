import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import AdminActionButton from "@/components/AdminActionButton";

export default async function AdminDashboard() {
  await connectDB();

  const pendingUsers = await User.find({ role: "author", status: "pending" }).sort({ createdAt: -1 });
  const approvedAuthors = await User.find({ role: "author", status: "approved" }).sort({ createdAt: -1 });

  return (
    /* Max-width 7xl and xl:p-12 ensures it looks great on large LED screens */
    <div className="p-4 sm:p-8 md:p-10 xl:p-12 max-w-7xl mx-auto space-y-10 md:space-y-16">
      <header>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 text-sm md:text-base mt-2">Manage author requests and active accounts.</p>
      </header>

      {/* --- PENDING REQUESTS --- */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-800">Pending Author Requests</h2>
          <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs md:text-sm font-bold">
            {pendingUsers.length}
          </span>
        </div>
        
        {pendingUsers.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed rounded-2xl p-6 md:p-12 text-center text-gray-400">
            No new requests to show.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {pendingUsers.map((user) => (
              <div key={user._id.toString()} className="border p-5 rounded-2xl flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-start justify-between bg-white shadow-sm hover:shadow-md transition gap-4">
                <div className="overflow-hidden w-full">
                  <p className="font-bold text-gray-900 truncate">{user.name}</p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto md:w-full">
                  <div className="flex-1">
                    <AdminActionButton id={user._id.toString()} type="approve" />
                  </div>
                  <div className="flex-1">
                    <AdminActionButton id={user._id.toString()} type="reject" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- APPROVED AUTHORS --- */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-800">Approved Authors</h2>
          <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs md:text-sm font-bold">
            {approvedAuthors.length}
          </span>
        </div>

        {approvedAuthors.length === 0 ? (
          <p className="text-gray-400 italic text-center md:text-left">No approved authors yet.</p>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            {/* Mobile/Tablet Card View - Hidden on Laptops */}
            <div className="block lg:hidden divide-y divide-gray-100">
              {approvedAuthors.map((author) => (
                <div key={author._id.toString()} className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-900">{author.name}</p>
                      <p className="text-sm text-gray-500">{author.email}</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                      Active
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-50 flex justify-end">
                    <AdminActionButton id={author._id.toString()} type="reject" />
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop/LED Table View - Hidden on Mobile/Tablet */}
            <div className="hidden lg:block overflow-x-auto">
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
                        <AdminActionButton id={author._id.toString()} type="reject" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}