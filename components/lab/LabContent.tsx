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
  const [showStamp, setShowStamp] = useState(false);

  const scenario = LAB_SCENARIOS.find((s) => s.id === selectedScenarioId) ?? LAB_SCENARIOS[0];

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
    setShowStamp(false);
  };

  return (
    <div
      className="flex w-full h-screen overflow-hidden"
      style={{ backgroundColor: "var(--noir-dark)" }}
    >
      {/* Left column: header + scenario selector + chat */}
      <div
        className="flex flex-col border-r-2 overflow-hidden"
        style={{ borderColor: "var(--noir-sepia)", width: "42%" }}
      >
        {/* Header */}
        <header
          className="flex items-center gap-4 border-b-2 px-5 py-4 shrink-0"
          style={{ borderColor: "var(--noir-sepia)", backgroundColor: "var(--noir-dark)" }}
        >
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="border-2 px-4 py-2 font-typewriter text-[18px] uppercase transition-opacity hover:opacity-75 shrink-0"
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
            <p className="font-typewriter text-[15px]" style={{ color: "var(--noir-cream)", opacity: 0.6 }}>
              Interactive Digital Literacy Training
            </p>
          </div>
        </header>

        {/* Scenario selector */}
        <div id="lab-scenario-selector" className="shrink-0">
          <LabScenarioSelector
            scenarios={LAB_SCENARIOS}
            selectedId={selectedScenarioId}
            onSelect={handleScenarioChange}
            completedIds={completedIds}
          />
        </div>

        {/* Chat — fills remaining space */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <LabChat
            scenario={scenario}
            currentStepIndex={currentStepIndex}
            isComplete={isComplete}
            onScenarioComplete={handleScenarioComplete}
          />
        </div>
      </div>

      {/* Right column: phone takes full height */}
      <div
        className="relative flex flex-col items-center justify-center overflow-hidden"
        style={{ width: "58%", backgroundColor: "rgba(0,0,0,0.3)" }}
      >
        <div style={{ transform: "scale(0.98)", transformOrigin: "center center" }}>
          <LabPhoneSimulator
            scenario={scenario}
            currentStepIndex={currentStepIndex}
            onTap={handlePhoneTap}
            isComplete={isComplete}
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
  );
}
