"use client";

import { useEffect, useState } from "react";
import type { LabScenario } from "@/lib/lab-scenarios";
import { SmartphoneSimulator } from "./SmartphoneSimulator";

interface LabPhoneSimulatorProps {
  scenario: LabScenario;
  currentStepIndex: number;
  onTap: (id: string) => void;
  isComplete: boolean;
}

const SCREEN_MAP: Record<string, string> = {
  home: "home",
  settings_home: "settings",
  settings_wifi: "wifi_off",
  wifi_connected: "wifi_on",
  files_app: "files",
  document_viewer: "document",
  contacts: "contacts",
  contact_detail: "contact_card",
  video_calling: "video_call",
  email_inbox: "inbox",
  email_open_suspicious: "scam_email",
  email_open_real: "real_email",
  ai_chat_reference: "health_chat",
};

export function LabPhoneSimulator({
  scenario,
  currentStepIndex,
  onTap,
  isComplete,
}: LabPhoneSimulatorProps) {
  const [wrongTap, setWrongTap] = useState<string | null>(null);

  const clampedIndex = Math.min(currentStepIndex, scenario.steps.length - 1);
  const currentStep = scenario.steps[clampedIndex];

  useEffect(() => {
    if (!wrongTap) return;
    const timer = setTimeout(() => setWrongTap(null), 1500);
    return () => clearTimeout(timer);
  }, [wrongTap]);

  useEffect(() => {
    setWrongTap(null);
  }, [currentStepIndex]);

  const handleTap = (targetId: string) => {
    if (isComplete) return;
    if (currentStep.targetId === null) return;
    if (targetId !== currentStep.targetId) {
      setWrongTap(`Not quite — look for: ${currentStep.label}`);
      return;
    }
    setWrongTap(null);
    onTap(targetId);
  };

  const screenState = SCREEN_MAP[currentStep.screenId] ?? "home";
  const highlightedTargetId = isComplete ? null : currentStep.targetId;

  if (scenario.chatOnly) {
    return (
      <div className="flex items-start gap-6">
        <SmartphoneSimulator
          screenState={screenState}
          highlightedTargetId={null}
          onTap={() => {}}
        />
      </div>
    );
  }

  return (
    <div className="flex items-start gap-6">
      <SmartphoneSimulator
        screenState={screenState}
        highlightedTargetId={highlightedTargetId}
        onTap={handleTap}
      />

      {/* Right panel: step info, progress, wrong-tap */}
      <div className="flex flex-col gap-5 pt-2" style={{ width: 220 }}>
        <div
          className="border-2 p-4 text-[22px] leading-relaxed"
          style={{
            backgroundColor: "rgba(200, 169, 110, 0.18)",
            borderColor: "var(--noir-sepia)",
            color: "var(--noir-cream)",
          }}
          role="status"
          aria-live="polite"
        >
          {currentStep.targetId === null
            ? "You made it! Read what's on screen."
            : `Step ${clampedIndex + 1}: ${currentStep.label}`}
        </div>

        <div className="flex flex-wrap gap-3" aria-label="Phone task progress">
          {scenario.steps.map((step, index) => (
            <span
              key={step.screenId + step.label}
              className="h-5 w-5 rounded-full border-2"
              style={{
                borderColor: "var(--noir-sepia)",
                backgroundColor:
                  index < currentStepIndex ? "var(--noir-sepia)" : "transparent",
              }}
              aria-hidden="true"
              title={step.label}
            />
          ))}
        </div>

        {wrongTap && (
          <p
            className="font-typewriter text-[20px] leading-snug"
            style={{ color: "var(--noir-sepia)" }}
            role="status"
            aria-live="polite"
          >
            {wrongTap}
          </p>
        )}
      </div>
    </div>
  );
}
