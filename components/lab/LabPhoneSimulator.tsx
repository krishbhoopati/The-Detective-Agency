"use client";

import { useEffect, useState } from "react";
import type { LabScenario } from "@/lib/lab-scenarios";
import { HomeScreen } from "./phone-screens/HomeScreen";
import { SettingsHomeScreen } from "./phone-screens/SettingsHomeScreen";
import { SettingsNetworkScreen } from "./phone-screens/SettingsNetworkScreen";
import { SettingsWifiScreen } from "./phone-screens/SettingsWifiScreen";
import { WifiConnectedScreen } from "./phone-screens/WifiConnectedScreen";
import { FilesAppScreen } from "./phone-screens/FilesAppScreen";
import { DocumentViewerScreen } from "./phone-screens/DocumentViewerScreen";
import { ContactsScreen } from "./phone-screens/ContactsScreen";
import { ContactDetailScreen } from "./phone-screens/ContactDetailScreen";
import { VideoCallingScreen } from "./phone-screens/VideoCallingScreen";
import { EmailInboxScreen } from "./phone-screens/EmailInboxScreen";
import { EmailOpenScreen } from "./phone-screens/EmailOpenScreen";
import { AiChatReferenceScreen } from "./phone-screens/AiChatReferenceScreen";

interface LabPhoneSimulatorProps {
  scenario: LabScenario;
  currentStepIndex: number;
  onTap: (id: string) => void;
  isComplete: boolean;
}

export function LabPhoneSimulator({
  scenario,
  currentStepIndex,
  onTap,
  isComplete,
}: LabPhoneSimulatorProps) {
  const [wrongTap, setWrongTap] = useState<string | null>(null);

  const clampedIndex = Math.min(currentStepIndex, scenario.steps.length - 1);
  const currentStep = scenario.steps[clampedIndex];

  // Clear wrong-tap after 1500ms
  useEffect(() => {
    if (!wrongTap) return;
    const timer = setTimeout(() => setWrongTap(null), 1500);
    return () => clearTimeout(timer);
  }, [wrongTap]);

  // Reset wrong-tap when step changes
  useEffect(() => {
    setWrongTap(null);
  }, [currentStepIndex]);

  const handleTap = (targetId: string) => {
    if (isComplete) return;
    if (currentStep.targetId === null) return; // final screen, no tap needed
    if (targetId !== currentStep.targetId) {
      setWrongTap(`Not quite — look for: ${currentStep.label}`);
      return;
    }
    setWrongTap(null);
    onTap(targetId);
  };

  const renderScreen = () => {
    const screenId = currentStep.screenId;
    const highlightedTargetId = isComplete ? null : currentStep.targetId;

    switch (screenId) {
      case "home":
        return <HomeScreen highlightedTargetId={highlightedTargetId} onTap={handleTap} />;
      case "settings_home":
        return <SettingsHomeScreen highlightedTargetId={highlightedTargetId} onTap={handleTap} />;
      case "settings_network":
        return <SettingsNetworkScreen highlightedTargetId={highlightedTargetId} onTap={handleTap} />;
      case "settings_wifi":
        return <SettingsWifiScreen highlightedTargetId={highlightedTargetId} onTap={handleTap} />;
      case "wifi_connected":
        return <WifiConnectedScreen />;
      case "files_app":
        return <FilesAppScreen highlightedTargetId={highlightedTargetId} onTap={handleTap} />;
      case "document_viewer":
        return <DocumentViewerScreen />;
      case "contacts":
        return <ContactsScreen highlightedTargetId={highlightedTargetId} onTap={handleTap} />;
      case "contact_detail":
        return <ContactDetailScreen highlightedTargetId={highlightedTargetId} onTap={handleTap} />;
      case "video_calling":
        return <VideoCallingScreen />;
      case "email_inbox":
        return <EmailInboxScreen highlightedTargetId={highlightedTargetId} onTap={handleTap} />;
      case "email_open_suspicious":
        return (
          <EmailOpenScreen
            variant="suspicious"
            highlightedTargetId={highlightedTargetId}
            onTap={handleTap}
          />
        );
      case "email_open_real":
        return (
          <EmailOpenScreen
            variant="real"
            highlightedTargetId={highlightedTargetId}
            onTap={handleTap}
          />
        );
      case "ai_chat_reference":
        return <AiChatReferenceScreen />;
      default:
        return (
          <div className="flex h-full items-center justify-center p-6 text-center text-[20px]">
            Screen unavailable.
          </div>
        );
    }
  };

  // chatOnly scenarios don't show phone shell
  if (scenario.chatOnly) {
    return (
      <div className="mx-auto w-full max-w-[360px]">
        <div
          className="mb-4 border-2 p-4 text-[18px] leading-relaxed text-center"
          style={{
            backgroundColor: "rgba(200, 169, 110, 0.18)",
            borderColor: "var(--noir-sepia)",
            color: "var(--noir-cream)",
          }}
        >
          Reference: Example AI Health Conversations
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
            style={{ backgroundColor: "var(--noir-cream)", color: "var(--noir-dark)" }}
          >
            {renderScreen()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[360px]">
      {/* Step instruction */}
      <div
        className="mb-4 border-2 p-4 text-[18px] leading-relaxed"
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

      {/* Phone shell */}
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
          style={{ backgroundColor: "var(--noir-cream)", color: "var(--noir-dark)" }}
        >
          {renderScreen()}
        </div>
      </div>

      {/* Wrong-tap feedback */}
      {wrongTap && (
        <p
          className="mt-4 text-center font-typewriter text-[18px]"
          style={{ color: "var(--noir-sepia)" }}
          role="status"
          aria-live="polite"
        >
          {wrongTap}
        </p>
      )}

      {/* Step-dot progress bar */}
      <div className="mt-4 flex justify-center gap-3" aria-label="Phone task progress">
        {scenario.steps.map((step, index) => (
          <span
            key={step.screenId + step.label}
            className="h-4 w-4 rounded-full border-2"
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
    </div>
  );
}
