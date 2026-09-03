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
    <article className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 break-inside-avoid mb-4">
      <div className="relative group">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full object-cover cursor-pointer"
          onClick={() => onExpand(post)}
          loading="lazy"
        />
      </div>

      <div className="p-3">
        <div className="flex items-start justify-between">
          <h3 className="text-sm font-medium text-zinc-200 mb-1">
            {post.title}
          </h3>
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-zinc-500 hover:text-zinc-300 text-lg leading-none cursor-pointer px-1"
            >
              ⋯
            </button>
            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-6 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-20 py-1 min-w-[140px]">
                  <button
                    onClick={() => {
                      onExpand(post);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-700 cursor-pointer"
                  >
                    Visualizar
                  </button>
                  <button
                    onClick={() => {
                      onDelete(post.id);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-zinc-700 cursor-pointer"
                  >
                    Excluir
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="text-[10px] text-zinc-600 mb-1">Estrelas</div>
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
