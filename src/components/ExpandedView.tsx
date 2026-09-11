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
    <div
      className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#1e1e1e] rounded-xl border border-[#333] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl">
        <div className="flex-1 bg-black flex items-center justify-center min-h-[250px] relative">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="max-w-full max-h-[80vh] object-contain"
          />
        </div>

        <div className="w-full md:w-[340px] flex flex-col border-t md:border-t-0 md:border-l border-[#2a2a2a]">
          <div className="flex items-start justify-between p-4 border-b border-[#2a2a2a]">
            <h2 className="text-base font-bold text-white">
              {post.title}
            </h2>
            <button
              onClick={onClose}
              className="text-[#666] hover:text-[#aaa] cursor-pointer ml-2 shrink-0"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="text-[10px] text-[#888] mb-1 uppercase tracking-wide">Estrelas</div>
            <StarRating
              ratings={post.ratings}
              onRate={(r) => onRate(post.id, r)}
              size="md"
            />

            <div className="mt-6">
              <div className="text-[10px] text-[#888] mb-2 uppercase tracking-wide">
                Comentários ({post.comments.length})
              </div>
              <CommentSection
                comments={post.comments}
                onAddComment={(text) => onAddComment(post.id, text)}
                expanded
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
