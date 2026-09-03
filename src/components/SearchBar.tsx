"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">
        🔍
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Pesquisar posts por palavras-chave"
        className="w-full bg-zinc-800 text-sm text-zinc-300 rounded-full pl-9 pr-4 py-2 border border-zinc-700 outline-none focus:border-zinc-500 placeholder:text-zinc-600"
      />
    </div>
  );
}
