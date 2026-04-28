"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";

type User = {
  _id: string;
  name: string;
  email: string;
};

export default function OwnerDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch pending authors
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Not authenticated");
        return;
      }

      const res = await fetch("/api/users/pending", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      console.log("API RESPONSE:", data); // ✅ debug

      if (res.ok) {
        setUsers(data.users || []);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("FETCH ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Approve user
  const handleApprove = async (id: string) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`/api/users/approve/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchUsers(); // refresh list
    } catch (error) {
      console.error("APPROVE ERROR:", error);
    }
  };

  // ❌ Reject user
  const handleReject = async (id: string) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`/api/users/reject/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchUsers(); // refresh list
    } catch (error) {
      console.error("REJECT ERROR:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Pending Author Requests
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : users.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        <div className="flex flex-col gap-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="border p-4 rounded-xl flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">
                  {user.email}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="primary"
                  onClick={() => handleApprove(user._id)}
                >
                  Approve
                </Button>

                <Button
                  variant="danger"
                  onClick={() => handleReject(user._id)}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}