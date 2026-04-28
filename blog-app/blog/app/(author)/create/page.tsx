"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function CreateArticle() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const handleSubmit = async () => {
    const res = await fetch("/api/articles", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });

    const data = await res.json();

    if (res.ok) {
      router.push("/author/dashboard");
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto flex flex-col gap-4">
      <h1 className="text-xl font-bold">Create Article</h1>

      <Input
        label="Title"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="border rounded-xl p-3"
        rows={8}
        placeholder="Write your content..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <Button onClick={handleSubmit}>Publish</Button>
    </div>
  );
}