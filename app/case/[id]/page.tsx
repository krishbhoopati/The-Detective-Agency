"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getCaseById, CaseData, Hotspot } from "@/lib/case-loader";
import { saveCompletedCase } from "@/lib/archive";
import EvidenceViewer from "@/components/EvidenceViewer";
import ClueStamp from "@/components/ClueStamp";
import DeductionBuilder from "@/components/DeductionBuilder";
import CommendationCard from "@/components/CommendationCard";
import InterrogationChat from "@/components/InterrogationChat";
import AudioController from "@/components/AudioController";

type Step = "briefing" | "investigation" | "deduction" | "interrogation" | "commendation";

export default function CasePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [step, setStep] = useState<Step>("briefing");
  const [foundClues, setFoundClues] = useState<string[]>([]);
  const [activeStamp, setActiveStamp] = useState<Hotspot | null>(null);
  const [commendation, setCommendation] = useState("");
  const [commendationLoading, setCommendationLoading] = useState(false);
  const [inconsistenciesFound, setInconsistenciesFound] = useState(0);
  const [inconsistencyLabels, setInconsistencyLabels] = useState<string[]>([]);
  const [inactivityModal, setInactivityModal] = useState(false);

  const startTimeRef = useRef<number>(Date.now());
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load case data
  useEffect(() => {
    if (!id) return;
    const data = getCaseById(id);
    if (!data) {
      router.push("/cases");
      return;
    }
    setCaseData(data);
    startTimeRef.current = Date.now();
  }, [id, router]);

  // 5-minute inactivity prompt
  useEffect(() => {
    const resetTimer = () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = setTimeout(() => setInactivityModal(true), 5 * 60 * 1000);
    };

    const events = ["click", "keypress", "touchstart", "mousemove"];
    events.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, []);

  const handleClueFound = (hotspot: Hotspot) => {
    if (foundClues.includes(hotspot.id)) return;
    setFoundClues((prev) => [...prev, hotspot.id]);
    setActiveStamp(hotspot);
  };

  const handleDeductionCorrect = () => {
    if (!caseData) return;
    if (caseData.has_interrogation) {
      setStep("interrogation");
    } else {
      triggerCommendation();
    }
  };

  const triggerCommendation = async () => {
    if (!caseData) return;
    setCommendationLoading(true);
    setStep("commendation");

    const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const clueLabels = caseData.hotspots
      .filter((h) => foundClues.includes(h.id))
      .map((h) => h.label);

    try {
      const res = await fetch("/api/commendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          case_id: caseData.id,
          case_title: caseData.title,
          scam_type: caseData.scam_type,
          clues_found: clueLabels,
          total_clues: caseData.hotspots.length,
          time_elapsed_seconds: elapsed,
        }),
      });
      const data = await res.json();
      setCommendation(data.commendation ?? "");

      // Save to archive
      saveCompletedCase({
        case_id: caseData.id,
        case_title: caseData.title,
        scam_type: caseData.scam_type,
        commendation: data.commendation ?? "",
        completed_at: new Date().toISOString(),
        clues_found: foundClues.length,
      });
    } catch {
      const fallback =
        "Detective, your work on this case has been exemplary. The Agency is proud to have you on our roster. Case closed.";
      setCommendation(fallback);
      saveCompletedCase({
        case_id: caseData.id,
        case_title: caseData.title,
        scam_type: caseData.scam_type,
        commendation: fallback,
        completed_at: new Date().toISOString(),
        clues_found: foundClues.length,
      });
    } finally {
      setCommendationLoading(false);
    }
  };

  const handleInterrogationInconsistency = (label: string) => {
    setInconsistenciesFound((prev) => prev + 1);
    setInconsistencyLabels((prev) => [...prev, label]);
  };

  if (!caseData) {
    return (
      <main
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--noir-dark)" }}
        aria-label="Loading case"
      >
        <p className="text-xl" style={{ color: "var(--noir-sepia)" }}>
          Opening case file…
        </p>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen px-4 py-10"
      style={{ backgroundColor: "var(--noir-dark)" }}
    >
      <AudioController />

      {/* Inactivity modal */}
      {inactivityModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
          role="dialog"
          aria-modal="true"
          aria-label="Still investigating?"
        >
          <div
            className="max-w-sm w-full rounded-lg p-8 text-center"
            style={{ backgroundColor: "var(--noir-paper)", color: "var(--noir-dark)" }}
          >
            <p className="text-2xl mb-3" style={{ fontFamily: "'Special Elite', serif" }}>
              Still on the case?
            </p>
            <p className="text-base mb-6" style={{ color: "#555" }}>
              Take all the time you need, Detective. The case will be here when you&apos;re ready.
            </p>
            <button
              autoFocus
              onClick={() => setInactivityModal(false)}
              className="px-8 py-3 rounded-lg font-bold text-lg transition-all hover:opacity-90 focus-visible:outline-2"
              style={{ backgroundColor: "var(--noir-dark)", color: "var(--noir-cream)", minHeight: "60px" }}
            >
              Continue Investigating
            </button>
          </div>
        </div>
      )}

      {/* Clue stamp modal */}
      {activeStamp && (
        <ClueStamp
          label={activeStamp.label}
          explanation={activeStamp.explanation}
          onDismiss={() => setActiveStamp(null)}
        />
      )}

      <div className="max-w-2xl mx-auto">
        {/* Back link */}
        <Link
          href="/cases"
          className="inline-flex items-center gap-2 text-base mb-8 hover:underline focus-visible:outline-2 rounded"
          style={{ color: "var(--noir-sepia)" }}
        >
          ← Case Files
        </Link>

        {/* Case header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span
              className="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded"
              style={{ backgroundColor: "rgba(200,169,110,0.15)", color: "var(--noir-sepia)", border: "1px solid var(--noir-sepia)" }}
            >
              {caseData.scam_type}
            </span>
            <span className="text-xs" style={{ color: "#666" }}>
              {caseData.difficulty}
            </span>
          </div>
          <h1
            className="text-3xl sm:text-4xl font-bold"
            style={{ fontFamily: "'Special Elite', serif", color: "var(--noir-cream)" }}
          >
            {caseData.title}
          </h1>
        </div>

        {/* ─── STEP: BRIEFING ─── */}
        {step === "briefing" && (
          <section aria-label="Case briefing">
            <div
              className="rounded-lg p-6 mb-8 border-l-4 text-lg leading-relaxed"
              style={{
                backgroundColor: "var(--noir-medium)",
                borderLeftColor: "var(--noir-sepia)",
                color: "var(--noir-cream)",
              }}
            >
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--noir-sepia)" }}>
                Case Briefing
              </p>
              <p>{caseData.briefing}</p>
            </div>

            <button
              onClick={() => setStep("investigation")}
              className="w-full py-5 rounded-lg text-xl font-bold transition-all hover:opacity-90 focus-visible:outline-2"
              style={{
                backgroundColor: "var(--noir-sepia)",
                color: "var(--noir-dark)",
                minHeight: "60px",
                fontFamily: "'Special Elite', serif",
              }}
              aria-label="Begin investigating the evidence"
            >
              Begin Investigation →
            </button>
          </section>
        )}

        {/* ─── STEP: INVESTIGATION ─── */}
        {step === "investigation" && (
          <section aria-label="Evidence investigation">
            <EvidenceViewer
              evidence={caseData.evidence}
              hotspots={caseData.hotspots}
              foundClues={foundClues}
              onClueFound={handleClueFound}
            />

            {/* File report button */}
            <div className="mt-8">
              <DeductionBuilder
                options={caseData.deduction_options}
                onSubmit={handleDeductionCorrect}
                disabled={foundClues.length < caseData.min_clues_to_deduce}
              />
            </div>

            {foundClues.length < caseData.min_clues_to_deduce && (
              <p
                className="text-center text-sm mt-4 italic"
                style={{ color: "#666" }}
                aria-live="polite"
                role="status"
              >
                Find {caseData.min_clues_to_deduce - foundClues.length} more clue
                {caseData.min_clues_to_deduce - foundClues.length !== 1 ? "s" : ""} to file your report
              </p>
            )}
          </section>
        )}

        {/* ─── STEP: INTERROGATION (Case 3 only) ─── */}
        {step === "interrogation" && (
          <section aria-label="Suspect interrogation">
            <div
              className="rounded-lg p-5 mb-6 border-l-4"
              style={{
                backgroundColor: "var(--noir-medium)",
                borderLeftColor: "var(--noir-red)",
                color: "var(--noir-cream)",
              }}
            >
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--noir-red)" }}>
                Interrogation Phase
              </p>
              <p className="text-base">
                You have a live scammer on the line, Detective. Ask questions to expose their lies.
                Find all 3 inconsistencies to crack the case.
              </p>
            </div>

            {inconsistencyLabels.length > 0 && (
              <div className="mb-4 space-y-1" role="list" aria-label="Inconsistencies exposed">
                {inconsistencyLabels.map((label, i) => (
                  <div
                    key={i}
                    className="text-sm px-3 py-2 rounded"
                    style={{ backgroundColor: "rgba(139,0,0,0.15)", color: "#ff9999" }}
                    role="listitem"
                  >
                    ✓ {label}
                  </div>
                ))}
              </div>
            )}


            <InterrogationChat
              inconsistenciesFound={inconsistenciesFound}
              onInconsistencyFound={handleInterrogationInconsistency}
              onComplete={triggerCommendation}
            />
          </section>
        )}

        {/* ─── STEP: COMMENDATION ─── */}
        {step === "commendation" && (
          <section aria-label="Case commendation">
            <CommendationCard
              text={commendation}
              caseTitle={caseData.title}
              learningSummary={caseData.learning_summary}
              isLoading={commendationLoading}
            />
          </section>
        )}
      </div>
    </main>
  );
}
