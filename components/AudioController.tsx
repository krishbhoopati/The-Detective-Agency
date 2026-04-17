"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export default function AudioController() {
  const [muted, setMuted] = useState(true);
  const [started, setStarted] = useState(false);
  const rainRef = useRef<HTMLAudioElement | null>(null);
  const jazzRef = useRef<HTMLAudioElement | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const createLoop = (src: string, volume: number) => {
      try {
        const audio = new Audio(src);
        audio.loop = true;
        audio.volume = volume;
        audio.muted = true;
        return audio;
      } catch {
        return null;
      }
    };

    rainRef.current = createLoop("/audio/rain.mp3", 0.35);
    jazzRef.current = createLoop("/audio/jazz.mp3", 0.22);

    return () => {
      rainRef.current?.pause();
      jazzRef.current?.pause();
    };
  }, []);

  const setAllMuted = useCallback((nextMuted: boolean) => {
    if (rainRef.current) rainRef.current.muted = nextMuted;
    if (jazzRef.current) jazzRef.current.muted = nextMuted;
    setMuted(nextMuted);
  }, []);

  const startAudio = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    setStarted(true);
    setAllMuted(false);
    rainRef.current?.play().catch(() => {});
    jazzRef.current?.play().catch(() => {});
  }, [setAllMuted]);

  useEffect(() => {
    const handleFirstInteraction = () => startAudio();
    window.addEventListener("pointerdown", handleFirstInteraction, { once: true });
    window.addEventListener("keydown", handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };
  }, [startAudio]);

  const toggleMute = () => {
    if (!started) {
      startAudio();
      return;
    }
    setAllMuted(!muted);
  };

  return (
    <button
      type="button"
      onClick={toggleMute}
      aria-label={muted ? "Unmute background audio" : "Mute background audio"}
      title={muted ? "Unmute background audio" : "Mute background audio"}
      className="fixed right-14 top-4 z-50 flex h-[40px] w-[40px] items-center justify-center rounded-full border-2 text-[18px] transition-transform duration-200 hover:scale-105 focus-visible:outline-2"
      style={{
        borderColor: "var(--noir-sepia)",
        backgroundColor: "var(--noir-dark)",
        color: "var(--noir-sepia)",
      }}
    >
      {muted ? "🔇" : "🔊"}
    </button>
  );
}
