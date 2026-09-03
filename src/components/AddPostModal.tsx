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
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div
        className="bg-zinc-900 rounded-xl border border-zinc-700 w-full max-w-md"
        onPaste={handlePaste}
      >
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 className="text-base font-semibold text-zinc-200">
            Novo Post
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 text-xl cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título do post"
            className="w-full bg-zinc-800 text-sm text-zinc-200 rounded-lg px-3 py-2 border border-zinc-700 outline-none focus:border-zinc-500 placeholder:text-zinc-600"
          />

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              dragActive
                ? "border-zinc-400 bg-zinc-800"
                : "border-zinc-700 hover:border-zinc-600"
            }`}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-48 mx-auto rounded"
              />
            ) : (
              <div className="text-zinc-500 text-sm">
                <p>Arraste uma imagem, cole (Ctrl+V) ou clique para selecionar</p>
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

          <div className="text-center text-xs text-zinc-600">ou</div>

          <input
            type="url"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              setImageFile(null);
              setImagePreview("");
            }}
            placeholder="Colar URL da imagem"
            className="w-full bg-zinc-800 text-sm text-zinc-200 rounded-lg px-3 py-2 border border-zinc-700 outline-none focus:border-zinc-500 placeholder:text-zinc-600"
          />
        </div>

        <div className="flex justify-end gap-2 p-4 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || (!imageFile && !imageUrl.trim())}
            className="px-4 py-2 text-sm bg-white text-black rounded-lg font-medium hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-default cursor-pointer"
          >
            Publicar
          </button>
        </div>
      </div>
    </div>
  );
}
