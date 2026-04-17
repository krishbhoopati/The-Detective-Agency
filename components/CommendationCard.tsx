"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface CommendationCardProps {
  commendation: string;
  isLoading: boolean;
  caseTitle: string;
  onAddToArchive: () => void;
  onReturnToCases: () => void;
}

export default function CommendationCard({
  commendation,
  isLoading,
  caseTitle,
  onAddToArchive,
  onReturnToCases,
}: CommendationCardProps) {
  const [typedText, setTypedText] = useState("");
  const [isTyped, setIsTyped] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    setTypedText("");
    setIsTyped(false);

    let index = 0;
    const timer = setInterval(() => {
      if (index >= commendation.length) {
        clearInterval(timer);
        setIsTyped(true);
        return;
      }

      setTypedText((current) => current + commendation[index]);
      index += 1;
    }, 40);

    return () => clearInterval(timer);
  }, [commendation, isLoading]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4"
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(200,169,110,0.12), transparent 52%), var(--noir-dark)",
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Case commendation"
    >
      {isLoading ? (
        <motion.p
          animate={{ opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="font-typewriter text-[24px] sm:text-[28px]"
          style={{ color: "var(--noir-sepia)" }}
          role="status"
          aria-live="polite"
        >
          Analyzing evidence...
        </motion.p>
      ) : (
        <div
          className="w-full max-w-2xl border-2 p-6 text-center sm:p-8"
          style={{
            backgroundColor: "var(--noir-paper)",
            borderColor: "var(--noir-sepia)",
            color: "var(--noir-dark)",
            boxShadow: "0 30px 90px rgba(0, 0, 0, 0.62)",
          }}
        >
          <motion.div
            initial={{ rotate: -12, scale: 1.4, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 230, damping: 14 }}
            className="mx-auto mb-5 inline-block border-4 px-6 py-3 font-typewriter text-[26px] font-bold uppercase tracking-widest sm:text-[32px]"
            style={{ borderColor: "var(--noir-red)", color: "var(--noir-red)" }}
          >
            CASE CLOSED
          </motion.div>

          <h2 className="mb-6 text-[24px] font-bold leading-tight sm:text-[28px]">{caseTitle}</h2>

          <div
            className="min-h-[140px] border-l-4 p-5 text-left text-[19px] italic leading-relaxed sm:text-[22px]"
            style={{
              borderLeftColor: "var(--noir-sepia)",
              backgroundColor: "rgba(200, 169, 110, 0.14)",
              color: "var(--text-on-paper)",
            }}
            aria-live="polite"
          >
            {typedText}
            {!isTyped && (
              <span aria-hidden="true" style={{ borderRight: "2px solid var(--noir-dark)" }}>
                &nbsp;
              </span>
            )}
          </div>

          {isTyped && (
            <div className="mt-7">
              <button
                type="button"
                onClick={onAddToArchive}
                className="w-full font-typewriter text-[19px] font-bold uppercase transition-transform duration-200 hover:-translate-y-0.5 sm:text-[22px]"
                style={{
                  minHeight: "64px",
                  backgroundColor: "var(--noir-sepia)",
                  color: "var(--noir-dark)",
                }}
              >
                Add to Archive
              </button>

              <button
                type="button"
                onClick={onReturnToCases}
                className="mt-4 inline-flex min-h-[56px] items-center justify-center px-3 text-[18px] underline-offset-4 hover:underline sm:min-h-[60px] sm:text-[20px]"
                style={{ color: "var(--text-on-paper-secondary)" }}
              >
                Return to Cases
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
