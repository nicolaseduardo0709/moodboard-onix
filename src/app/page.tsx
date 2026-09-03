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
        author: "Usuário",
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
    <div className="min-h-screen bg-zinc-950">
      <header className="sticky top-0 z-30 bg-zinc-950/90 backdrop-blur border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <h1 className="text-sm font-bold text-zinc-200 whitespace-nowrap">
            Moodboard Onix Studio
          </h1>
          <div className="flex-1 max-w-sm">
            <SearchBar value={search} onChange={setSearch} />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-zinc-100">
            Moodboard Onix Studio
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Espaço para adicionar conceitos e elementos visuais.
          </p>
        </div>

        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
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
          <div className="text-center py-20 text-zinc-600">
            <p className="text-lg">Nenhum post ainda</p>
            <p className="text-sm mt-1">
              Clique em &quot;+ Publicar&quot; para adicionar
            </p>
          </div>
        )}
      </div>

      <button
        onClick={() => setModalOpen(true)}
        className="fixed bottom-6 right-6 bg-white text-black font-semibold px-5 py-3 rounded-full shadow-lg hover:bg-zinc-200 transition-colors cursor-pointer text-sm z-20"
      >
        + Publicar
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
