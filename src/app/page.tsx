"use client";

import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  orderBy,
  query,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { Post, Comment } from "@/types";
import PostCard from "@/components/PostCard";
import AddPostModal from "@/components/AddPostModal";
import ExpandedView from "@/components/ExpandedView";
import SearchBar from "@/components/SearchBar";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedPost, setExpandedPost] = useState<Post | null>(null);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Post));
      setPosts(data);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (expandedPost) {
      const updated = posts.find((p) => p.id === expandedPost.id);
      if (updated) setExpandedPost(updated);
    }
  }, [posts, expandedPost]);

  const handleAddPost = useCallback(
    async (title: string, imageFile: File | null, imageUrl: string) => {
      let finalUrl = imageUrl;

      if (imageFile) {
        finalUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(imageFile);
        });
      }

      await addDoc(collection(db, "posts"), {
        title,
        imageUrl: finalUrl,
        ratings: [],
        comments: [],
        createdAt: Date.now(),
      });
    },
    []
  );

  const handleRate = useCallback(
    async (postId: string, rating: number) => {
      const post = posts.find((p) => p.id === postId);
      if (!post) return;
      const newRatings = [...post.ratings, rating];
      await updateDoc(doc(db, "posts", postId), { ratings: newRatings });
    },
    [posts]
  );

  const handleAddComment = useCallback(
    async (postId: string, text: string) => {
      const post = posts.find((p) => p.id === postId);
      if (!post) return;
      const newComment: Comment = {
        id: uuidv4(),
        author: "Usuario",
        text,
        createdAt: Date.now(),
      };
      await updateDoc(doc(db, "posts", postId), {
        comments: [...post.comments, newComment],
      });
    },
    [posts]
  );

  const handleDelete = useCallback(async (postId: string) => {
    await deleteDoc(doc(db, "posts", postId));
  }, []);

  const filtered = search
    ? posts.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      )
    : posts;

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Top toolbar */}
      <header className="sticky top-0 z-30 bg-[#1a1a1a] border-b border-[#2a2a2a]">
        <div className="flex items-center justify-between px-4 h-12">
          <div className="flex items-center gap-2">
            {/* Onix logo mark */}
            <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="38" stroke="#FF0066" strokeWidth="8" strokeLinecap="round" strokeDasharray="160 80" />
              <path d="M50 20C33.4 20 20 33.4 20 50s13.4 30 30 30c8.3 0 15.8-3.4 21.2-8.8C65 77 57.9 80 50 80c-16.6 0-30-13.4-30-30s13.4-30 30-30z" fill="#FF0066" />
            </svg>
            <span className="text-sm font-bold text-white tracking-tight">ONIX</span>
            <span className="text-[10px] text-[#888] tracking-[0.2em] font-medium">DESIGN</span>
          </div>

          <div className="flex items-center gap-2">
            {searchOpen ? (
              <div className="w-64 flex items-center gap-2">
                <SearchBar value={search} onChange={setSearch} />
                <button
                  onClick={() => { setSearchOpen(false); setSearch(""); }}
                  className="text-[#888] hover:text-white cursor-pointer"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="w-8 h-8 rounded-full bg-[#FF0066] flex items-center justify-center cursor-pointer hover:bg-[#E0005A] transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </button>
            )}
            <button className="flex items-center gap-1.5 bg-[#2a2a2a] hover:bg-[#333] text-[#ccc] text-xs px-3 py-1.5 rounded-md cursor-pointer transition-colors border border-[#333]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
              </svg>
              Apresentacao
            </button>
            <button className="flex items-center gap-1.5 bg-[#2a2a2a] hover:bg-[#333] text-[#ccc] text-xs px-3 py-1.5 rounded-md cursor-pointer transition-colors border border-[#333]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
              Compartilhar
            </button>
          </div>
        </div>
      </header>

      {/* Board info */}
      <div className="px-6 pt-5 pb-2">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-full bg-[#FF0066] flex items-center justify-center text-[10px] text-white font-bold">N</div>
          <span className="text-xs text-[#888]">Nicolas Eduardo</span>
        </div>
        <h1 className="text-xl font-bold text-white mb-1">
          Painel Semantico - Piarcold
        </h1>
        <p className="text-sm text-[#666]">
          Espaco para adicionar conceitos e elementos visuais.
        </p>
      </div>

      {/* Masonry grid */}
      <div className="px-4 py-4">
        <div className="masonry-grid">
          {filtered.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onRate={handleRate}
              onAddComment={handleAddComment}
              onDelete={handleDelete}
              onExpand={setExpandedPost}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-[#555]">
            <svg className="mx-auto mb-4" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
            <p className="text-base">Nenhum post ainda</p>
            <p className="text-sm mt-1">
              Clique em &quot;+ Publicar&quot; para adicionar
            </p>
          </div>
        )}
      </div>

      {/* Publish button */}
      <button
        onClick={() => setModalOpen(true)}
        className="fixed bottom-6 right-6 bg-white text-black font-semibold px-5 py-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors cursor-pointer text-sm z-20 flex items-center gap-1"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Publicar
      </button>

      <AddPostModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddPost}
      />

      <ExpandedView
        post={expandedPost}
        onClose={() => setExpandedPost(null)}
        onRate={handleRate}
        onAddComment={handleAddComment}
      />
    </div>
  );
}
