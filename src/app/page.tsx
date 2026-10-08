"use client";

import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { Client, StageName } from "@/types";
import OnixHeader from "@/components/OnixHeader";
import ClientCard from "@/components/dashboard/ClientCard";
import AddClientModal from "@/components/dashboard/AddClientModal";

const AVATAR_COLORS = [
  "#FF0066", "#6366F1", "#F59E0B", "#10B981", "#EC4899",
  "#8B5CF6", "#EF4444", "#14B8A6", "#F97316", "#3B82F6",
];

const DEFAULT_STAGES: Record<StageName, "locked" | "available" | "in_progress" | "completed"> = {
  briefing: "available",
  moodboard: "locked",
  archetype: "locked",
  competitors: "locked",
  presentation: "locked",
};

export default function Dashboard() {
  const [clients, setClients] = useState<Client[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const q = query(collection(db, "clients"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Client));
      setClients(data);
    });
    return unsub;
  }, []);

  const handleAddClient = useCallback(async (name: string, segment: string) => {
    const color = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    await addDoc(collection(db, "clients"), {
      name,
      segment,
      avatarColor: color,
      createdAt: Date.now(),
      stages: DEFAULT_STAGES,
    });
  }, []);

  const handleDeleteClient = useCallback(async (clientId: string) => {
    await deleteDoc(doc(db, "clients", clientId));
  }, []);

  const filtered = search
    ? clients.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.segment.toLowerCase().includes(search.toLowerCase())
      )
    : clients;

  return (
    <div className="min-h-screen bg-[#121212]">
      <OnixHeader
        actions={
          <div className="relative">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#666]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar cliente..."
              className="w-48 bg-[#2a2a2a] text-xs text-white rounded-lg pl-8 pr-3 py-1.5 border border-[#333] outline-none focus:border-[#FF0066] placeholder:text-[#555]"
            />
          </div>
        }
      />

      <div className="px-6 pt-6 pb-2">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-bold text-white">Projetos</h1>
          <span className="text-xs text-[#666]">{clients.length} {clients.length === 1 ? "cliente" : "clientes"}</span>
        </div>
        <p className="text-sm text-[#666]">
          Gerencie seus projetos de identidade visual
        </p>
      </div>

      <div className="px-6 py-4">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                onDelete={handleDeleteClient}
              />
            ))}
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-20 text-[#555]">
            <svg className="mx-auto mb-4" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <p className="text-base">Nenhum projeto ainda</p>
            <p className="text-sm mt-1">Clique em &quot;+ Novo Cliente&quot; para comecar</p>
          </div>
        ) : (
          <div className="text-center py-10 text-[#555]">
            <p className="text-sm">Nenhum resultado para &quot;{search}&quot;</p>
          </div>
        )}
      </div>

      <button
        onClick={() => setModalOpen(true)}
        className="fixed bottom-6 right-6 bg-[#FF0066] text-white font-semibold px-5 py-3 rounded-full shadow-lg hover:bg-[#E0005A] transition-colors cursor-pointer text-sm z-20 flex items-center gap-2"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Novo Cliente
      </button>

      <AddClientModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddClient}
      />
    </div>
  );
}
