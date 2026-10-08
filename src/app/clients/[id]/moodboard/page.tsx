"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
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
import { Post, Comment, Client } from "@/types";
import PostCard from "@/components/PostCard";
import AddPostModal from "@/components/AddPostModal";
import ExpandedView from "@/components/ExpandedView";
import SearchBar from "@/components/SearchBar";
import OnixHeader from "@/components/OnixHeader";

export default function MoodboardPage() {
  const params = useParams();
  const clientId = params.id as string;
  const [client, setClient] = useState<Client | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedPost, setExpandedPost] = useState<Post | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "clients", clientId), (snap) => {
      if (snap.exists()) setClient({ id: snap.id, ...snap.data() } as Client);
    });
    return unsub;
  }, [clientId]);

  useEffect(() => {
    const q = query(
      collection(db, "clients", clientId, "posts"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Post));
      setPosts(data);
    });
    return unsub;
  }, [clientId]);

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
      await addDoc(collection(db, "clients", clientId, "posts"), {
        title,
        imageUrl: finalUrl,
        ratings: [],
        comments: [],
        createdAt: Date.now(),
      });
    },
    [clientId]
  );

  const handleRate = useCallback(
    async (postId: string, rating: number) => {
      const post = posts.find((p) => p.id === postId);
      if (!post) return;
      await updateDoc(doc(db, "clients", clientId, "posts", postId), {
        ratings: [...post.ratings, rating],
      });
    },
    [posts, clientId]
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
      await updateDoc(doc(db, "clients", clientId, "posts", postId), {
        comments: [...post.comments, newComment],
      });
    },
    [posts, clientId]
  );

  const handleDelete = useCallback(
    async (postId: string) => {
      await deleteDoc(doc(db, "clients", clientId, "posts", postId));
    },
    [clientId]
  );

  const filtered = search
    ? posts.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      )
    : posts;

  return (
    <div className="min-h-screen bg-[#121212]">
      <OnixHeader
        backHref={`/clients/${clientId}`}
        backLabel={client?.name}
        title="Moodboard"
        actions={
          <>
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
          </>
        }
      />

      <div className="px-6 pt-5 pb-2">
        <h1 className="text-xl font-bold text-white mb-1">
          Moodboard {client ? `- ${client.name}` : ""}
        </h1>
        <p className="text-sm text-[#666]">
          Espaco para adicionar conceitos e elementos visuais.
        </p>
      </div>

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
