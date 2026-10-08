"use client";

import Link from "next/link";
import { Client } from "@/types";

const STAGE_LABELS: Record<string, string> = {
  briefing: "Briefing",
  moodboard: "Moodboard",
  archetype: "Arquétipo",
  competitors: "Concorrentes",
  presentation: "Apresentação",
};

function getProgressInfo(stages: Client["stages"]) {
  const total = Object.keys(stages).length;
  const completed = Object.values(stages).filter((s) => s === "completed").length;
  const currentStage =
    Object.entries(stages).find(([, s]) => s === "in_progress")?.[0] ||
    Object.entries(stages).find(([, s]) => s === "available")?.[0];
  return { total, completed, currentStage };
}

interface ClientCardProps {
  client: Client;
  onDelete: (id: string) => void;
}

export default function ClientCard({ client, onDelete }: ClientCardProps) {
  const { total, completed, currentStage } = getProgressInfo(client.stages);
  const progress = Math.round((completed / total) * 100);

  return (
    <Link
      href={`/clients/${client.id}`}
      className="group bg-[#1e1e1e] rounded-xl border border-[#2a2a2a] hover:border-[#FF0066]/40 transition-all p-5 block"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white"
            style={{ backgroundColor: client.avatarColor }}
          >
            {client.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white group-hover:text-[#FF0066] transition-colors">
              {client.name}
            </h3>
            {client.segment && (
              <p className="text-[11px] text-[#666]">{client.segment}</p>
            )}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(client.id);
          }}
          className="text-[#444] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer p-1"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14" />
          </svg>
        </button>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-[#888] uppercase tracking-wider">Progresso</span>
          <span className="text-[10px] text-[#888]">{completed}/{total}</span>
        </div>
        <div className="h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#FF0066] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {currentStage && (
        <div className="flex items-center gap-1.5 text-[11px] text-[#FF0066]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          {STAGE_LABELS[currentStage] || currentStage}
        </div>
      )}
    </Link>
  );
}
