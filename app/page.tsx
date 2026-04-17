"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import MicButton from "@/components/MicButton";
import { DeskRotaryPhone } from "@/components/DeskRotaryPhone";
import { DeskEvidenceRecorder } from "@/components/DeskEvidenceRecorder";
import { DeskTeletypeManual } from "@/components/DeskTeletypeManual";
import { LabContent } from "@/components/lab/LabContent";
import { clearArchive } from "@/lib/archive";

class LabErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onError: () => void }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error) {
    console.error("[LabErrorBoundary]", error);
    this.props.onError();
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

const CHIEF_SCRIPT =
  "Welcome, Detective. Here is how it works. Click the Evidence Board to pick a case. Read the briefing, then look through the evidence to find the clues. Once you have found enough, name the scam and close the case. If you need help understanding AI or online tricks, open the Field Manual first. Ready for your next assignment? Pick up this phone. The city needs you.";

export default function Home() {
  const router = useRouter();
  const [showChiefDialog, setShowChiefDialog] = useState(false);
  const [showLab, setShowLab] = useState(false);

  // Reset solved cases on each reload (testing mode)
  useEffect(() => {
    clearArchive();
    sessionStorage.removeItem("phoneAnswered");
  }, []);
  const [ttsPlaying, setTtsPlaying] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startBriefingPlayback = async () => {
    audioRef.current?.pause();
    setDisplayedText("");
    const audio = new Audio("/audio/chief-briefing.mp3");
    audioRef.current = audio;
    setTtsPlaying(true);

    audio.ontimeupdate = () => {
      if (audio.duration) {
        const progress = audio.currentTime / audio.duration;
        const charsToShow = Math.floor(progress * CHIEF_SCRIPT.length);
        setDisplayedText(CHIEF_SCRIPT.slice(0, charsToShow));
      }
    };

    audio.onended = () => {
      setDisplayedText(CHIEF_SCRIPT);
      setTtsPlaying(false);
    };

    try { await audio.play(); } catch { setTtsPlaying(false); }
  };

  const openChiefDialog = () => {
    setShowChiefDialog(true);
    setDisplayedText("");
    setTimeout(startBriefingPlayback, 300);
  };

  const closeChiefDialog = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    setDisplayedText("");
    setShowChiefDialog(false);
    setTtsPlaying(false);
  };

