"use client";

import { Check, FileText } from "lucide-react";

interface CaseFolderProps {
  case_id: string;
  title: string;
  scam_type: string;
  isCompleted: boolean;
  isTutorial?: boolean;
  onClick: () => void;
}

export default function CaseFolder({
  case_id,
  title,
  scam_type,
  isCompleted,
  isTutorial,
  onClick,
}: CaseFolderProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Open case ${case_id}: ${title}`}
      className="case-folder-button group relative w-full min-h-[80px] text-left transition-transform duration-200 hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline-2"
    >
      <div
        className="absolute left-5 top-0 h-8 w-32 rounded-t-[8px] border-x-2 border-t-2"
        style={{
          backgroundColor: "#d4a858",
          borderColor: "#9b7236",
        }}
        aria-hidden="true"
      />

      <div
        className="case-folder-body relative mt-6 min-h-[164px] border-2 p-5 pt-7"
        style={{
          background:
            "linear-gradient(180deg, #e3bd6e 0%, #c99845 100%)",
          borderColor: "#9b7236",
          color: "var(--noir-dark)",
        }}
      >
        {isTutorial && (
          <span
            className="absolute left-4 top-4 border-2 px-3 py-1 font-typewriter text-[16px] font-bold uppercase"
            style={{
              backgroundColor: "var(--noir-red)",
              borderColor: "var(--noir-red)",
              color: "var(--noir-cream)",
            }}
          >
            Start Here
          </span>
        )}

        {isCompleted && (
          <span
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: "#2f6f46", color: "var(--noir-cream)" }}
            aria-label="Case completed"
          >
            <Check aria-hidden="true" size={26} strokeWidth={3} />
          </span>
        )}

        <div
          className={isCompleted ? "opacity-65" : undefined}
          style={{ paddingTop: isTutorial || isCompleted ? "34px" : 0 }}
        >
          <FileText className="mb-3" size={32} aria-hidden="true" />
          <h3 className="text-[24px] font-bold leading-tight">{title}</h3>
          <p className="mt-2 text-[20px] leading-snug" style={{ color: "#3d2b16" }}>
            {scam_type}
          </p>
        </div>
      </div>
    </button>
  );
}
