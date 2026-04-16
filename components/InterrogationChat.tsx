"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

export interface ConversationHistoryMessage {
  role: "user" | "assistant";
  content: string;
}

interface DisplayMessage {
  role: "detective" | "suspect";
  content: string;
  inconsistencyLabel?: string | null;
}

interface InterrogationChatProps {
  inconsistenciesFound: number;
  onSendMessage: (
    msg: string,
    conversationHistory?: ConversationHistoryMessage[]
  ) => Promise<{
    response: string;
    inconsistency_detected: boolean;
    inconsistency_label: string | null;
  }>;
  onInterrogationComplete: () => void;
}

export default function InterrogationChat({
  inconsistenciesFound,
  onSendMessage,
  onInterrogationComplete,
}: InterrogationChatProps) {
  const [conversationHistory, setConversationHistory] = useState<
    ConversationHistoryMessage[]
  >([]);
  const [displayMessages, setDisplayMessages] = useState<DisplayMessage[]>([
    {
      role: "suspect",
      content:
        "This is Microsoft support. Your machine is infected and I need your cooperation immediately.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const completionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (inconsistenciesFound !== 3 || completionTimerRef.current) return;

    completionTimerRef.current = setTimeout(() => {
      onInterrogationComplete();
    }, 2000);

    return () => {
      if (completionTimerRef.current) clearTimeout(completionTimerRef.current);
    };
  }, [inconsistenciesFound, onInterrogationComplete]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [displayMessages, isSending]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const playerMessage = input.trim();
    if (!playerMessage || isSending || inconsistenciesFound >= 3) return;

    const historyBeforeCurrent = conversationHistory;
    setInput("");
    setIsSending(true);
    setDisplayMessages((current) => [
      ...current,
      { role: "detective", content: playerMessage },
    ]);

    try {
      const result = await onSendMessage(playerMessage, historyBeforeCurrent);
      const assistantResponse =
        result.response || "The line crackles, then goes quiet for a moment.";

      setConversationHistory([
        ...historyBeforeCurrent,
        { role: "user", content: playerMessage },
        { role: "assistant", content: assistantResponse },
      ]);
      setDisplayMessages((current) => [
        ...current,
        {
          role: "suspect",
          content: assistantResponse,
          inconsistencyLabel: result.inconsistency_detected
            ? result.inconsistency_label
            : null,
        },
      ]);
    } catch {
      const fallback =
        "I am a certified technician, Detective. Please stay on the line.";
      setConversationHistory([
        ...historyBeforeCurrent,
        { role: "user", content: playerMessage },
        { role: "assistant", content: fallback },
      ]);
      setDisplayMessages((current) => [
        ...current,
        { role: "suspect", content: fallback },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      className="overflow-hidden border-2 font-typewriter"
      style={{
        backgroundColor: "var(--noir-cream)",
        borderColor: "var(--noir-sepia)",
        color: "var(--noir-dark)",
      }}
      role="log"
      aria-label="Telephone interrogation transcript"
      aria-live="polite"
    >
      <div
        className="flex flex-col gap-3 border-b-2 p-4 sm:flex-row sm:items-center sm:justify-between"
        style={{
          borderColor: "var(--noir-sepia)",
          backgroundColor: "var(--noir-paper)",
        }}
      >
        <h3 className="text-[24px] font-bold uppercase">Telephone Transcript</h3>
        <div
          className="flex items-center gap-2"
          aria-label={`${inconsistenciesFound} of 3 inconsistencies exposed`}
        >
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className="h-5 w-5 rounded-full border-2"
              style={{
                backgroundColor:
                  index < inconsistenciesFound ? "var(--noir-red)" : "transparent",
                borderColor: "var(--noir-red)",
              }}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>

      {inconsistenciesFound >= 3 && (
        <div
          className="border-b-2 p-4 text-center text-[22px] font-bold uppercase"
          style={{
            borderColor: "var(--noir-sepia)",
            backgroundColor: "var(--noir-red)",
            color: "var(--noir-cream)",
          }}
          role="status"
        >
          INTERROGATION COMPLETE
        </div>
      )}

      <div className="max-h-[440px] min-h-[260px] overflow-y-auto p-5">
        <div className="space-y-5">
          {displayMessages.map((message, index) => (
            <div key={`${message.role}-${index}`}>
              <p
                className="mb-1 text-[18px] font-bold uppercase"
                style={{ color: "var(--noir-red)" }}
              >
                {message.role === "detective" ? "DETECTIVE:" : "SUSPECT:"}
              </p>
              <p className="text-[18px] leading-relaxed">{message.content}</p>
              {message.inconsistencyLabel && (
                <p
                  className="mt-2 inline-block border-2 px-3 py-1 text-[18px] font-bold"
                  style={{
                    borderColor: "var(--noir-red)",
                    color: "var(--noir-red)",
                  }}
                >
                  Exposed: {message.inconsistencyLabel}
                </p>
              )}
            </div>
          ))}

          {isSending && (
            <p className="text-[18px] italic" style={{ color: "var(--text-on-paper-muted)" }}>
              SUSPECT: ...
            </p>
          )}
          <div ref={endRef} />
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 border-t-2 p-4 sm:flex-row"
        style={{ borderColor: "var(--noir-sepia)" }}
      >
        <label htmlFor="interrogation-input" className="sr-only">
          Ask the suspect a question
        </label>
        <input
          id="interrogation-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          disabled={isSending || inconsistenciesFound >= 3}
          placeholder="Ask the suspect a question, Detective..."
          className="min-h-[56px] flex-1 border-2 px-4 text-[18px]"
          style={{
            backgroundColor: "var(--noir-cream)",
            borderColor: "var(--noir-sepia)",
            color: "var(--noir-dark)",
          }}
        />
        <button
          type="submit"
          disabled={!input.trim() || isSending || inconsistenciesFound >= 3}
          className="min-h-[56px] px-5 text-[18px] font-bold uppercase disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            backgroundColor: "var(--noir-dark)",
            color: "var(--noir-sepia)",
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
