"use client";

import { useState } from "react";
import { Post } from "@/types";
import StarRating from "./StarRating";
import CommentSection from "./CommentSection";

interface PostCardProps {
  post: Post;
  onRate: (postId: string, rating: number) => void;
  onAddComment: (postId: string, text: string) => void;
  onDelete: (postId: string) => void;
  onExpand: (post: Post) => void;
}

export default function PostCard({
  post,
  onRate,
  onAddComment,
  onDelete,
  onExpand,
}: PostCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <article className="post-card bg-[#1e1e1e] rounded-lg overflow-hidden border border-[#2a2a2a] break-inside-avoid mb-3 hover:border-[#3a3a3a] transition-colors">
      {post.title && (
        <div className="px-3 pt-3 pb-1 flex items-start justify-between">
          <h3 className="text-sm font-bold text-white leading-snug">
            {post.title}
          </h3>
          <div className="relative shrink-0 ml-1">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-[#666] hover:text-[#aaa] cursor-pointer p-0.5 leading-none"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="19" r="2" />
              </svg>
            </button>
            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-6 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg shadow-2xl z-20 py-1 min-w-[150px]">
                  <button
                    onClick={() => { onExpand(post); setMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs text-[#ccc] hover:bg-[#333] cursor-pointer"
                  >
                    Visualizar
                  </button>
                  <button
                    onClick={() => { onDelete(post.id); setMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-[#333] cursor-pointer"
                  >
                    Excluir
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div
        className="cursor-pointer"
        onClick={() => onExpand(post)}
      >
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="px-3 pt-2 pb-3">
        <div className="text-[10px] text-[#888] mb-1 uppercase tracking-wide">Estrelas</div>
        <StarRating
          ratings={post.ratings}
          onRate={(r) => onRate(post.id, r)}
        />

        <CommentSection
          comments={post.comments}
          onAddComment={(text) => onAddComment(post.id, text)}
        />
      </div>
    </article>
  );
}
