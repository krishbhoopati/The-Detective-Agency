"use client";

import { PhoneHeader } from "./shared";

interface ContactDetailScreenProps {
  highlightedTargetId: string | null;
  onTap: (id: string) => void;
}

export function ContactDetailScreen({ highlightedTargetId, onTap }: ContactDetailScreenProps) {
  const isHighlighted = highlightedTargetId === "video-call-btn";

  return (
    <div className="flex h-full flex-col">
      <PhoneHeader title="Contact" />
      <div className="flex flex-col items-center pt-6 pb-4 px-4">
        {/* Avatar */}
        <div
          className="mb-3 flex h-[80px] w-[80px] items-center justify-center rounded-full text-[32px] font-bold"
          style={{ backgroundColor: "var(--noir-sepia)", color: "#fff" }}
          aria-hidden="true"
        >
          S
        </div>
        <p className="text-[22px] font-bold mb-1" style={{ color: "var(--noir-dark)" }}>
          Sarah (granddaughter)
        </p>
        <p className="text-[16px] mb-6" style={{ color: "#66594a" }}>Family</p>

        {/* Action buttons */}
        <div className="flex w-full gap-3">
          <button
            type="button"
            onClick={() => onTap("call-btn")}
            className="flex flex-1 flex-col items-center gap-1 border-2 py-4 text-[28px]"
            style={{ borderColor: "#d8d0bd", backgroundColor: "#fffaf0", color: "var(--noir-dark)" }}
            aria-label="Call Sarah"
          >
            <span>☎</span>
            <span className="text-[13px] font-semibold">Call</span>
          </button>

          <button
            type="button"
            onClick={() => onTap("video-call-btn")}
            className="flex flex-1 flex-col items-center gap-1 border-2 py-4 text-[28px]"
            style={{
              borderColor: isHighlighted ? "var(--noir-sepia)" : "#d8d0bd",
              backgroundColor: isHighlighted ? "rgba(200, 169, 110, 0.22)" : "#fffaf0",
              color: "var(--noir-dark)",
            }}
            aria-label="Video call Sarah"
          >
            <span>📹</span>
            <span className="text-[13px] font-semibold">Video</span>
          </button>

          <button
            type="button"
            onClick={() => onTap("message-btn")}
            className="flex flex-1 flex-col items-center gap-1 border-2 py-4 text-[28px]"
            style={{ borderColor: "#d8d0bd", backgroundColor: "#fffaf0", color: "var(--noir-dark)" }}
            aria-label="Message Sarah"
          >
            <span>✉</span>
            <span className="text-[13px] font-semibold">Message</span>
          </button>
        </div>
      </div>
    </div>
  );
}
