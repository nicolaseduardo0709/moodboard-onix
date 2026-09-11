"use client";

import { useState } from "react";
import { Comment } from "@/types";

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (text: string) => void;
  expanded?: boolean;
}

const AVATAR_COLORS = [
  "#FF0066", "#8e24aa", "#3949ab", "#00897b",
  "#e53935", "#f4511e", "#6d4c41", "#546e7a",
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "agora";
  if (mins < 60) return `há ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `há ${hours} hora${hours > 1 ? "s" : ""}`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `há ${days} dia${days > 1 ? "s" : ""}`;
  const months = Math.floor(days / 30);
  return `há ${months} ${months === 1 ? "mês" : "meses"}`;
}

export default function CommentSection({
  comments,
  onAddComment,
  expanded: alwaysExpanded,
}: CommentSectionProps) {
  const [showComments, setShowComments] = useState(false);
  const [text, setText] = useState("");

  const isExpanded = alwaysExpanded || showComments;

  const handleSubmit = () => {
    if (!text.trim()) return;
    onAddComment(text.trim());
    setText("");
  };

  return (
    <div className="mt-2">
      {comments.length > 0 && !alwaysExpanded && (
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 text-xs text-[#888] hover:text-[#bbb] cursor-pointer mb-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          {comments.length}
        </button>
      )}

      {isExpanded && comments.map((c) => (
        <div key={c.id} className="flex gap-2 mb-3">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white font-bold shrink-0 mt-0.5"
            style={{ backgroundColor: getAvatarColor(c.author) }}
          >
            {c.author[0]?.toUpperCase() || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-semibold text-[#e0e0e0]">{c.author}</span>
              <span className="text-[10px] text-[#666]">{timeAgo(c.createdAt)}</span>
            </div>
            <p className="text-xs text-[#bbb] mt-0.5 break-words">{c.text}</p>
          </div>
        </div>
      ))}

      <button
        onClick={() => {
          if (!isExpanded) setShowComments(true);
          const input = document.activeElement?.closest(".post-card")?.querySelector<HTMLInputElement>(".comment-input");
          if (input) input.focus();
        }}
        className="text-xs text-[#888] hover:text-[#bbb] cursor-pointer flex items-center gap-1 mt-1"
      >
        <span className="text-sm">+</span> Adicionar comentário
      </button>

      {isExpanded && (
        <div className="mt-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Escreva um comentário..."
            className="comment-input w-full bg-transparent text-xs text-[#ccc] border-b border-[#333] outline-none py-1.5 placeholder:text-[#555] focus:border-[#666]"
          />
        </div>
      )}
    </div>
  );
}
