"use client";

import { useRef, useState } from "react";

type State = "idle" | "listening" | "thinking" | "speaking" | "text-only";
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
  const [transcript, setTranscript] = useState<string>("");
  const [responseText, setResponseText] = useState<string>("");
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
    setTranscript("");
    setResponseText("");
    setState("idle");
  };

  const handleQuestion = async (heard: string) => {
    if (cancelledRef.current) return;
    setState("thinking");

    try {
      const guideRes = await fetch("/api/voice-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: heard, screenContext: pageContext }),
      });

      if (cancelledRef.current) return;

      const data = await guideRes.json();
      const text: string = data.response;
      if (!text || cancelledRef.current) return;

      setResponseText(text);

      const ttsRes = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!ttsRes.ok || cancelledRef.current) {
        console.error("TTS request failed", ttsRes.status);
        // Show text-only fallback so the user still gets an answer
        setState("text-only");
        return;
      }

      const blob = await ttsRes.blob();
      if (cancelledRef.current) return;

      const url = URL.createObjectURL(blob);
      blobUrlRef.current = url;

      const audio = audioRef.current!;
      audio.pause();
      audio.src = url;
      audio.load();
      audio.onended = () => setState("idle");
      audio.onerror = (e) => {
        console.error("Audio playback error", e);
        setState("text-only");
      };

      setState("speaking");
      await audio.play();
    } catch (err) {
      console.error("Voice guide error:", err);
      setState(responseText ? "text-only" : "idle");
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
      const heard = event.results[0][0].transcript;
      setTranscript(heard);
      handleQuestion(heard);
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
      const audio = new Audio();
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
    state === "listening"  ? "Listening… tap to cancel" :
    state === "thinking"   ? "Getting answer…" :
    state === "speaking"   ? "Stop voice guidance" :
    state === "text-only"  ? "Tap to dismiss" :
    "Ask for help";

  const icon =
    state === "listening"  ? "🔴" :
    state === "thinking"   ? "⏳" :
    "🎤";

  const borderColor =
    state === "listening"  ? "#ef4444" :
    state === "speaking"   ? "var(--noir-gold, #facc15)" :
    state === "text-only"  ? "var(--noir-gold, #facc15)" :
    "var(--noir-sepia)";

  const color =
    state === "listening"  ? "#ef4444" :
    state === "speaking"   ? "var(--noir-gold, #facc15)" :
    state === "text-only"  ? "var(--noir-gold, #facc15)" :
    "var(--noir-sepia)";

  const boxShadow =
    state === "listening"  ? "0 0 0 4px rgba(239,68,68,0.35)" :
    state === "speaking"   ? "0 0 0 4px rgba(250,204,21,0.35)" :
    state === "text-only"  ? "0 0 0 4px rgba(250,204,21,0.35)" :
    undefined;

  const animation =
    state === "listening"  ? "listening-pulse 1.2s ease-in-out infinite" :
    state === "speaking"   ? "mic-pulse 1.4s ease-in-out infinite" :
    undefined;

  const showBubble = (state === "thinking" || state === "speaking" || state === "text-only") && (transcript || responseText);

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-label={label}
        title={label}
        className="fixed right-3 top-3 z-50 flex h-[58px] w-[58px] items-center justify-center rounded-full border-4 text-[24px] transition-transform duration-200 hover:scale-105 focus-visible:outline-2 sm:right-4 sm:top-4 sm:h-[68px] sm:w-[68px] sm:text-[30px]"
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

      {showBubble && (
        <div
          role="status"
          aria-live="polite"
          onClick={state === "text-only" ? reset : undefined}
          style={{
            position: "fixed",
            bottom: "100px",
            left: "50%",
            transform: "translateX(-50%)",
            maxWidth: "min(600px, 90vw)",
            width: "max-content",
            backgroundColor: "rgba(20,16,10,0.96)",
            border: "2px solid var(--noir-gold, #facc15)",
            borderRadius: "16px",
            padding: "18px 22px",
            zIndex: 60,
            boxShadow: "0 8px 32px rgba(0,0,0,0.7)",
            cursor: state === "text-only" ? "pointer" : "default",
          }}
        >
          {transcript && (
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", marginBottom: responseText ? "8px" : "0", fontStyle: "italic" }}>
              You said: &ldquo;{transcript}&rdquo;
            </p>
          )}
          {responseText && (
            <p style={{ color: "#fff", fontSize: "17px", lineHeight: "1.55", margin: 0 }}>
              {responseText}
            </p>
          )}
          {state === "text-only" && (
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", marginTop: "10px", textAlign: "center" }}>
              Tap anywhere here to dismiss
            </p>
          )}
        </div>
      )}
    </>
  );
}
