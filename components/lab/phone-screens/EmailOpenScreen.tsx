"use client";

import { PhoneHeader } from "./shared";

interface EmailOpenScreenProps {
  variant: "suspicious" | "real";
  highlightedTargetId: string | null;
  onTap: (id: string) => void;
}

const SUSPICIOUS_EMAIL = {
  subject: "URGENT: Action Required — Tax Penalty Pending",
  from: "noreply@irs-gov-alert.net",
  fromDisplay: "IRS Tax Notice",
  fromColor: "#8b0000" as const,
  domainNote: "⚠ Not the real irs.gov domain",
  body: `Dear Taxpayer,

Our records show an outstanding tax liability on your account. Failure to respond within 24 hours will result in penalties and possible legal action.

CLICK BELOW TO RESOLVE IMMEDIATELY:`,
  hasButton: true,
  buttonLabel: "Resolve Tax Issue Now",
};

const REAL_EMAIL = {
  subject: "Your Medicare Summary for March 2026",
  from: "summary@medicare.gov",
  fromDisplay: "Medicare",
  fromColor: "#4a7c59" as const,
  domainNote: "✓ Verified: medicare.gov",
  body: `Dear Margaret,

Here is your monthly summary of Medicare benefits for March 2026.

Your Part B coverage is current. No action is required at this time.

You can review your full benefits online at medicare.gov/mybluebook.

Questions? Call 1-800-MEDICARE (1-800-633-4227).`,
  hasButton: false,
  buttonLabel: "",
};

export function EmailOpenScreen({ variant, highlightedTargetId, onTap }: EmailOpenScreenProps) {
  const email = variant === "suspicious" ? SUSPICIOUS_EMAIL : REAL_EMAIL;
  const backHighlighted = highlightedTargetId === "back-btn";

  return (
    <div className="flex h-full flex-col">
      <PhoneHeader
        title="Email"
        action="←"
        actionLabel="Go back to inbox"
        onAction={() => onTap("back-btn")}
      />

      {/* Back hint for suspicious email */}
      {variant === "suspicious" && (
        <div
          className="mx-3 mt-2 border-2 px-3 py-2 text-[14px]"
          style={{
            borderColor: backHighlighted ? "var(--noir-sepia)" : "#d8d0bd",
            backgroundColor: backHighlighted ? "rgba(200,169,110,0.22)" : "transparent",
            color: "var(--noir-dark)",
          }}
        >
          After reading, tap ← to go back and read the other email.
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4">
        {/* Subject */}
        <p
          className="mb-2 text-[17px] font-bold leading-snug"
          style={{ color: "var(--noir-dark)" }}
        >
          {email.subject}
        </p>

        {/* Sender */}
        <div
          className="mb-3 border-2 px-3 py-2"
          style={{
            borderColor: email.fromColor,
            backgroundColor:
              variant === "suspicious"
                ? "rgba(139,0,0,0.06)"
                : "rgba(74,124,89,0.06)",
          }}
        >
          <p className="text-[15px] font-bold" style={{ color: email.fromColor }}>
            From: {email.fromDisplay}
          </p>
          <p className="text-[13px]" style={{ color: email.fromColor }}>
            {email.from}
          </p>
          <p className="mt-1 text-[13px] font-semibold" style={{ color: email.fromColor }}>
            {email.domainNote}
          </p>
        </div>

        {/* Body */}
        <p
          className="whitespace-pre-line text-[15px] leading-relaxed mb-4"
          style={{ color: "var(--noir-dark)" }}
        >
          {email.body}
        </p>

        {/* Scam button (suspicious only) */}
        {email.hasButton && (
          <button
            type="button"
            onClick={() => {/* intentionally non-functional */}}
            className="w-full border-2 py-4 text-[16px] font-bold uppercase"
            style={{
              borderColor: "#8b0000",
              backgroundColor: "rgba(139,0,0,0.12)",
              color: "#8b0000",
            }}
            aria-label="Do not click — this is a scam link"
          >
            ⚠ {email.buttonLabel}
          </button>
        )}
      </div>
    </div>
  );
}
