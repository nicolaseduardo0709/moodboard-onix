"use client";

import { Post } from "@/types";
import StarRating from "./StarRating";
import CommentSection from "./CommentSection";

interface ExpandedViewProps {
  post: Post | null;
  onClose: () => void;
  onRate: (postId: string, rating: number) => void;
  onAddComment: (postId: string, text: string) => void;
}

export default function ExpandedView({
  post,
  onClose,
  onRate,
  onAddComment,
}: ExpandedViewProps) {
  if (!post) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-xl border border-zinc-700 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
        <div className="flex-1 bg-black flex items-center justify-center min-h-[200px]">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="max-w-full max-h-[70vh] object-contain"
          />
        </div>

        <div className="w-full md:w-80 p-4 overflow-y-auto border-t md:border-t-0 md:border-l border-zinc-800">
          <div className="flex items-start justify-between mb-3">
            <h2 className="text-base font-semibold text-zinc-200">
              {post.title}
            </h2>
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-zinc-300 text-xl cursor-pointer ml-2"
            >
              ✕
            </button>
          </div>

          <div className="text-[10px] text-zinc-600 mb-1">Estrelas</div>
          <StarRating
            ratings={post.ratings}
            onRate={(r) => onRate(post.id, r)}
          />

          <div className="mt-4">
            <CommentSection
              comments={post.comments}
              onAddComment={(text) => onAddComment(post.id, text)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
