"use client";

import { useState } from "react";
import { Comment } from "@/types";

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (text: string) => void;
}

export default function CommentSection({
  comments,
  onAddComment,
}: CommentSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;
    onAddComment(text.trim());
    setText("");
  };

  return (
    <div className="mt-2">
      {comments.length > 0 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer mb-1"
        >
          {expanded ? "Ocultar" : "Mostrar"} comentários ({comments.length})
        </button>
      )}

      {expanded &&
        comments.map((c) => (
          <div key={c.id} className="mb-2 pl-2 border-l-2 border-zinc-700">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-zinc-600 flex items-center justify-center text-[10px] text-white">
                {c.author[0]?.toUpperCase() || "?"}
              </div>
              <span className="text-xs text-zinc-400">{c.author}</span>
              <span className="text-[10px] text-zinc-600">
                {new Date(c.createdAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <p className="text-xs text-zinc-300 mt-1">{c.text}</p>
          </div>
        ))}

      <div className="flex gap-1 mt-1">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Adicionar comentário"
          className="flex-1 bg-zinc-800 text-xs text-zinc-300 rounded px-2 py-1 border border-zinc-700 outline-none focus:border-zinc-500 placeholder:text-zinc-600"
        />
        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="text-xs bg-zinc-700 hover:bg-zinc-600 text-zinc-300 px-2 py-1 rounded disabled:opacity-30 cursor-pointer disabled:cursor-default"
        >
          ↵
        </button>
      </div>
    </div>
  );
}
