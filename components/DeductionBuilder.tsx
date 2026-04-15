"use client";

import { useEffect, useState } from "react";
import type { DeductionOption } from "@/lib/case-loader";

interface DeductionBuilderProps {
  options: DeductionOption[];
  isUnlocked: boolean;
  onDeductionFiled: (id: string) => void;
}

export default function DeductionBuilder({
  options,
  isUnlocked,
  onDeductionFiled,
}: DeductionBuilderProps) {
  const [selected, setSelected] = useState<string>("");
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 2000);
    return () => clearTimeout(timer);
  }, [feedback]);

  const handleSubmit = () => {
    const option = options.find((candidate) => candidate.id === selected);
    if (!option) return;

    if (option.is_correct) {
      onDeductionFiled(option.id);
      return;
    }

    setSelected("");
    setFeedback("The evidence points elsewhere, Detective. Keep looking.");
  };

  if (!isUnlocked) {
    return (
      <div
        className="border-2 p-6 text-center font-typewriter"
        style={{
          borderColor: "rgba(200, 169, 110, 0.5)",
          backgroundColor: "rgba(42, 42, 42, 0.74)",
        }}
        aria-label="Deduction locked"
      >
        <p style={{ color: "var(--noir-sepia)", fontSize: "20px" }}>
          Find more clues before filing your report, Detective.
        </p>
      </div>
    );
  }

  return (
    <div
      className="border-2 p-6"
      style={{
        borderColor: "var(--noir-sepia)",
        backgroundColor: "var(--noir-medium)",
      }}
      role="group"
      aria-labelledby="deduction-heading"
    >
      <h3
        id="deduction-heading"
        className="mb-4 font-typewriter text-[28px] font-bold uppercase"
        style={{ color: "var(--noir-sepia)" }}
      >
        File Your Report
      </h3>

      <fieldset className="space-y-3">
        <legend className="sr-only">Choose your deduction</legend>
        {options.map((option) => (
          <label
            key={option.id}
            className="flex cursor-pointer items-start gap-4 border-2 p-4 transition-transform duration-200 hover:-translate-y-0.5"
            style={{
              minHeight: "60px",
              backgroundColor:
                selected === option.id
                  ? "rgba(200, 169, 110, 0.16)"
                  : "rgba(255, 255, 255, 0.05)",
              borderColor:
                selected === option.id ? "var(--noir-sepia)" : "rgba(200, 169, 110, 0.28)",
            }}
          >
            <input
              type="radio"
              name="deduction"
              value={option.id}
              checked={selected === option.id}
              onChange={() => {
                setSelected(option.id);
                setFeedback(null);
              }}
              className="mt-2 h-6 w-6 shrink-0 accent-yellow-700"
              aria-label={option.text}
            />
            <span
              className="leading-relaxed"
              style={{ color: "var(--noir-cream)", fontSize: "20px" }}
            >
              {option.text}
            </span>
          </label>
        ))}
      </fieldset>

      {feedback && (
        <p
          className="mt-4 font-typewriter"
          style={{ color: "var(--noir-sepia)", fontSize: "20px" }}
          role="status"
          aria-live="polite"
        >
          {feedback}
        </p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!selected}
        className="mt-6 w-full font-typewriter font-bold uppercase transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45"
        style={{
          minHeight: "64px",
          backgroundColor: "var(--noir-dark)",
          color: "var(--noir-sepia)",
          border: "2px solid var(--noir-sepia)",
          fontSize: "22px",
        }}
      >
        File Your Report
      </button>
    </div>
  );
}
