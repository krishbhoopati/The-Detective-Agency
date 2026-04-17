"use client";

import { useEffect, useState } from "react";
import type { LabScenario } from "@/lib/lab-scenarios";
import { SmartphoneSimulator } from "./SmartphoneSimulator";

interface LabPhoneSimulatorProps {
  scenario: LabScenario;
  currentStepIndex: number;
  onTap: (id: string) => void;
  isComplete: boolean;
  onFeedbackChange?: (message: string | null) => void;
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
  onFeedbackChange,
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
    onFeedbackChange?.(wrongTap);
  }, [onFeedbackChange, wrongTap]);

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
      <div className="flex w-full justify-center">
        <SmartphoneSimulator
          screenState={screenState}
          highlightedTargetId={null}
          onTap={() => {}}
        />
      </div>
    );
  }

  return (
    <div className="flex w-full justify-center">
      <div className="flex justify-center">
        <SmartphoneSimulator
          screenState={screenState}
          highlightedTargetId={highlightedTargetId}
          onTap={handleTap}
        />
      </div>
    </div>
  );
}
