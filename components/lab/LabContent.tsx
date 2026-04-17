"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { LAB_SCENARIOS } from "@/lib/lab-scenarios";
import { LabChat } from "@/components/lab/LabChat";
import { LabPhoneSimulator } from "@/components/lab/LabPhoneSimulator";
import { LabScenarioSelector } from "@/components/lab/LabScenarioSelector";
import { ScenarioCompleteStamp } from "@/components/lab/ScenarioCompleteStamp";

interface LabContentProps {
  onClose?: () => void;
}

export function LabContent({ onClose }: LabContentProps) {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("wifi-setup");
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [phoneFeedback, setPhoneFeedback] = useState<string | null>(null);
  const [showStamp, setShowStamp] = useState(false);

  const scenario = LAB_SCENARIOS.find((s) => s.id === selectedScenarioId) ?? LAB_SCENARIOS[0];
  const activeStep = scenario.steps[Math.min(currentStepIndex, scenario.steps.length - 1)];

  const handlePhoneTap = (tappedId: string) => {
    const currentStep = scenario.steps[currentStepIndex];
    if (currentStep.targetId !== tappedId) return;

    const nextIndex = currentStepIndex + 1;
    if (nextIndex >= scenario.steps.length) {
      setCurrentStepIndex(nextIndex);
      setIsComplete(true);
    } else {
      setCurrentStepIndex(nextIndex);
    }
  };

  const handleScenarioComplete = () => {
    setCompletedIds((prev) =>
      prev.includes(selectedScenarioId) ? prev : [...prev, selectedScenarioId]
    );
    setShowStamp(true);
  };

  const handleTryAnother = () => {
    setShowStamp(false);
    document.getElementById("lab-scenario-selector")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScenarioChange = (newId: string) => {
    setSelectedScenarioId(newId);
    setCurrentStepIndex(0);
    setIsComplete(false);
    setPhoneFeedback(null);
    setShowStamp(false);
  };

  return (
    <div
      className="flex h-full min-h-0 w-full flex-col overflow-hidden"
      style={{ backgroundColor: "var(--noir-dark)" }}
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto xl:flex-row xl:overflow-hidden">
        <div
          className="order-2 flex min-h-[360px] flex-1 flex-col overflow-hidden border-t-2 xl:order-1 xl:w-1/2 xl:max-w-[50%] xl:border-r-2 xl:border-t-0"
          style={{ borderColor: "var(--noir-sepia)" }}
        >
          <header
            className="flex flex-wrap items-center gap-3 border-b-2 px-4 py-3 sm:px-5"
            style={{ borderColor: "var(--noir-sepia)", backgroundColor: "var(--noir-dark)" }}
          >
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 border-2 px-4 py-2 font-typewriter text-[18px] uppercase transition-opacity hover:opacity-75"
                style={{
                  borderColor: "var(--noir-sepia)",
                  color: "var(--noir-sepia)",
                  backgroundColor: "transparent",
                }}
                aria-label="Close The Lab"
              >
                ← Desk
              </button>
            )}
            <div>
              <h1
                className="font-typewriter text-[25px] font-bold uppercase tracking-widest"
                style={{ color: "var(--noir-sepia)" }}
              >
                The Lab
              </h1>
              <p
                className="font-typewriter text-[15px]"
                style={{ color: "var(--noir-cream)", opacity: 0.6 }}
              >
                Interactive Digital Literacy Training
              </p>
            </div>
          </header>

          <div id="lab-scenario-selector" className="shrink-0">
            <LabScenarioSelector
              scenarios={LAB_SCENARIOS}
              selectedId={selectedScenarioId}
              onSelect={handleScenarioChange}
              completedIds={completedIds}
            />
          </div>

          <div
            className="shrink-0 border-b-2 px-4 py-4 sm:px-5"
            style={{ borderColor: "var(--noir-sepia)", backgroundColor: "rgba(200, 169, 110, 0.08)" }}
          >
            <div
              className="border-2 p-4 text-[18px] leading-relaxed sm:text-[20px]"
              style={{
                backgroundColor: "rgba(200, 169, 110, 0.18)",
                borderColor: "var(--noir-sepia)",
                color: "var(--noir-cream)",
              }}
              role="status"
              aria-live="polite"
            >
              {activeStep?.targetId === null
                ? "You made it! Read what's on screen."
                : `Step ${Math.min(currentStepIndex, scenario.steps.length - 1) + 1}: ${activeStep.label}`}
            </div>

            <div className="mt-4 flex flex-wrap gap-3" aria-label="Phone task progress">
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

            {phoneFeedback && (
              <p
                className="mt-4 font-typewriter text-[17px] leading-snug sm:text-[19px]"
                style={{ color: "var(--noir-sepia)" }}
                role="status"
                aria-live="polite"
              >
                {phoneFeedback}
              </p>
            )}
          </div>

          <LabChat
            scenario={scenario}
            currentStepIndex={currentStepIndex}
            isComplete={isComplete}
            onScenarioComplete={handleScenarioComplete}
          />
        </div>

        <div
          className="order-1 relative flex min-h-[420px] items-start justify-center overflow-auto px-3 py-4 sm:px-5 xl:order-2 xl:w-1/2 xl:max-w-[50%] xl:items-center xl:overflow-hidden xl:px-6 xl:py-6"
          style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
        >
          <div className="origin-top [transform:scale(0.56)] min-[380px]:[transform:scale(0.62)] min-[440px]:[transform:scale(0.72)] sm:[transform:scale(0.82)] md:[transform:scale(0.94)] xl:[transform:scale(0.98)] 2xl:[transform:scale(1.06)]">
            <LabPhoneSimulator
              scenario={scenario}
              currentStepIndex={currentStepIndex}
              onTap={handlePhoneTap}
              isComplete={isComplete}
              onFeedbackChange={setPhoneFeedback}
            />
          </div>

          <AnimatePresence>
            {showStamp && (
              <ScenarioCompleteStamp
                scenarioTitle={scenario.title}
                onTryAnother={handleTryAnother}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
