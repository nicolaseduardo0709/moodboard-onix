"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Client, StageName } from "@/types";
import OnixHeader from "@/components/OnixHeader";

interface StageConfig {
  name: StageName;
  label: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

function getStages(clientId: string): StageConfig[] {
  return [
    {
      name: "briefing",
      label: "Briefing",
      description: "Questionario sobre a marca, publico e posicionamento",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
      href: `/clients/${clientId}/briefing`,
    },
    {
      name: "moodboard",
      label: "Moodboard",
      description: "Painel de referencias visuais e conceitos",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
      ),
      href: `/clients/${clientId}/moodboard`,
    },
    {
      name: "archetype",
      label: "Arquetipo",
      description: "Deteccao automatica do arquetipo da marca",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
      ),
      href: `/clients/${clientId}`,
    },
    {
      name: "competitors",
      label: "Concorrentes",
      description: "Analise visual dos concorrentes da marca",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      href: `/clients/${clientId}`,
    },
    {
      name: "presentation",
      label: "Apresentacao",
      description: "Apresentacao final sincronizada com todas as etapas",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
      ),
      href: `/clients/${clientId}`,
    },
  ];
}

const STATUS_STYLES: Record<string, { badge: string; card: string; label: string }> = {
  locked: {
    badge: "bg-[#333] text-[#666]",
    card: "border-[#2a2a2a] opacity-50 cursor-default",
    label: "Bloqueado",
  },
  available: {
    badge: "bg-[#FF0066]/10 text-[#FF0066]",
    card: "border-[#2a2a2a] hover:border-[#FF0066]/40 cursor-pointer",
    label: "Disponivel",
  },
  in_progress: {
    badge: "bg-[#F59E0B]/10 text-[#F59E0B]",
    card: "border-[#F59E0B]/30 hover:border-[#F59E0B]/50 cursor-pointer",
    label: "Em andamento",
  },
  completed: {
    badge: "bg-[#10B981]/10 text-[#10B981]",
    card: "border-[#10B981]/30 hover:border-[#10B981]/50 cursor-pointer",
    label: "Concluido",
  },
};

export default function ClientProject() {
  const params = useParams();
  const clientId = params.id as string;
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "clients", clientId), (snap) => {
      if (snap.exists()) {
        setClient({ id: snap.id, ...snap.data() } as Client);
      }
    });
    return unsub;
  }, [clientId]);

  if (!client) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#FF0066] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stages = getStages(clientId);

  return (
    <div className="min-h-screen bg-[#121212]">
      <OnixHeader backHref="/" backLabel={client.name} />

      <div className="px-6 pt-6 pb-2">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white"
            style={{ backgroundColor: client.avatarColor }}
          >
            {client.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{client.name}</h1>
            {client.segment && (
              <p className="text-sm text-[#666]">{client.segment}</p>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-4">
        <h2 className="text-xs text-[#888] uppercase tracking-wider mb-4">Etapas do Projeto</h2>

        <div className="space-y-3">
          {stages.map((stage, index) => {
            const status = client.stages[stage.name] || "locked";
            const styles = STATUS_STYLES[status];
            const isClickable = status !== "locked";

            const card = (
              <div
                className={`bg-[#1e1e1e] rounded-xl border p-5 transition-all ${styles.card}`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center text-xs font-bold text-[#888]">
                      {index + 1}
                    </div>
                    <div className="text-[#888]">
                      {stage.icon}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-white">{stage.label}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${styles.badge}`}>
                        {styles.label}
                      </span>
                    </div>
                    <p className="text-xs text-[#666]">{stage.description}</p>
                  </div>
                  {isClickable && (
                    <svg className="text-[#555] shrink-0 mt-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  )}
                </div>
              </div>
            );

            if (isClickable) {
              return (
                <Link key={stage.name} href={stage.href}>
                  {card}
                </Link>
              );
            }

            return <div key={stage.name}>{card}</div>;
          })}
        </div>
      </div>
    </div>
  );
}
