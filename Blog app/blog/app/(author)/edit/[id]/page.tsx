"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function EditArticle() {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  // 🔹 Fetch article
  useEffect(() => {
    const fetchArticle = async () => {
      const res = await fetch(`/api/articles/${id}`);
      const data = await res.json();

      setTitle(data.article.title);
      setContent(data.article.content);
    };

    fetchArticle();
  }, [id]);

  const handleUpdate = async () => {
    const res = await fetch(`/api/articles/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });

    if (res.ok) {
      router.push("/author/dashboard");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto flex flex-col gap-4">
      <h1 className="text-xl font-bold">Edit Article</h1>

      <Input
        label="Title"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="border rounded-xl p-3"
        rows={8}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <Button onClick={handleUpdate}>Update</Button>
    </div>
  );
}