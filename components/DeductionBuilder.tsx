"use client";

import { useState } from "react";
import { DeductionOption } from "@/lib/case-loader";

interface DeductionBuilderProps {
  options: DeductionOption[];
  onSubmit: (correct: boolean) => void;
  disabled?: boolean;
}

export default function DeductionBuilder({ options, onSubmit, disabled }: DeductionBuilderProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selected) return;
    const option = options.find((o) => o.id === selected);
    if (!option) return;

    if (option.is_correct) {
      setSubmitted(true);
      onSubmit(true);
    } else {
      setFeedback(
        "The evidence points elsewhere, Detective. Look again."
      );
      setSelected(null);
    }
  };

  if (disabled) {
    return (
      <div
        className="rounded-lg p-6 border-2 text-center"
        style={{ borderColor: "#444", backgroundColor: "var(--noir-medium)", opacity: 0.6 }}
        aria-label="Deduction locked — find more clues first"
      >
        <p className="text-lg" style={{ color: "#888" }}>
          🔒 Find more clues before filing your report
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-lg p-6 border-2"
      style={{ borderColor: "var(--noir-sepia)", backgroundColor: "var(--noir-medium)" }}
      role="group"
      aria-labelledby="deduction-heading"
    >
      <h3
        id="deduction-heading"
        className="text-xl font-bold mb-2"
        style={{ fontFamily: "'Special Elite', serif", color: "var(--noir-sepia)" }}
      >
        File Your Report
      </h3>
      <p className="text-sm mb-5" style={{ color: "#aaa" }}>
        Based on the evidence, what kind of scam is this?
      </p>

      <fieldset className="space-y-3" disabled={submitted}>
        <legend className="sr-only">Choose your deduction</legend>
        {options.map((option) => (
          <label
            key={option.id}
            className="flex items-start gap-4 p-4 rounded-lg cursor-pointer transition-all hover:opacity-90"
            style={{
              backgroundColor: selected === option.id ? "rgba(200, 169, 110, 0.15)" : "rgba(255,255,255,0.05)",
              border: `2px solid ${selected === option.id ? "var(--noir-sepia)" : "#444"}`,
              minHeight: "60px",
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
              className="mt-1 w-5 h-5 cursor-pointer accent-yellow-600"
              aria-label={option.text}
            />
            <span className="text-base leading-relaxed" style={{ color: "var(--noir-cream)" }}>
              {option.text}
            </span>
          </label>
        ))}
      </fieldset>

      {feedback && (
        <p
          className="mt-4 text-base italic"
          style={{ color: "#e07070" }}
          role="alert"
          aria-live="assertive"
        >
          {feedback}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={!selected || submitted}
        className="mt-6 w-full font-bold text-lg rounded-lg transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2"
        style={{
          backgroundColor: "var(--noir-sepia)",
          color: "var(--noir-dark)",
          minHeight: "60px",
          fontFamily: "'Special Elite', serif",
        }}
        aria-disabled={!selected || submitted}
      >
        {submitted ? "✓ Report Filed" : "File Your Report"}
      </button>
    </div>
  );
}
