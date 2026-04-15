"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface CommendationCardProps {
  text: string;
  caseTitle: string;
  learningSummary: string;
  isLoading?: boolean;
}

export default function CommendationCard({ text, caseTitle, learningSummary, isLoading }: CommendationCardProps) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
        return;
      }
      setDisplayed((prev) => prev + text[i]);
      i++;
    }, 28);
    return () => clearInterval(interval);
  }, [text]);

  if (isLoading) {
    return (
      <div
        className="rounded-lg p-8 border-2 max-w-2xl mx-auto text-center"
        style={{ backgroundColor: "var(--noir-paper)", borderColor: "var(--noir-sepia)", color: "var(--noir-dark)" }}
        role="status"
        aria-live="polite"
        aria-label="Generating commendation"
      >
        <p
          className="text-2xl italic animate-pulse"
          style={{ fontFamily: "'Special Elite', serif", color: "var(--noir-dark)" }}
        >
          Analyzing evidence…
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-lg p-8 border-2 max-w-2xl mx-auto"
      style={{ backgroundColor: "var(--noir-paper)", borderColor: "var(--noir-sepia)", color: "var(--noir-dark)" }}
      role="article"
      aria-label="Case commendation"
    >
      {/* Red stamp header */}
      <div className="text-center mb-6">
        <div
          className="stamp-animation inline-block border-4 px-8 py-3 text-2xl font-bold tracking-widest rotate-[-4deg] mb-4"
          style={{ borderColor: "var(--noir-red)", color: "var(--noir-red)", fontFamily: "'Special Elite', serif" }}
          aria-label="Case closed stamp"
        >
          CASE CLOSED
        </div>
        <h2
          className="text-2xl font-bold mt-2"
          style={{ fontFamily: "'Special Elite', serif", color: "var(--noir-dark)" }}
        >
          {caseTitle}
        </h2>
      </div>

      {/* Typewriter commendation */}
      <div
        className="text-lg leading-relaxed mb-6 p-4 rounded border-l-4 min-h-[80px]"
        style={{
          borderLeftColor: "var(--noir-sepia)",
          backgroundColor: "rgba(200, 169, 110, 0.1)",
          fontStyle: "italic",
          color: "#222",
        }}
        aria-live="polite"
        aria-label="Commendation text"
      >
        {displayed}
        {!done && (
          <span aria-hidden="true" style={{ borderRight: "2px solid var(--noir-dark)" }}>
            &nbsp;
          </span>
        )}
      </div>

      {/* Learning summary */}
      <div
        className="rounded p-4 mb-6 text-base"
        style={{ backgroundColor: "rgba(0,0,0,0.08)", color: "#333" }}
      >
        <p className="font-bold mb-1" style={{ color: "var(--noir-dark)" }}>
          Key Takeaway:
        </p>
        <p>{learningSummary}</p>
      </div>

      {/* Actions */}
      {done && (
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/cases"
            className="flex-1 text-center py-4 rounded-lg font-bold text-lg transition-all hover:opacity-90 focus-visible:outline-2"
            style={{
              backgroundColor: "var(--noir-dark)",
              color: "var(--noir-cream)",
              minHeight: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Special Elite', serif",
            }}
          >
            Return to Cases
          </Link>
          <Link
            href="/archive"
            className="flex-1 text-center py-4 rounded-lg font-bold text-lg transition-all hover:opacity-90 focus-visible:outline-2"
            style={{
              backgroundColor: "var(--noir-sepia)",
              color: "var(--noir-dark)",
              minHeight: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Special Elite', serif",
            }}
          >
            View Archive
          </Link>
        </div>
      )}
    </div>
  );
}
