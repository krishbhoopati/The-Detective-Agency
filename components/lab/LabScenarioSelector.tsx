"use client";

import type { LabScenario } from "@/lib/lab-scenarios";

interface LabScenarioSelectorProps {
  scenarios: LabScenario[];
  selectedId: string;
  onSelect: (id: string) => void;
  completedIds: string[];
}

export function LabScenarioSelector({
  scenarios,
  selectedId,
  onSelect,
  completedIds,
}: LabScenarioSelectorProps) {
  return (
    <div
      className="border-b-2 overflow-x-auto"
      style={{ borderColor: "var(--noir-sepia)", backgroundColor: "var(--noir-medium, #2a2a2a)" }}
    >
      <div className="flex gap-3 px-4 py-3 min-w-max">
        {scenarios.map((scenario) => {
          const isSelected = scenario.id === selectedId;
          const isCompleted = completedIds.includes(scenario.id);

          return (
            <button
              key={scenario.id}
              type="button"
              onClick={() => onSelect(scenario.id)}
              className="flex min-h-[96px] min-w-[180px] flex-col items-center justify-center gap-1.5 border-2 px-5 py-4 transition-all"
              style={{
                borderColor: isSelected ? "var(--noir-sepia)" : "rgba(200,169,110,0.3)",
                backgroundColor: isSelected
                  ? "rgba(200,169,110,0.15)"
                  : "transparent",
                color: isSelected ? "var(--noir-sepia)" : "var(--noir-cream)",
              }}
              aria-pressed={isSelected}
              aria-label={`${scenario.title}${isCompleted ? " — completed" : ""}`}
            >
              <span className="text-[36px]" aria-hidden="true">
                {scenario.icon}
                {isCompleted && (
                  <span className="ml-1 text-[24px]" style={{ color: "#4a7c59" }}>✓</span>
                )}
              </span>
              <span className="font-typewriter text-[19px] text-center leading-tight whitespace-nowrap">
                {scenario.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
