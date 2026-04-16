"use client";

import { PhoneHeader } from "./shared";

interface EmailInboxScreenProps {
  highlightedTargetId: string | null;
  onTap: (id: string) => void;
}

export function EmailInboxScreen({ highlightedTargetId, onTap }: EmailInboxScreenProps) {
  const suspiciousHighlighted = highlightedTargetId === "suspicious-email";
  const realHighlighted = highlightedTargetId === "real-email";

  return (
    <div className="flex h-full flex-col">
      <PhoneHeader title="Inbox" />
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {/* Suspicious email */}
        <button
          type="button"
          onClick={() => onTap("suspicious-email")}
          className="w-full border-2 p-3 text-left"
          style={{
            borderColor: suspiciousHighlighted ? "var(--noir-red)" : "rgba(139,0,0,0.35)",
            backgroundColor: suspiciousHighlighted ? "rgba(139,0,0,0.12)" : "rgba(139,0,0,0.05)",
          }}
          aria-label="Open IRS Tax Notice email"
        >
          <div className="flex items-start justify-between mb-1">
            <p className="text-[17px] font-bold" style={{ color: "var(--noir-dark)" }}>
              IRS Tax Notice
            </p>
            <span className="text-[12px]" style={{ color: "#8b0000" }}>⚠ Unread</span>
          </div>
          <p className="text-[14px] font-semibold mb-1" style={{ color: "#8b0000" }}>
            URGENT: Action Required — Tax Penalty Pending
          </p>
          <p className="text-[13px]" style={{ color: "#66594a" }}>
            noreply@irs-gov-alert.net
          </p>
        </button>

        {/* Real email */}
        <button
          type="button"
          onClick={() => onTap("real-email")}
          className="w-full border-2 p-3 text-left"
          style={{
            borderColor: realHighlighted ? "var(--noir-sepia)" : "#d8d0bd",
            backgroundColor: realHighlighted ? "rgba(200,169,110,0.22)" : "#fffaf0",
          }}
          aria-label="Open Medicare Summary email"
        >
          <div className="flex items-start justify-between mb-1">
            <p className="text-[17px] font-bold" style={{ color: "var(--noir-dark)" }}>
              Medicare
            </p>
            <span className="text-[12px]" style={{ color: "#66594a" }}>Today</span>
          </div>
          <p className="text-[14px] font-semibold mb-1" style={{ color: "var(--noir-dark)" }}>
            Your Medicare Summary for March 2026
          </p>
          <p className="text-[13px]" style={{ color: "#66594a" }}>
            summary@medicare.gov
          </p>
        </button>
      </div>
    </div>
  );
}