  return (
    <main className="page-fade-in flex min-h-screen w-full flex-col overflow-hidden">
      <MicButton pageContext="You are on The Detective's Desk — the main screen. On the left is the Field Manual, tap it to learn about AI and online scams. In the middle is the Rotary Phone, tap it to hear a briefing from the Chief and get started. On the right is the Evidence Board, tap it to pick a case and begin investigating. If this is your first time, tap the phone first. You can tap the microphone button at the top right at any time to ask anything." />

      {/* CRT Scanlines overlay */}
      <div className="scanlines absolute inset-0 pointer-events-none z-50" aria-hidden="true" />

      {/* ── Wall Section ── */}
      <div className="relative z-0 flex min-h-[92px] w-full shrink-0 items-center justify-center border-b-8 border-stone-900 bg-wall px-4 py-4 sm:min-h-[104px]">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.2 }}
        >
          <h1 className="font-retro text-base sm:text-2xl md:text-3xl text-yellow-500 drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)] tracking-widest bg-black/60 px-4 sm:px-6 py-2 sm:py-3 border-4 border-yellow-700">
            THE DETECTIVE&apos;S DESK
          </h1>
        </motion.div>
      </div>

      {/* ── Desk Surface ── */}
      <div className="relative z-10 flex-1 overflow-hidden bg-wood-desk vignette-warm">
        {/* Coffee ring decoration */}
        <div className="absolute bottom-8 left-8 w-24 h-24 rounded-full border-[6px] border-[#4a2e15] opacity-25 z-0" aria-hidden="true" />

        {/* Pencil decoration */}
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-40 h-3 bg-[#eab308] border-2 border-[#854d0e] rotate-[5deg] z-0 flex opacity-60"
          aria-hidden="true"
        >
          <div className="w-5 h-full bg-[#fca5a5] border-r-2 border-[#854d0e]" />
          <div className="flex-1" />
          <div className="w-6 h-full bg-[#fde047] border-l-2 border-[#854d0e]" />
        </div>

        {/* Warm desk lamp glow */}
        <div
          className="absolute top-[-5%] right-[-5%] w-[50%] h-[50%] pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,200,50,0.12)_0%,transparent_70%)] z-0"
          aria-hidden="true"
        />

        {/* 3-Column Desk Objects */}
        <div className="absolute inset-0 z-10 overflow-y-auto overflow-x-hidden px-2 py-4 sm:px-3 md:px-4 lg:px-6">
          <div className="grid min-h-full grid-cols-1 items-center gap-10 pb-10 md:grid-cols-2 md:gap-y-20 xl:grid-cols-3 xl:gap-6 2xl:gap-10">
            {/* Left: Literacy Manual */}
            <div className="flex items-center justify-center [transform:scale(0.88)] min-[430px]:[transform:scale(1.00)] md:[transform:scale(1.08)] lg:[transform:scale(1.18)] xl:[transform:scale(1.25)] 2xl:[transform:scale(1.38)]">
              <DeskTeletypeManual onClick={() => setShowLab(true)} />
            </div>

            {/* Middle: Rotary Phone (The Chief) */}
            <div className="flex items-center justify-center [transform:scale(0.88)] min-[430px]:[transform:scale(1.00)] md:[transform:scale(1.08)] lg:[transform:scale(1.18)] xl:[transform:scale(1.25)] 2xl:[transform:scale(1.38)]">
              <DeskRotaryPhone onClick={openChiefDialog} />
            </div>

            {/* Right: Evidence Board */}
            <div className="flex items-center justify-center md:col-span-2 xl:col-span-1 [transform:scale(0.86)] min-[430px]:[transform:scale(0.98)] md:[transform:scale(1.05)] lg:[transform:scale(1.15)] xl:[transform:scale(1.22)] 2xl:[transform:scale(1.35)]">
              <DeskEvidenceRecorder onClick={() => router.push("/cases")} />
            </div>
          </div>
        </div>

        {/* ── Lab Panel (opens within desk area) ── */}
        <AnimatePresence>
          {showLab && (
            <motion.div
              key="lab-overlay"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute inset-0 z-20 flex flex-col overflow-hidden"
            >
              <LabErrorBoundary onError={() => setShowLab(false)}>
                <LabContent onClose={() => setShowLab(false)} />
              </LabErrorBoundary>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Chief's Dialog ── */}
      <AnimatePresence>
        {showChiefDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
            onClick={closeChiefDialog}
          >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-[61] w-full max-w-[720px] max-h-[90vh] overflow-y-auto pt-7"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative border-[6px] border-white bg-[#00008a] p-5 shadow-retro-dialog sm:p-6">
              {/* Dialog Header */}
              <div className="absolute -top-7 left-6 bg-white px-5 py-2 border-[4px] border-black">
                <span className="font-retro text-base text-black tracking-widest">THE CHIEF</span>
              </div>

              {/* Close button */}
              <button
                onClick={closeChiefDialog}
                className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center border-[4px] border-white bg-red-600 text-lg font-bold text-white hover:bg-red-500 sm:h-12 sm:w-12"
                aria-label="Close chief dialog"
              >
                ✕
              </button>

              {/* Message */}
              <p className="mt-5 font-sans text-[1.15rem] font-medium leading-[1.65] text-white sm:text-[1.35rem]">
                {displayedText}
                {ttsPlaying && <span className="animate-pulse ml-0.5">|</span>}
              </p>

              {/* Actions */}
              <div className="mt-7 flex flex-col gap-3.5">
                {/* Replay Button */}
                <button
                  onClick={startBriefingPlayback}
                  className="flex w-full items-center justify-center gap-3 border-4 border-yellow-400 bg-black/50 px-4 py-3 transition-colors hover:bg-yellow-500/20"
                  aria-label="Replay the Chief's briefing"
                >
                  <span className="text-lg sm:text-xl" aria-hidden="true">
                    {ttsPlaying ? "🔊" : "📞"}
                  </span>
                  <span className="font-retro text-[0.7rem] tracking-widest text-yellow-300 sm:text-sm">
                    {ttsPlaying ? "PLAYING..." : "REPLAY BRIEFING"}
                  </span>
                </button>

                {/* Take a Case CTA */}
                <button
                  onClick={() => router.push("/cases")}
                  className="flex w-full items-center justify-center border-4 border-yellow-600 bg-yellow-400 px-4 py-3 transition-colors hover:bg-yellow-300"
                  aria-label="Go to the cases page and take your first assignment"
                >
                  <span className="font-retro text-[0.7rem] tracking-widest text-black sm:text-sm">
                    START A CASE →
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
