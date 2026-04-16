"use client";

import type { MouseEvent } from "react";
import { motion } from "framer-motion";
import type { Hotspot } from "@/lib/case-loader";

interface EvidenceViewerProps {
  evidenceHtml: string;
  hotspots: Hotspot[];
  foundClues: string[];
  onClueFound: (id: string) => void;
  onWrongClick: () => void;
}

function scrubLinks(html: string) {
  return html
    .replace(/<a\b([^>]*)href=(["']).*?\2([^>]*)>/gi, "<span$1$3>")
    .replace(/<\/a>/gi, "</span>");
}

export default function EvidenceViewer({
  evidenceHtml,
  hotspots,
  foundClues,
  onClueFound,
  onWrongClick,
}: EvidenceViewerProps) {
  const handleHotspotClick = (
    event: MouseEvent<HTMLButtonElement>,
    hotspot: Hotspot
  ) => {
    event.stopPropagation();

    if (foundClues.includes(hotspot.id)) {
      onWrongClick();
      return;
    }

    try {
      new Audio("/audio/typewriter.mp3").play().catch(() => {});
    } catch {
      // Audio is decorative. A blocked or missing file should not interrupt play.
    }

    onClueFound(hotspot.id);
  };

  return (
    <div className="w-full">
      <div
        className="relative mx-auto max-w-[580px] overflow-hidden border-2 shadow-2xl"
        style={{
          backgroundColor: "var(--noir-cream)",
          borderColor: "var(--noir-sepia)",
          boxShadow: "0 24px 70px rgba(0, 0, 0, 0.46)",
        }}
        onClick={onWrongClick}
      >
        <div
          className="evidence-document relative p-3"
          dangerouslySetInnerHTML={{ __html: scrubLinks(evidenceHtml) }}
          aria-label="Evidence document"
        />

        {hotspots.map((hotspot) => {
          const isFound = foundClues.includes(hotspot.id);

          return (
            <button
              key={hotspot.id}
              type="button"
              onClick={(event) => handleHotspotClick(event, hotspot)}
              aria-label={
                isFound
                  ? `Clue found: ${hotspot.label}`
                  : "Inspect this part of the evidence"
              }
              aria-pressed={isFound}
              className="absolute cursor-crosshair transition-colors duration-200 focus-visible:outline-2"
              style={{
                top: hotspot.position.top,
                left: hotspot.position.left,
                width: hotspot.position.width,
                height: hotspot.position.height,
                minWidth: "60px",
                minHeight: "60px",
                zIndex: 10,
                backgroundColor: isFound
                  ? "rgba(139, 0, 0, 0.08)"
                  : "rgba(200, 169, 110, 0)",
                border: isFound
                  ? "2px solid rgba(139, 0, 0, 0.55)"
                  : "2px solid transparent",
              }}
            >
              {isFound && (
                <motion.span
                  initial={{ scale: 1.3, opacity: 0, rotate: -10 }}
                  animate={{ scale: 1, opacity: 1, rotate: -7 }}
                  transition={{ type: "spring", stiffness: 360, damping: 18 }}
                  className="pointer-events-none absolute inset-0 flex items-center justify-center font-typewriter text-[22px] font-bold uppercase tracking-widest"
                  style={{ color: "var(--noir-red)" }}
                  aria-hidden="true"
                >
                  ✓ Noted
                </motion.span>
              )}
            </button>
          );
        })}
      </div>

      <p
        className="mt-4 text-center font-bold"
        style={{ fontSize: "22px", color: "var(--noir-cream)" }}
        aria-live="polite"
      >
        Clues Found: {foundClues.length} of {hotspots.length}
      </p>
    </div>
  );
}
