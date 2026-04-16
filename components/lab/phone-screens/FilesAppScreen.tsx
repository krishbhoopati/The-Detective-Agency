"use client";

import { PhoneHeader } from "./shared";

interface FilesAppScreenProps {
  highlightedTargetId: string | null;
  onTap: (id: string) => void;
}

export function FilesAppScreen({ highlightedTargetId, onTap }: FilesAppScreenProps) {
  const isHighlighted = highlightedTargetId === "tos-document";

  return (
    <div className="flex h-full flex-col">
      <PhoneHeader title="Files" />
      <div className="p-3">
        <p className="mb-3 text-[16px] font-semibold uppercase" style={{ color: "#8b6f3d" }}>
          Recent Documents
        </p>

        {/* ToS document */}
        <button
          type="button"
          onClick={() => onTap("tos-document")}
          className="mb-2 flex min-h-[72px] w-full items-center gap-3 border-2 px-4 text-left"
          style={{
            borderColor: isHighlighted ? "var(--noir-sepia)" : "#d8d0bd",
            backgroundColor: isHighlighted ? "rgba(200, 169, 110, 0.22)" : "#fffaf0",
            color: "var(--noir-dark)",
          }}
          aria-label="Open ServiceAgreement_2024.pdf"
        >
          <span className="text-[32px]" aria-hidden="true">📄</span>
          <div>
            <p className="text-[18px] font-semibold">ServiceAgreement_2024.pdf</p>
            <p className="text-[14px]" style={{ color: "#66594a" }}>Terms of Service · 24 pages · Added today</p>
          </div>
        </button>

        {/* Other files (not interactive) */}
        {[
          { name: "Family_Photo_Album.jpg", sub: "Image · 4.2 MB" },
          { name: "Medicare_Summary_March.pdf", sub: "PDF · 1.1 MB" },
        ].map((f) => (
          <div
            key={f.name}
            className="mb-2 flex min-h-[60px] items-center gap-3 border-2 px-4 opacity-50"
            style={{ borderColor: "#d8d0bd", backgroundColor: "#fffaf0" }}
          >
            <span className="text-[28px]" aria-hidden="true">📄</span>
            <div>
              <p className="text-[16px] font-semibold">{f.name}</p>
              <p className="text-[13px]" style={{ color: "#66594a" }}>{f.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
