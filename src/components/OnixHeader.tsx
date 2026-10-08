"use client";

import Link from "next/link";

interface OnixHeaderProps {
  backHref?: string;
  backLabel?: string;
  title?: string;
  actions?: React.ReactNode;
}

export default function OnixHeader({ backHref, backLabel, title, actions }: OnixHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-[#1a1a1a] border-b border-[#2a2a2a]">
      <div className="flex items-center justify-between px-4 h-12">
        <div className="flex items-center gap-3">
          {backHref && (
            <Link href={backHref} className="text-[#888] hover:text-white transition-colors mr-1">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </Link>
          )}
          <Link href="/" className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="38" stroke="#FF0066" strokeWidth="8" strokeLinecap="round" strokeDasharray="160 80" />
              <path d="M50 20C33.4 20 20 33.4 20 50s13.4 30 30 30c8.3 0 15.8-3.4 21.2-8.8C65 77 57.9 80 50 80c-16.6 0-30-13.4-30-30s13.4-30 30-30z" fill="#FF0066" />
            </svg>
            <span className="text-sm font-bold text-white tracking-tight">ONIX</span>
            <span className="text-[10px] text-[#888] tracking-[0.2em] font-medium">STUDIO</span>
          </Link>
          {backLabel && (
            <>
              <span className="text-xs text-[#555]">/</span>
              <span className="text-xs text-[#888]">{backLabel}</span>
            </>
          )}
          {title && (
            <>
              <span className="text-xs text-[#555]">/</span>
              <span className="text-xs text-white font-medium">{title}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {actions}
        </div>
      </div>
    </header>
  );
}
