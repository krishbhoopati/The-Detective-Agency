"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AudioController from "@/components/AudioController";
import { DeskRotaryPhone } from "@/components/DeskRotaryPhone";
import { DeskEvidenceRecorder } from "@/components/DeskEvidenceRecorder";
import { DeskTeletypeManual } from "@/components/DeskTeletypeManual";

const CHIEF_SCRIPT =
  "Welcome, Detective. I've got a situation. Digital scams are targeting people who need our help most. Here at the Agency, you've got three stations. The Evidence Board shows your closed cases. The Teletype Manual gives you the field guide on AI and tech. And when you're ready — pick up this phone again and take your first assignment. The city needs you.";

export default function Home() {
  const router = useRouter();
  const [showChiefDialog, setShowChiefDialog] = useState(false);
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
          <div className="flex items-center justify-center scale-[1.3] origin-center">
            <DeskTeletypeManual onClick={() => router.push("/literacy")} />
          </div>

          {/* Middle: Rotary Phone (The Chief) */}
          <div className="flex items-center justify-center scale-[1.3] origin-center">
            <DeskRotaryPhone onClick={openChiefDialog} />
          </div>

          {/* Right: Evidence Board */}
          <div className="flex items-center justify-center scale-[1.3] origin-center">
            <DeskEvidenceRecorder onClick={() => router.push("/archive")} />
          </div>
        </div>
      </div>

      {/* ── Chief's Dialog ── */}
      <AnimatePresence>
        {showChiefDialog && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute top-1/2 left-[55%] -translate-y-1/2 w-[42%] max-w-[480px] z-[60]"
          >
            <div className="relative bg-[#0000aa] p-5 sm:p-8 border-[6px] border-white shadow-retro-dialog">
              {/* Dialog Header */}
              <div className="absolute -top-6 left-6 bg-white px-4 py-2 border-[4px] border-black">
                <span className="font-retro text-xs sm:text-sm text-black">CHIEF</span>
              </div>

              {/* Close button */}
              <button
                onClick={closeChiefDialog}
                className="absolute top-3 right-3 w-10 h-10 bg-red-600 border-[4px] border-white text-white flex items-center justify-center hover:bg-red-500 font-retro text-sm"
                aria-label="Close chief dialog"
              >
                X
              </button>

              {/* Portrait + Text */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4 items-center sm:items-start">
                {/* Pixel Portrait */}
                <div className="w-20 h-20 sm:w-28 sm:h-28 shrink-0 bg-black border-[4px] border-white flex items-center justify-center overflow-hidden">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-stone-400 rounded-sm mt-4 sm:mt-5 relative">
                    <div className="absolute top-2 left-2 w-2 h-2 bg-black" />
                    <div className="absolute top-2 right-2 w-2 h-2 bg-black" />
                    <div className="absolute bottom-2 left-2 right-2 h-1.5 bg-black" />
                  </div>
                </div>

                <p className="font-typewriter text-white text-base sm:text-xl leading-relaxed">
                  &ldquo;{CHIEF_SCRIPT}&rdquo;
                </p>
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
                {/* TTS Button */}
                <button
                  onClick={playChiefBriefing}
                  disabled={ttsLoading}
                  className="flex items-center gap-2 bg-black/60 border-4 border-yellow-500 px-4 py-2 hover:bg-yellow-500/20 transition-colors disabled:opacity-60 disabled:cursor-wait"
                  aria-label="Hear the Chief speak"
                >
                  <span className="text-xl" aria-hidden="true">
                    {ttsLoading ? "⏳" : ttsPlaying ? "🔊" : "📞"}
                  </span>
                  <span className="font-retro text-yellow-400 text-[9px] sm:text-xs">
                    {ttsLoading ? "CONNECTING..." : ttsPlaying ? "PLAYING..." : "HEAR THE CHIEF"}
                  </span>
                </button>

                {/* Take a Case CTA */}
                <button
                  onClick={() => router.push("/cases")}
                  className="bg-yellow-500 border-4 border-yellow-700 px-5 py-2 hover:bg-yellow-400 transition-colors"
                  aria-label="Go to the cases page and take your first assignment"
                >
                  <span className="font-retro text-black text-[9px] sm:text-xs">
                    TAKE A CASE →
                  </span>
                </button>
              </div>

              {/* Blinking cursor */}
              <div className="absolute bottom-3 right-4 w-4 h-4 bg-white animate-pulse" aria-hidden="true" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
