"use client";

import Link from "next/link";

type Props = {
  id: string;
  title: string;
  content: string;
};

export default function ArticleCard({ id, title, content }: Props) {
  return (
    <div className="border rounded-xl p-4 shadow-sm hover:shadow-md transition">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-gray-600 mt-2">
        {content.slice(0, 100)}...
      </p>

      <Link
        href={`/article/${id}`}
        className="text-blue-600 mt-3 inline-block"
      >
        Read More →
      </Link>
    </div>
  );
}