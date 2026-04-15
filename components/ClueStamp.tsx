"use client";

import { useEffect } from "react";

interface ClueStampProps {
  label: string;
  explanation: string;
  onDismiss: () => void;
}

export default function ClueStamp({ label, explanation, onDismiss }: ClueStampProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
      onClick={onDismiss}
      role="dialog"
      aria-modal="true"
      aria-label={`Clue found: ${label}`}
    >
      <div
        className="max-w-sm w-full rounded-lg p-8 text-center"
        style={{ backgroundColor: "var(--noir-paper)", color: "var(--noir-dark)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Red stamp */}
        <div
          className="stamp-animation inline-block border-4 px-6 py-3 mb-4 text-3xl font-bold tracking-widest rotate-[-8deg]"
          style={{ borderColor: "var(--noir-red)", color: "var(--noir-red)" }}
          aria-hidden="true"
        >
          NOTED
        </div>

        <h3
          className="text-xl font-bold mb-3"
          style={{ fontFamily: "'Special Elite', serif" }}
        >
          Clue Found: {label}
        </h3>

        <p className="text-base leading-relaxed mb-6" style={{ color: "#333" }}>
          {explanation}
        </p>

        <button
          onClick={onDismiss}
          autoFocus
          className="px-8 py-3 rounded font-bold text-lg transition-all hover:opacity-90 focus-visible:outline-2"
          style={{
            backgroundColor: "var(--noir-dark)",
            color: "var(--noir-cream)",
            minHeight: "60px",
            minWidth: "160px",
          }}
        >
          Got it, Detective
        </button>
      </div>
    </div>
  );
}
