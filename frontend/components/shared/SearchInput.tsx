"use client";

// components/shared/SearchInput.tsx
// Reusable glass search bar.

import { Search, X } from "lucide-react";
import { useRef } from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export default function SearchInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Search…",
  className = "",
  autoFocus = false,
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className={`relative flex items-center gap-2.5 rounded-2xl px-4 py-2.5 overflow-hidden ${className}`}
      style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.04) inset",
      }}
    >
      {/* Top sheen */}
      <div className="absolute top-0 left-[5%] right-[5%] h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

      {/* Focus ring overlay */}
      <div className="absolute inset-0 rounded-2xl opacity-0 focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"
        style={{ boxShadow: "0 0 0 2px rgba(91,140,255,0.3), 0 0 24px rgba(91,140,255,0.08)" }} />

      <Search className="h-4 w-4 text-white/30 shrink-0 relative z-10" />

      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSubmit?.()}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none relative z-10"
        autoFocus={autoFocus}
        aria-label={placeholder}
      />

      {value && (
        <button
          onClick={() => { onChange(""); inputRef.current?.focus(); }}
          className="h-5 w-5 rounded-full flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.08] transition-all shrink-0 relative z-10"
          aria-label="Clear search"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
