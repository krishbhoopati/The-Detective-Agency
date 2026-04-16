"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { LAB_SCENARIOS } from "@/lib/lab-scenarios";
import { LabChat } from "@/components/lab/LabChat";
import { LabPhoneSimulator } from "@/components/lab/LabPhoneSimulator";
import { LabScenarioSelector } from "@/components/lab/LabScenarioSelector";
import { ScenarioCompleteStamp } from "@/components/lab/ScenarioCompleteStamp";

export default function LabPage() {
  const router = useRouter();

  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("wifi-setup");
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [showStamp, setShowStamp] = useState(false);

  const scenario = LAB_SCENARIOS.find((s) => s.id === selectedScenarioId)!;

  const handlePhoneTap = (tappedId: string) => {
    const currentStep = scenario.steps[currentStepIndex];
    if (currentStep.targetId !== tappedId) return; // wrong tap — LabPhoneSimulator handles feedback

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
    // Scroll selector into view
    document.getElementById("scenario-selector")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScenarioChange = (newId: string) => {
    setSelectedScenarioId(newId);
    setCurrentStepIndex(0);
    setIsComplete(false);
    setShowStamp(false);
  };

  return (
    <main
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: "var(--noir-dark)" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-20 flex items-center gap-4 border-b-2 px-4 py-3"
        style={{ borderColor: "var(--noir-sepia)", backgroundColor: "var(--noir-dark)" }}
      >
        <button
          type="button"
          onClick={() => router.push("/")}
          className="border-2 px-3 py-2 font-typewriter text-[14px] uppercase transition-opacity hover:opacity-75"
          style={{
            borderColor: "var(--noir-sepia)",
            color: "var(--noir-sepia)",
            backgroundColor: "transparent",
          }}
          aria-label="Back to Detective's Desk"
        >
          ← Desk
        </button>
        <div>
          <h1
            className="font-typewriter text-[20px] font-bold uppercase tracking-widest"
            style={{ color: "var(--noir-sepia)" }}
          >
            The Lab
          </h1>
          <p className="font-typewriter text-[11px]" style={{ color: "var(--noir-cream)", opacity: 0.6 }}>
            Interactive Digital Literacy Training
          </p>
        </div>
      </header>

      {/* Scenario selector */}
      <div id="scenario-selector">
        <LabScenarioSelector
          scenarios={LAB_SCENARIOS}
          selectedId={selectedScenarioId}
          onSelect={handleScenarioChange}
          completedIds={completedIds}
        />
      </div>

      {/* Split-screen body */}
      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 160px)" }}>
        {/* Left: Chat */}
        <div
          className="flex w-full flex-col border-r-2 md:w-[45%]"
          style={{ borderColor: "var(--noir-sepia)" }}
        >
          <LabChat
            scenario={scenario}
            currentStepIndex={currentStepIndex}
            isComplete={isComplete}
            onScenarioComplete={handleScenarioComplete}
          />
        </div>

        {/* Right: Phone simulator */}
        <div className="relative hidden w-[55%] items-center justify-center overflow-y-auto py-8 md:flex">
          <LabPhoneSimulator
            scenario={scenario}
            currentStepIndex={currentStepIndex}
            onTap={handlePhoneTap}
            isComplete={isComplete}
          />

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

      {/* Mobile: Phone below chat */}
      <div
        className="flex flex-col items-center border-t-2 px-4 py-6 md:hidden"
        style={{ borderColor: "var(--noir-sepia)" }}
      >
        <p
          className="mb-4 font-typewriter text-[14px] uppercase"
          style={{ color: "var(--noir-sepia)" }}
        >
          Simulated Phone
        </p>
        <div className="relative w-full">
          <LabPhoneSimulator
            scenario={scenario}
            currentStepIndex={currentStepIndex}
            onTap={handlePhoneTap}
            isComplete={isComplete}
          />
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
    </main>
  );
}
