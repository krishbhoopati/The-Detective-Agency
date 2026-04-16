"use client";

import { motion } from "framer-motion";

interface ScenarioCompleteStampProps {
  scenarioTitle: string;
  onTryAnother: () => void;
}

export function ScenarioCompleteStamp({ scenarioTitle, onTryAnother }: ScenarioCompleteStampProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="absolute bottom-0 left-0 right-0 border-t-4 p-5"
      style={{
        borderColor: "var(--noir-sepia)",
        backgroundColor: "var(--noir-dark)",
      }}
    >
      <motion.div
        initial={{ rotate: -8, scale: 1.2, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.12 }}
        className="mb-3 border-4 px-4 py-2 text-center"
        style={{ borderColor: "var(--noir-sepia)" }}
      >
        <p
          className="font-typewriter text-[22px] font-bold uppercase tracking-widest"
          style={{ color: "var(--noir-sepia)" }}
        >
          ✓ Scenario Complete
        </p>
        <p
          className="font-typewriter text-[18px] mt-1"
          style={{ color: "var(--noir-cream)", opacity: 0.8 }}
        >
          {scenarioTitle}
        </p>
      </motion.div>

      <button
        type="button"
        onClick={onTryAnother}
        className="w-full border-2 py-4 font-typewriter text-[20px] font-bold uppercase transition-opacity hover:opacity-80"
        style={{
          borderColor: "var(--noir-sepia)",
          backgroundColor: "rgba(200,169,110,0.12)",
          color: "var(--noir-sepia)",
        }}
      >
        Try Another Scenario →
      </button>
    </motion.div>
  );
}
