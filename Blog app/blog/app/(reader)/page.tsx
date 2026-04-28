"use client";

import { useEffect, useState } from "react";
import ArticleCard from "@/components/ArticleCard";

type Article = {
  _id: string;
  title: string;
  content: string;
};

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const res = await fetch("/api/articles");
      const data = await res.json();
      setArticles(data.articles);
    };

    fetchArticles();
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      {articles.map((article) => (
        <ArticleCard
          key={article._id}
          id={article._id}
          title={article.title}
          content={article.content}
        />
      ))}
    </div>
  );
}