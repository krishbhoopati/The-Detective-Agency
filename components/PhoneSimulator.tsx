"use client";

import { useEffect, useState } from "react";
import type { PhoneSimStep } from "@/lib/case-loader";

interface PhoneSimulatorProps {
  steps: PhoneSimStep[];
  onComplete: () => void;
}

const safeMessages = [
  { name: "Martha", preview: "Lunch Thursday still works for me." },
  { name: "Dr. Patel", preview: "Your appointment reminder: 10:30 AM." },
];

export default function PhoneSimulator({ steps, onComplete }: PhoneSimulatorProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [wrongTap, setWrongTap] = useState<string | null>(null);
  const currentStep = steps[stepIndex];

  useEffect(() => {
    if (!wrongTap) return;
    const timer = setTimeout(() => setWrongTap(null), 1500);
    return () => clearTimeout(timer);
  }, [wrongTap]);

  if (!currentStep) {
    return null;
  }

  const tryTarget = (targetId: string) => {
    if (targetId !== currentStep.target_id) {
      setWrongTap("Not quite, Detective. Keep looking.");
      return;
    }

    if (stepIndex >= steps.length - 1) {
      onComplete();
      return;
    }

    setWrongTap(null);
    setStepIndex((current) => current + 1);
  };

  const renderScreen = () => {
    switch (currentStep.screen) {
      case "home":
        return (
          <div className="grid grid-cols-3 gap-5 p-6 pt-12">
            <PhoneAppButton label="Phone" icon="☎" onClick={() => tryTarget("phone-icon")} />
            <PhoneAppButton
              label="Messages"
              icon="✉"
              highlighted
              onClick={() => tryTarget("messages-icon")}
            />
            <PhoneAppButton label="Photos" icon="▧" onClick={() => tryTarget("photos-icon")} />
            <PhoneAppButton label="Clock" icon="◷" onClick={() => tryTarget("clock-icon")} />
            <PhoneAppButton label="Mail" icon="@" onClick={() => tryTarget("mail-icon")} />
            <PhoneAppButton label="Settings" icon="⚙" onClick={() => tryTarget("settings-icon")} />
          </div>
        );

      case "messages_inbox":
        return (
          <div className="flex h-full flex-col">
            <PhoneHeader
              title="Messages"
              actionLabel="Open message folders"
              action="☰"
              onAction={() => tryTarget("menu-icon")}
            />
            <div className="flex-1 space-y-3 p-4">
              {safeMessages.map((message) => (
                <button
                  key={message.name}
                  type="button"
                  onClick={() => tryTarget(`message-${message.name}`)}
                  className="w-full border-b pb-3 text-left"
                  style={{ borderColor: "#d8d0bd" }}
                >
                  <p className="text-[20px] font-bold">{message.name}</p>
                  <p className="text-[16px]" style={{ color: "#66594a" }}>
                    {message.preview}
                  </p>
                </button>
              ))}
            </div>
          </div>
        );

      case "messages_menu":
        return (
          <div className="flex h-full flex-col">
            <PhoneHeader title="Folders" />
            <div className="p-4">
              {["Inbox", "Unread", "Archived Messages", "Spam"].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() =>
                    tryTarget(
                      option === "Archived Messages"
                        ? "archived-option"
                        : `folder-${option.toLowerCase()}`
                    )
                  }
                  className="mb-3 flex min-h-[60px] w-full items-center justify-between border-2 px-4 text-left text-[20px]"
                  style={{
                    borderColor:
                      option === "Archived Messages"
                        ? "var(--noir-sepia)"
                        : "#d8d0bd",
                    backgroundColor:
                      option === "Archived Messages"
                        ? "rgba(200, 169, 110, 0.22)"
                        : "#fffaf0",
                  }}
                >
                  <span>{option}</span>
                  <span aria-hidden="true">›</span>
                </button>
              ))}
            </div>
          </div>
        );

      case "archived":
        return (
          <div className="flex h-full flex-col">
            <PhoneHeader title="Archived Messages" />
            <div className="p-4">
              <button
                type="button"
                onClick={() => tryTarget("suspicious-message")}
                className="min-h-[92px] w-full border-2 p-4 text-left"
                style={{
                  borderColor: "var(--noir-red)",
                  backgroundColor: "rgba(139, 0, 0, 0.08)",
                }}
              >
                <p className="text-[20px] font-bold">Unknown Number</p>
                <p className="text-[16px]" style={{ color: "#66594a" }}>
                  Grandma, buy gift cards and keep this secret...
                </p>
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex h-full items-center justify-center p-6 text-center text-[20px]">
            Phone screen unavailable.
          </div>
        );
    }
  };

  return (
    <div className="mx-auto w-full max-w-[360px]">
      <div
        className="mb-4 border-2 p-4 text-[20px] leading-relaxed"
        style={{
          backgroundColor: "rgba(200, 169, 110, 0.18)",
          borderColor: "var(--noir-sepia)",
          color: "var(--noir-cream)",
        }}
        role="status"
        aria-live="polite"
      >
        {currentStep.instruction}
      </div>

      <div
        className="mx-auto flex h-[580px] w-[320px] flex-col overflow-hidden rounded-[36px] border-[10px] shadow-2xl"
        style={{
          borderColor: "#111",
          backgroundColor: "#111",
          boxShadow: "0 24px 70px rgba(0, 0, 0, 0.56)",
        }}
      >
        <div className="mx-auto mt-3 h-2 w-20 rounded-full bg-neutral-700" aria-hidden="true" />
        <div
          className="m-3 flex-1 overflow-hidden rounded-[24px]"
          style={{
            backgroundColor: "var(--noir-cream)",
            color: "var(--noir-dark)",
          }}
        >
          {renderScreen()}
        </div>
      </div>

      {wrongTap && (
        <p
          className="mt-4 text-center font-typewriter text-[20px]"
          style={{ color: "var(--noir-sepia)" }}
          role="status"
          aria-live="polite"
        >
          {wrongTap}
        </p>
      )}

      <div className="mt-4 flex justify-center gap-3" aria-label="Phone task progress">
        {steps.map((step, index) => (
          <span
            key={step.step}
            className="h-4 w-4 rounded-full border-2"
            style={{
              borderColor: "var(--noir-sepia)",
              backgroundColor:
                index < stepIndex ? "var(--noir-sepia)" : "transparent",
            }}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}

function PhoneHeader({
  title,
  action,
  actionLabel,
  onAction,
}: {
  title: string;
  action?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div
      className="flex min-h-[64px] items-center justify-between border-b px-4"
      style={{ borderColor: "#d8d0bd", backgroundColor: "#fffaf0" }}
    >
      <h3 className="text-[22px] font-bold">{title}</h3>
      {action && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="flex h-[60px] w-[60px] items-center justify-center text-[28px]"
          aria-label={actionLabel}
        >
          {action}
        </button>
      )}
    </div>
  );
}

function PhoneAppButton({
  label,
  icon,
  highlighted,
  onClick,
}: {
  label: string;
  icon: string;
  highlighted?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[78px] flex-col items-center justify-center gap-1 text-[15px] font-bold"
      style={{ color: "var(--noir-dark)" }}
      aria-label={`Open ${label}`}
    >
      <span
        className="flex h-[58px] w-[58px] items-center justify-center border-2 text-[28px]"
        style={{
          borderColor: highlighted ? "var(--noir-red)" : "var(--noir-sepia)",
          backgroundColor: highlighted ? "rgba(139, 0, 0, 0.12)" : "#fffaf0",
        }}
        aria-hidden="true"
      >
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}
