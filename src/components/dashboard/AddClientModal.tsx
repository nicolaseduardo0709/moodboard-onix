"use client";

import { useState } from "react";

interface AddClientModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (name: string, segment: string) => void;
}

export default function AddClientModal({ open, onClose, onAdd }: AddClientModalProps) {
  const [name, setName] = useState("");
  const [segment, setSegment] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAdd(name.trim(), segment.trim());
    setName("");
    setSegment("");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1e1e1e] rounded-xl border border-[#333] w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-[#2a2a2a]">
          <h2 className="text-base font-bold text-white">Novo Cliente</h2>
          <button onClick={onClose} className="text-[#666] hover:text-[#aaa] cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs text-[#888] mb-1.5 block uppercase tracking-wide">Nome do Cliente</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: J-Pastéis"
              className="w-full bg-[#2a2a2a] text-sm text-white rounded-lg px-3 py-2.5 border border-[#333] outline-none focus:border-[#FF0066] placeholder:text-[#666]"
            />
          </div>

          <div>
            <label className="text-xs text-[#888] mb-1.5 block uppercase tracking-wide">Segmento</label>
            <input
              type="text"
              value={segment}
              onChange={(e) => setSegment(e.target.value)}
              placeholder="Ex: Alimentação, Moda, Tecnologia"
              className="w-full bg-[#2a2a2a] text-sm text-white rounded-lg px-3 py-2.5 border border-[#333] outline-none focus:border-[#FF0066] placeholder:text-[#666]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t border-[#2a2a2a]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-[#888] hover:text-white cursor-pointer rounded-lg"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="px-5 py-2 text-sm bg-[#FF0066] text-white rounded-full font-semibold hover:bg-[#E0005A] disabled:opacity-30 disabled:cursor-default cursor-pointer"
          >
            Criar Projeto
          </button>
        </div>
      </div>
    </div>
  );
}
