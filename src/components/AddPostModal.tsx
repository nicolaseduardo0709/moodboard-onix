"use client";

import { useState, useRef, useCallback } from "react";

interface AddPostModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (title: string, imageFile: File | null, imageUrl: string) => void;
}

export default function AddPostModal({
  open,
  onClose,
  onAdd,
}: AddPostModalProps) {
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setImageFile(file);
    setImageUrl("");
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) handleFile(file);
        return;
      }
    }
  }, []);

  const handleSubmit = () => {
    if (!title.trim()) return;
    if (!imageFile && !imageUrl.trim()) return;
    onAdd(title.trim(), imageFile, imageUrl.trim());
    setTitle("");
    setImageFile(null);
    setImagePreview("");
    setImageUrl("");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div
        className="bg-[#1e1e1e] rounded-xl border border-[#333] w-full max-w-md shadow-2xl"
        onPaste={handlePaste}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#2a2a2a]">
          <h2 className="text-base font-bold text-white">
            Nova publicação
          </h2>
          <button
            onClick={onClose}
            className="text-[#666] hover:text-[#aaa] cursor-pointer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título do post"
            className="w-full bg-[#2a2a2a] text-sm text-white rounded-lg px-3 py-2.5 border border-[#333] outline-none focus:border-[#555] placeholder:text-[#666]"
          />

          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              dragActive
                ? "border-[#555] bg-[#252525]"
                : "border-[#333] hover:border-[#444]"
            }`}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-48 mx-auto rounded"
              />
            ) : (
              <div className="text-[#666] text-sm">
                <svg className="mx-auto mb-2" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="m21 15-5-5L5 21" />
                </svg>
                <p>Arraste uma imagem, cole (Ctrl+V)</p>
                <p className="text-xs mt-1">ou clique para selecionar</p>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#333]" />
            <span className="text-xs text-[#666]">ou</span>
            <div className="flex-1 h-px bg-[#333]" />
          </div>

          <input
            type="url"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              setImageFile(null);
              setImagePreview("");
            }}
            placeholder="Colar URL da imagem"
            className="w-full bg-[#2a2a2a] text-sm text-white rounded-lg px-3 py-2.5 border border-[#333] outline-none focus:border-[#555] placeholder:text-[#666]"
          />
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
            disabled={!title.trim() || (!imageFile && !imageUrl.trim())}
            className="px-5 py-2 text-sm bg-[#FF0066] text-white rounded-full font-semibold hover:bg-[#E0005A] disabled:opacity-30 disabled:cursor-default cursor-pointer"
          >
            Publicar
          </button>
        </div>
      </div>
    </div>
  );
}
