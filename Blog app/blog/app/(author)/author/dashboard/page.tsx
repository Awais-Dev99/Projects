"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

type Article = {
  _id: string;
  title: string;
  content: string;
};

export default function AuthorDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const router = useRouter();

  const fetchArticles = async () => {
    const res = await fetch("/api/articles");
    const data = await res.json();
    setArticles(data.articles);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // ✅ LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("token"); // ❗ remove token
    router.push("/login"); // ❗ redirect to login
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");

    await fetch(`/api/articles/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchArticles();
  };

  return (
    <div className="p-6">
      {/* 🔥 HEADER */}
      <div className="flex justify-between mb-6 items-center">
        <h1 className="text-2xl font-bold">My Articles</h1>

        <div className="flex gap-2">
          <Button onClick={() => router.push("/author/create")}>
            Create Article
          </Button>

          {/* ✅ LOGOUT BUTTON */}
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      {/* ARTICLES */}
      <div className="flex flex-col gap-4">
        {articles.map((article) => (
          <div
            key={article._id}
            className="border p-4 rounded-xl flex justify-between"
          >
            <div>
              <h2 className="font-semibold">{article.title}</h2>
              <p className="text-sm text-gray-500">
                {article.content.slice(0, 80)}...
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() =>
                  router.push(`/author/edit/${article._id}`)
                }
              >
                Edit
              </Button>

              <Button
                variant="danger"
                onClick={() => handleDelete(article._id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}