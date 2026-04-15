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
import InterrogationChat, {
  ConversationHistoryMessage,
} from "@/components/InterrogationChat";
import AudioController from "@/components/AudioController";

type Step = "briefing" | "investigation" | "deduction" | "interrogation" | "commendation";

export default function CasePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [step, setStep] = useState<Step>("briefing");
  const [briefingText, setBriefingText] = useState("");
  const [foundClues, setFoundClues] = useState<string[]>([]);
  const [wrongClickMessage, setWrongClickMessage] = useState<string | null>(null);
  const [activeStamp, setActiveStamp] = useState<Hotspot | null>(null);
  const [commendation, setCommendation] = useState("");
  const [commendationLoading, setCommendationLoading] = useState(false);
  const [inconsistenciesFound, setInconsistenciesFound] = useState(0);
  const [inconsistencyLabels, setInconsistencyLabels] = useState<string[]>([]);
  const [inactivityModal, setInactivityModal] = useState(false);

  const startTimeRef = useRef<number>(Date.now());
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrongClickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load case data
  useEffect(() => {
    if (!id) return;
    const data = getCaseById(id);
    if (!data) {
      setNotFound(true);
      return;
    }
    setNotFound(false);
    setCaseData(data);
    setStep("briefing");
    setBriefingText("");
    setFoundClues([]);
    setWrongClickMessage(null);
    setActiveStamp(null);
    setCommendation("");
    setInconsistenciesFound(0);
    setInconsistencyLabels([]);
  }, [id]);

  // Typewriter briefing
  useEffect(() => {
    if (!caseData || step !== "briefing") return;
    setBriefingText("");
    let i = 0;
    const interval = setInterval(() => {
      if (i >= caseData.briefing.length) {
        clearInterval(interval);
        return;
      }
      const nextCharacter = caseData.briefing[i];
      setBriefingText((prev) => prev + nextCharacter);
      i++;
    }, 18);

    return () => clearInterval(interval);
  }, [caseData, step]);

  // 5-minute inactivity prompt
  useEffect(() => {
    const resetTimer = () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = setTimeout(() => setInactivityModal(true), 5 * 60 * 1000);
    };

    const events = ["click", "touchstart", "keypress", "keydown"];
    events.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (wrongClickTimerRef.current) clearTimeout(wrongClickTimerRef.current);
    };
  }, []);

  const showWrongClickMessage = (message: string) => {
    setWrongClickMessage(message);
    if (wrongClickTimerRef.current) clearTimeout(wrongClickTimerRef.current);
    wrongClickTimerRef.current = setTimeout(() => {
      setWrongClickMessage(null);
    }, 2000);
  };

  const handleClueFound = (hotspotId: string) => {
    if (!caseData) return;
    const hotspot = caseData.hotspots.find((candidate) => candidate.id === hotspotId);
    if (!hotspot || foundClues.includes(hotspot.id)) return;
    setWrongClickMessage(null);
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
      if (!res.ok) throw new Error("Commendation request failed");
      const data = await res.json();
      setCommendation(data.commendation ?? "");
    } catch {
      const fallback =
        "Detective, your work on this case has been exemplary. The Agency is proud to have you on our roster. Case closed.";
      setCommendation(fallback);
    } finally {
      setCommendationLoading(false);
    }
  };

  const handleInterrogationInconsistency = (label: string) => {
    if (inconsistencyLabels.includes(label)) return;
    setInconsistencyLabels((prev) => [...prev, label]);
    setInconsistenciesFound((count) => count + 1);
  };

  const sendInterrogationMessage = async (
    message: string,
    conversationHistory: ConversationHistoryMessage[] = []
  ) => {
    const res = await fetch("/api/interrogate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        player_message: message,
        conversation_history: conversationHistory,
        known_inconsistencies: inconsistencyLabels,
      }),
    });

    if (!res.ok) throw new Error("Interrogation request failed");
    const data = (await res.json()) as {
      response: string;
      inconsistency_detected: boolean;
      inconsistency_label: string | null;
    };

    if (
      data.inconsistency_detected &&
      data.inconsistency_label &&
      !inconsistencyLabels.includes(data.inconsistency_label)
    ) {
      handleInterrogationInconsistency(data.inconsistency_label);
    }

    return data;
  };

  const handleAddToArchive = () => {
    if (!caseData) return;
    saveCompletedCase({
      case_id: caseData.id,
      case_title: caseData.title,
      scam_type: caseData.scam_type,
      commendation,
      completed_at: new Date().toISOString(),
      clues_found: foundClues.length,
    });
    router.push("/cases");
  };

  const handleReturnToCases = () => {
    router.push("/cases");
  };

  if (notFound) {
    return (
      <main
        className="page-fade-in min-h-screen flex items-center justify-center px-5"
        style={{ backgroundColor: "var(--noir-dark)" }}
      >
        <AudioController />
        <div className="max-w-xl text-center">
          <h1
            className="text-4xl font-bold mb-5"
            style={{ color: "var(--noir-sepia)" }}
          >
            Case not found, Detective.
          </h1>
          <Link
            href="/cases"
            className="inline-flex min-h-[60px] items-center justify-center px-6 py-3 text-xl font-bold hover:opacity-90 focus-visible:outline-2"
            style={{ backgroundColor: "var(--noir-sepia)", color: "var(--noir-dark)" }}
          >
            Back to Open Cases
          </Link>
        </div>
      </main>
    );
  }

  if (!caseData) {
    return (
      <main
        className="page-fade-in min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--noir-dark)" }}
        aria-label="Loading case"
      >
        <AudioController />
        <p className="text-xl" style={{ color: "var(--noir-sepia)" }}>
          One moment, Detective...
        </p>
      </main>
    );
  }

  return (
    <main
      className="page-fade-in min-h-screen px-4 py-10"
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
            <p className="text-2xl font-bold mb-3">
              Still on the case, Detective?
            </p>
            <p className="text-xl mb-6" style={{ color: "var(--text-on-paper-muted)" }}>
              Take your time.
            </p>
            <button
              autoFocus
              onClick={() => setInactivityModal(false)}
              className="px-8 py-3 rounded-lg font-bold text-xl transition-all hover:opacity-90 focus-visible:outline-2"
              style={{ backgroundColor: "var(--noir-dark)", color: "var(--noir-cream)", minHeight: "60px" }}
            >
              I&apos;m here
            </button>
          </div>
        </div>
      )}

      {/* Clue stamp modal */}
      {activeStamp && (
        <ClueStamp
          label={activeStamp.label}
          explanation={activeStamp.explanation}
          isVisible={Boolean(activeStamp)}
          onDismiss={() => setActiveStamp(null)}
        />
      )}

      <div className="max-w-2xl mx-auto">
        {/* Back link */}
        <Link
          href="/cases"
          className="inline-flex min-h-[60px] items-center gap-2 px-3 text-xl mb-8 hover:underline focus-visible:outline-2"
          style={{ color: "var(--noir-sepia)" }}
        >
          Case Files
        </Link>

        {/* Case header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span
              className="text-xl font-bold uppercase tracking-widest px-3 py-1 rounded"
              style={{ backgroundColor: "rgba(200,169,110,0.15)", color: "var(--noir-sepia)", border: "1px solid var(--noir-sepia)" }}
            >
              {caseData.scam_type}
            </span>
            <span className="text-xl" style={{ color: "var(--noir-cream)" }}>
              {caseData.difficulty}
            </span>
          </div>
          <h1
            className="text-3xl sm:text-4xl font-bold"
            style={{ color: "var(--noir-cream)" }}
          >
            {caseData.title}
          </h1>
        </div>

        {/* ─── STEP: BRIEFING ─── */}
        {step === "briefing" && (
          <section aria-label="Case briefing">
            <div
              className="rounded-lg p-6 mb-8 border-l-4 text-[22px] leading-relaxed"
              style={{
                backgroundColor: "var(--noir-medium)",
                borderLeftColor: "var(--noir-sepia)",
                color: "var(--noir-cream)",
              }}
            >
              <p className="text-xl font-bold uppercase tracking-widest mb-3" style={{ color: "var(--noir-sepia)" }}>
                Case Briefing
              </p>
              <p>
                {briefingText}
                {briefingText.length < caseData.briefing.length && (
                  <span aria-hidden="true" style={{ borderRight: "2px solid var(--noir-sepia)" }}>
                    &nbsp;
                  </span>
                )}
              </p>
            </div>

            <button
              onClick={() => {
                startTimeRef.current = Date.now();
                setStep("investigation");
              }}
              className="w-full py-5 rounded-lg text-xl font-bold transition-all hover:opacity-90 focus-visible:outline-2"
              style={{
                backgroundColor: "var(--noir-sepia)",
                color: "var(--noir-dark)",
                minHeight: "60px",
              }}
              aria-label="Begin investigating the evidence"
            >
              Examine the Evidence
            </button>
          </section>
        )}

        {/* ─── STEP: INVESTIGATION ─── */}
        {step === "investigation" && (
          <section aria-label="Evidence investigation">
            <EvidenceViewer
              evidenceHtml={caseData.evidence.html}
              hotspots={caseData.hotspots}
              foundClues={foundClues}
              onClueFound={handleClueFound}
              onWrongClick={() =>
                showWrongClickMessage(
                  "Nothing suspicious there, Detective. Keep scanning the evidence."
                )
              }
            />

            {wrongClickMessage && (
              <p
                className="mt-4 text-center text-xl italic"
                style={{ color: "var(--noir-sepia)" }}
                role="status"
                aria-live="polite"
              >
                {wrongClickMessage}
              </p>
            )}

            {foundClues.length < caseData.min_clues_to_deduce && (
              <p
                className="text-center text-xl mt-4 italic"
                style={{ color: "var(--noir-cream)" }}
                aria-live="polite"
                role="status"
              >
                Find {caseData.min_clues_to_deduce - foundClues.length} more clue
                {caseData.min_clues_to_deduce - foundClues.length !== 1 ? "s" : ""} to file your report
              </p>
            )}

            {foundClues.length >= caseData.min_clues_to_deduce && (
              <div
                className="mt-8 p-6 border-2"
                style={{ borderColor: "var(--noir-sepia)", backgroundColor: "var(--noir-medium)" }}
                role="status"
                aria-live="polite"
              >
                <p className="text-[22px] mb-5" style={{ color: "var(--noir-cream)" }}>
                  Ready to file your report, Detective.
                </p>
                <button
                  onClick={() => setStep("deduction")}
                  className="w-full py-5 text-xl font-bold transition-all hover:opacity-90 focus-visible:outline-2"
                  style={{
                    backgroundColor: "var(--noir-sepia)",
                    color: "var(--noir-dark)",
                    minHeight: "60px",
                  }}
                >
                  File Your Report
                </button>
              </div>
            )}
          </section>
        )}

        {/* ─── STEP: DEDUCTION ─── */}
        {step === "deduction" && (
          <section aria-label="File your deduction report">
            <DeductionBuilder
              options={caseData.deduction_options}
              isUnlocked
              onDeductionFiled={handleDeductionCorrect}
            />
            <button
              onClick={() => setStep("investigation")}
              className="mt-5 inline-flex min-h-[60px] items-center px-3 text-xl hover:underline focus-visible:outline-2"
              style={{ color: "var(--noir-sepia)" }}
            >
              Review the evidence
            </button>
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
              <p className="text-xl font-bold uppercase tracking-widest mb-2" style={{ color: "var(--noir-red)" }}>
                Interrogation Phase
              </p>
              <p className="text-[22px]">
                You have a live scammer on the line, Detective. Ask questions to expose their lies.
                Find all 3 inconsistencies to crack the case.
              </p>
            </div>

            {inconsistencyLabels.length > 0 && (
              <div className="mb-4 space-y-1" role="list" aria-label="Inconsistencies exposed">
                {inconsistencyLabels.map((label, i) => (
                  <div
                    key={i}
                    className="text-xl px-3 py-2 rounded"
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
              onSendMessage={sendInterrogationMessage}
              onInterrogationComplete={triggerCommendation}
            />
          </section>
        )}

        {/* ─── STEP: COMMENDATION ─── */}
        {step === "commendation" && (
          <section aria-label="Case commendation">
            <CommendationCard
              commendation={commendation}
              caseTitle={caseData.title}
              isLoading={commendationLoading}
              onAddToArchive={handleAddToArchive}
              onReturnToCases={handleReturnToCases}
            />
          </section>
        )}
      </div>
    </main>
  );
}
