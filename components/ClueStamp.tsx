"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ClueStampProps {
  label: string;
  explanation: string;
  isVisible: boolean;
  onDismiss?: () => void;
}

export default function ClueStamp({
  label,
  explanation,
  isVisible,
  onDismiss,
}: ClueStampProps) {
  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => onDismiss?.(), 3000);
    return () => clearTimeout(timer);
  }, [isVisible, onDismiss]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.72)" }}
          onClick={onDismiss}
          role="dialog"
          aria-modal="true"
          aria-label={`Clue found: ${label}`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md border-2 p-7 font-typewriter shadow-2xl"
            style={{
              backgroundColor: "var(--noir-dark)",
              borderColor: "var(--noir-sepia)",
              color: "var(--noir-cream)",
            }}
          >
            <p
              className="mb-3 text-[20px] font-bold uppercase leading-snug"
              style={{ color: "var(--noir-sepia)" }}
            >
              {label}
            </p>
            <p className="text-[18px] leading-relaxed">{explanation}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
