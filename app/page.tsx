"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AudioController from "@/components/AudioController";
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
  }, []);
  const [ttsLoading, setTtsLoading] = useState(false);
  const [ttsPlaying, setTtsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioBlobUrl = useRef<string | null>(null);

  const openChiefDialog = () => {
    setShowChiefDialog(true);
  };

  const closeChiefDialog = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    setShowChiefDialog(false);
    setTtsPlaying(false);
    setTtsLoading(false);
  };

  const playChiefBriefing = async () => {
    if (ttsLoading) return;

    // Replay cached audio if available
    if (audioBlobUrl.current) {
      audioRef.current?.pause();
      const audio = new Audio(audioBlobUrl.current);
      audioRef.current = audio;
      setTtsPlaying(true);
      audio.onended = () => setTtsPlaying(false);
      try { await audio.play(); } catch { setTtsPlaying(false); }
      return;
    }

    setTtsLoading(true);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: CHIEF_SCRIPT }),
      });
      if (!res.ok) throw new Error("TTS failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      audioBlobUrl.current = url;

      audioRef.current?.pause();
      const audio = new Audio(url);
      audioRef.current = audio;
      setTtsPlaying(true);
      audio.onended = () => setTtsPlaying(false);
      await audio.play();
    } catch (err) {
      console.error("Chief TTS error:", err);
    } finally {
      setTtsLoading(false);
    }
  };

  return (
    <main className="page-fade-in w-full h-screen flex flex-col overflow-hidden">
      <AudioController />

      {/* CRT Scanlines overlay */}
      <div className="scanlines absolute inset-0 pointer-events-none z-50" aria-hidden="true" />

      {/* ── Wall Section ── */}
      <div className="h-[12vh] w-full bg-wall border-b-8 border-stone-900 relative z-0 flex items-center justify-center shrink-0">
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
      <div className="flex-1 relative bg-wood-desk vignette-warm z-10 overflow-hidden">
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
        <div className="absolute inset-0 grid grid-cols-3 gap-2 p-2 sm:p-4 z-10">
          {/* Left: Literacy Manual */}
          <div className="flex items-center justify-center scale-[1.8] origin-center">
            <DeskTeletypeManual onClick={() => setShowLab(true)} />
          </div>

          {/* Middle: Rotary Phone (The Chief) */}
          <div className="flex items-center justify-center scale-[1.8] origin-center">
            <DeskRotaryPhone onClick={openChiefDialog} />
          </div>

          {/* Right: Evidence Board */}
          <div className="flex items-center justify-center scale-[1.8] origin-center">
            <DeskEvidenceRecorder onClick={() => router.push("/cases")} />
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
            className="relative w-full max-w-[820px] max-h-[90vh] overflow-y-auto z-[61] pt-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-[#00008a] p-8 border-[6px] border-white shadow-retro-dialog">
              {/* Dialog Header */}
              <div className="absolute -top-7 left-6 bg-white px-5 py-2 border-[4px] border-black">
                <span className="font-retro text-base text-black tracking-widest">THE CHIEF</span>
              </div>

              {/* Close button */}
              <button
                onClick={closeChiefDialog}
                className="absolute top-3 right-3 w-14 h-14 bg-red-600 border-[4px] border-white text-white flex items-center justify-center hover:bg-red-500 font-bold text-2xl"
                aria-label="Close chief dialog"
              >
                ✕
              </button>

              {/* Message */}
              <p className="text-white text-3xl leading-[1.8] mt-6 font-sans font-medium">
                {CHIEF_SCRIPT}
              </p>

              {/* Actions */}
              <div className="mt-8 flex flex-col gap-4">
                {/* TTS Button */}
                <button
                  onClick={playChiefBriefing}
                  disabled={ttsLoading}
                  className="flex items-center justify-center gap-3 bg-black/50 border-4 border-yellow-400 px-6 py-4 hover:bg-yellow-500/20 transition-colors disabled:opacity-60 disabled:cursor-wait w-full"
                  aria-label="Hear the Chief speak"
                >
                  <span className="text-2xl" aria-hidden="true">
                    {ttsLoading ? "⏳" : ttsPlaying ? "🔊" : "📞"}
                  </span>
                  <span className="font-retro text-yellow-300 text-sm tracking-widest">
                    {ttsLoading ? "CONNECTING..." : ttsPlaying ? "PLAYING..." : "HEAR THIS READ ALOUD"}
                  </span>
                </button>

                {/* Take a Case CTA */}
                <button
                  onClick={() => router.push("/cases")}
                  className="flex items-center justify-center bg-yellow-400 border-4 border-yellow-600 px-6 py-4 hover:bg-yellow-300 transition-colors w-full"
                  aria-label="Go to the cases page and take your first assignment"
                >
                  <span className="font-retro text-black text-sm tracking-widest">
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
