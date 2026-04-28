"use client";

import { useState } from "react";
import Button from "./ui/Button";
import Input from "./ui/Input";

type Comment = {
  _id: string;
  content: string;
};

type Props = {
  comments: Comment[];
  onAddComment: (text: string) => void;
};

export default function CommentSection({
  comments,
  onAddComment,
}: Props) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;
    onAddComment(text);
    setText("");
  };

  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-2">Comments</h3>

      <div className="flex gap-2 mb-4">
        <Input
  label="Comment"
  name="comment"
  value={text}
  onChange={(e) => setText(e.target.value)}
  placeholder="Write a comment..."
/>
        <Button onClick={handleSubmit}>Post</Button>
      </div>

      <div className="flex flex-col gap-2">
        {comments.map((c) => (
          <div key={c._id} className="border p-2 rounded-lg">
            {c.content}
          </div>
        ))}
      </div>
    </div>
  );
}