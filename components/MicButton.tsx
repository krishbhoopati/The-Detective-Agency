"use client";

import { useRef, useState } from "react";

type State = "idle" | "listening" | "thinking" | "speaking";
type BrowserSpeechRecognitionAlternative = {
  transcript: string;
  confidence: number;
};

type BrowserSpeechRecognitionResult = {
  0: BrowserSpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
};

type BrowserSpeechRecognitionResultList = {
  0: BrowserSpeechRecognitionResult;
  length: number;
};

type BrowserSpeechRecognitionEvent = Event & {
  results: BrowserSpeechRecognitionResultList;
};

type BrowserSpeechRecognitionErrorEvent = Event & {
  error: string;
};

type BrowserSpeechRecognition = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: BrowserSpeechRecognitionEvent) => void) | null;
  onerror: ((event: BrowserSpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  abort: () => void;
};

type BrowserSpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

declare global {
  interface Window {
    SpeechRecognition?: BrowserSpeechRecognitionConstructor;
    webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor;
  }
}

export default function MicButton({ pageContext }: { pageContext: string }) {
  const [state, setState] = useState<State>("idle");
  // Audio element created during the click (user gesture) so autoplay is unlocked
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef = useRef<string | null>(null);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const cancelledRef = useRef(false);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
  };

  const reset = () => {
    cancelledRef.current = true;
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    stopAudio();
    setState("idle");
  };

  const handleQuestion = async (transcript: string) => {
    if (cancelledRef.current) return;
    setState("thinking");

    try {
      const guideRes = await fetch("/api/voice-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: transcript, screenContext: pageContext }),
      });

      if (cancelledRef.current) return;

      const data = await guideRes.json();
      const responseText: string = data.response;
      if (!responseText || cancelledRef.current) return;

      const ttsRes = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: responseText }),
      });

      if (!ttsRes.ok || cancelledRef.current) {
        console.error("TTS request failed", ttsRes.status);
        setState("idle");
        return;
      }

      const blob = await ttsRes.blob();
      if (cancelledRef.current) return;

      const url = URL.createObjectURL(blob);
      blobUrlRef.current = url;

      // Reuse the audio element created during the button click (user gesture)
      const audio = audioRef.current!;
      audio.pause();
      audio.src = url;
      audio.load(); // required after changing src so play() succeeds
      audio.onended = () => setState("idle");
      audio.onerror = (e) => {
        console.error("Audio playback error", e);
        setState("idle");
      };

      setState("speaking");
      await audio.play();
    } catch (err) {
      console.error("Voice guide error:", err);
      setState("idle");
    }
  };

  const startListening = (audio: HTMLAudioElement) => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert("Voice input is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    cancelledRef.current = false;
    audioRef.current = audio;

    const recognition = new SR();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    let gotResult = false;

    recognition.onresult = (event) => {
      gotResult = true;
      const transcript = event.results[0][0].transcript;
      handleQuestion(transcript);
    };

    recognition.onerror = (e) => {
      console.error("Speech recognition error", e.error);
      if (!cancelledRef.current) setState("idle");
    };

    recognition.onend = () => {
      if (!gotResult && !cancelledRef.current) setState("idle");
    };

    recognition.start();
    setState("listening");
  };

  const handleClick = () => {
    if (state === "idle") {
      // Create Audio here during user gesture — unlocks autoplay for later .play() calls
      const audio = new Audio();
      // Mute + play a silent sound to fully unlock autoplay in strict browsers
      audio.volume = 0;
      audio.src = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";
      audio.play().catch(() => {});
      audio.volume = 1;
      startListening(audio);
    } else {
      reset();
    }
  };

  const label =
    state === "listening" ? "Listening… tap to cancel" :
    state === "thinking"  ? "Getting answer…" :
    state === "speaking"  ? "Stop voice guidance" :
    "Ask for help";

  const icon =
    state === "listening" ? "🔴" :
    state === "thinking"  ? "⏳" :
    "🎤";

  const borderColor =
    state === "listening" ? "#ef4444" :
    state === "speaking"  ? "var(--noir-gold, #facc15)" :
    "var(--noir-sepia)";

  const color =
    state === "listening" ? "#ef4444" :
    state === "speaking"  ? "var(--noir-gold, #facc15)" :
    "var(--noir-sepia)";

  const boxShadow =
    state === "listening" ? "0 0 0 4px rgba(239,68,68,0.35)" :
    state === "speaking"  ? "0 0 0 4px rgba(250,204,21,0.35)" :
    undefined;

  const animation =
    state === "listening" ? "listening-pulse 1.2s ease-in-out infinite" :
    state === "speaking"  ? "mic-pulse 1.4s ease-in-out infinite" :
    undefined;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      title={label}
      className="fixed right-4 top-4 z-50 flex h-[68px] w-[68px] items-center justify-center rounded-full border-4 text-[30px] transition-transform duration-200 hover:scale-105 focus-visible:outline-2"
      style={{ borderColor, backgroundColor: "var(--noir-dark)", color, boxShadow, animation }}
    >
      {icon}
      <style>{`
        @keyframes mic-pulse {
          0%, 100% { box-shadow: 0 0 0 4px rgba(250,204,21,0.35); }
          50%       { box-shadow: 0 0 0 10px rgba(250,204,21,0.05); }
        }
        @keyframes listening-pulse {
          0%, 100% { box-shadow: 0 0 0 4px rgba(239,68,68,0.35); }
          50%       { box-shadow: 0 0 0 12px rgba(239,68,68,0.05); }
        }
      `}</style>
    </button>
  );
}
