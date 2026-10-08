"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { Client, BriefingResponse } from "@/types";
import { BRIEFING_QUESTIONS } from "@/lib/briefing-questions";
import OnixHeader from "@/components/OnixHeader";

export default function BriefingPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;
  const [client, setClient] = useState<Client | null>(null);
  const [responses, setResponses] = useState<Record<string, string | string[] | number>>({});
  const [saving, setSaving] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(0);

  const categories = [...new Set(BRIEFING_QUESTIONS.map((q) => q.category))];
  const currentQuestions = BRIEFING_QUESTIONS.filter(
    (q) => q.category === categories[currentCategory]
  );

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "clients", clientId), (snap) => {
      if (snap.exists()) setClient({ id: snap.id, ...snap.data() } as Client);
    });
    return unsub;
  }, [clientId]);

  useEffect(() => {
    async function load() {
      const snap = await getDoc(doc(db, "clients", clientId, "briefing", "data"));
      if (snap.exists()) {
        const data = snap.data();
        const loaded: Record<string, string | string[] | number> = {};
        for (const r of data.responses || []) {
          loaded[r.questionId] = r.answer;
        }
        setResponses(loaded);
      }
    }
    load();
  }, [clientId]);

  const updateResponse = (questionId: string, value: string | string[] | number) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  const toggleMultiSelect = (questionId: string, option: string) => {
    setResponses((prev) => {
      const current = (prev[questionId] as string[]) || [];
      const next = current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option];
      return { ...prev, [questionId]: next };
    });
  };

  const handleSave = useCallback(async () => {
    setSaving(true);
    const responseArray: BriefingResponse[] = Object.entries(responses).map(
      ([questionId, answer]) => ({ questionId, answer })
    );

    await setDoc(doc(db, "clients", clientId, "briefing", "data"), {
      clientId,
      responses: responseArray,
      completedAt: null,
      updatedAt: Date.now(),
    });

    await updateDoc(doc(db, "clients", clientId), {
      "stages.briefing": "in_progress",
    });

    setSaving(false);
  }, [clientId, responses]);

  const handleComplete = useCallback(async () => {
    setSaving(true);
    const responseArray: BriefingResponse[] = Object.entries(responses).map(
      ([questionId, answer]) => ({ questionId, answer })
    );

    await setDoc(doc(db, "clients", clientId, "briefing", "data"), {
      clientId,
      responses: responseArray,
      completedAt: Date.now(),
      updatedAt: Date.now(),
    });

    await updateDoc(doc(db, "clients", clientId), {
      "stages.briefing": "completed",
      "stages.moodboard": "available",
    });

    setSaving(false);
    router.push(`/clients/${clientId}`);
  }, [clientId, responses, router]);

  const requiredAnswered = BRIEFING_QUESTIONS.filter((q) => q.required).every(
    (q) => {
      const val = responses[q.id];
      if (Array.isArray(val)) return val.length > 0;
      return val !== undefined && val !== "";
    }
  );

  const progress = Math.round(
    (Object.keys(responses).filter((k) => {
      const v = responses[k];
      return Array.isArray(v) ? v.length > 0 : v !== undefined && v !== "";
    }).length /
      BRIEFING_QUESTIONS.length) *
      100
  );

  return (
    <div className="min-h-screen bg-[#121212]">
      <OnixHeader
        backHref={`/clients/${clientId}`}
        backLabel={client?.name}
        title="Briefing"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="text-xs px-3 py-1.5 rounded-lg bg-[#2a2a2a] text-[#ccc] hover:bg-[#333] border border-[#333] cursor-pointer disabled:opacity-50 transition-colors"
            >
              {saving ? "Salvando..." : "Salvar rascunho"}
            </button>
            <button
              onClick={handleComplete}
              disabled={!requiredAnswered || saving}
              className="text-xs px-4 py-1.5 rounded-full bg-[#FF0066] text-white font-semibold hover:bg-[#E0005A] cursor-pointer disabled:opacity-30 disabled:cursor-default transition-colors"
            >
              Concluir Briefing
            </button>
          </div>
        }
      />

      <div className="max-w-3xl mx-auto px-6 pt-6 pb-2">
        <h1 className="text-xl font-bold text-white mb-1">
          Briefing {client ? `- ${client.name}` : ""}
        </h1>
        <p className="text-sm text-[#666] mb-4">
          Preencha as informacoes sobre a marca para guiar o projeto de identidade visual.
        </p>

        <div className="flex items-center gap-2 mb-6">
          <div className="flex-1 h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#FF0066] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-[#888]">{progress}%</span>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {categories.map((cat, i) => (
            <button
              key={cat}
              onClick={() => setCurrentCategory(i)}
              className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap cursor-pointer transition-colors ${
                i === currentCategory
                  ? "bg-[#FF0066] text-white"
                  : "bg-[#2a2a2a] text-[#888] hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-20">
        <div className="space-y-6">
          {currentQuestions.map((q) => (
            <div key={q.id} className="bg-[#1e1e1e] rounded-xl border border-[#2a2a2a] p-5">
              <label className="text-sm font-medium text-white mb-3 block">
                {q.question}
                {q.required && <span className="text-[#FF0066] ml-1">*</span>}
              </label>

              {q.type === "text" && (
                <input
                  type="text"
                  value={(responses[q.id] as string) || ""}
                  onChange={(e) => updateResponse(q.id, e.target.value)}
                  className="w-full bg-[#2a2a2a] text-sm text-white rounded-lg px-3 py-2.5 border border-[#333] outline-none focus:border-[#FF0066] placeholder:text-[#555]"
                />
              )}

              {q.type === "textarea" && (
                <textarea
                  value={(responses[q.id] as string) || ""}
                  onChange={(e) => updateResponse(q.id, e.target.value)}
                  rows={3}
                  className="w-full bg-[#2a2a2a] text-sm text-white rounded-lg px-3 py-2.5 border border-[#333] outline-none focus:border-[#FF0066] placeholder:text-[#555] resize-none"
                />
              )}

              {q.type === "select" && q.options && (
                <div className="flex flex-wrap gap-2">
                  {q.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => updateResponse(q.id, opt)}
                      className={`text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                        responses[q.id] === opt
                          ? "bg-[#FF0066] text-white"
                          : "bg-[#2a2a2a] text-[#888] hover:text-white border border-[#333]"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {q.type === "multi-select" && q.options && (
                <div className="flex flex-wrap gap-2">
                  {q.options.map((opt) => {
                    const selected = ((responses[q.id] as string[]) || []).includes(opt);
                    return (
                      <button
                        key={opt}
                        onClick={() => toggleMultiSelect(q.id, opt)}
                        className={`text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                          selected
                            ? "bg-[#FF0066] text-white"
                            : "bg-[#2a2a2a] text-[#888] hover:text-white border border-[#333]"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentCategory((c) => Math.max(0, c - 1))}
            disabled={currentCategory === 0}
            className="text-xs px-4 py-2 rounded-lg bg-[#2a2a2a] text-[#888] hover:text-white cursor-pointer disabled:opacity-30 disabled:cursor-default transition-colors"
          >
            Anterior
          </button>
          <button
            onClick={() =>
              setCurrentCategory((c) => Math.min(categories.length - 1, c + 1))
            }
            disabled={currentCategory === categories.length - 1}
            className="text-xs px-4 py-2 rounded-lg bg-[#FF0066] text-white font-semibold hover:bg-[#E0005A] cursor-pointer disabled:opacity-30 disabled:cursor-default transition-colors"
          >
            Proximo
          </button>
        </div>
      </div>
    </div>
  );
}
