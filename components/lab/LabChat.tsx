"use client";

import { useEffect, useRef, useState } from "react";
import type { LabScenario } from "@/lib/lab-scenarios";

interface Message {
  role: "user" | "tutor";
  content: string;
  promptQuality?: "vague" | "specific" | "excellent" | null;
}

type ConversationHistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

interface LabChatProps {
  scenario: LabScenario;
  currentStepIndex: number;
  isComplete: boolean;
  onScenarioComplete: () => void;
}

const PROMPT_QUALITY_LABELS: Record<string, string> = {
  vague: "Prompt: Vague — try being more specific",
  specific: "Prompt: Good — specific question",
  excellent: "Prompt: Excellent — context + question + format",
};

export function LabChat({
  scenario,
  currentStepIndex,
  isComplete,
  onScenarioComplete,
}: LabChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<ConversationHistoryMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevStepIndexRef = useRef<number>(currentStepIndex);
  const completionFiredRef = useRef(false);

  // Inject intro message whenever scenario changes
  useEffect(() => {
    setMessages([{ role: "tutor", content: scenario.tutor.introMessage }]);
    setConversationHistory([]);
    setInput("");
    prevStepIndexRef.current = 0;
    completionFiredRef.current = false;
  }, [scenario.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  // Fire auto-message on step advance
  useEffect(() => {
    const prev = prevStepIndexRef.current;
    prevStepIndexRef.current = currentStepIndex;
    if (currentStepIndex <= prev) return;     // only on forward progress
    if (currentStepIndex === 0) return;

    const completedStep = scenario.steps[currentStepIndex - 1];
    const autoMsg = `[AUTO] User completed step: ${completedStep.label}`;
    sendToApi(autoMsg, true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepIndex]);

  // Fire completion auto-message once
  useEffect(() => {
    if (!isComplete || completionFiredRef.current) return;
    completionFiredRef.current = true;
    sendToApi("[AUTO] Scenario complete", true, true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete]);

  const sendToApi = async (
    message: string,
    isAutoMessage: boolean,
    triggerComplete = false
  ) => {
    setIsSending(true);
    try {
      const currentStep = scenario.steps[Math.min(currentStepIndex, scenario.steps.length - 1)];
      const res = await fetch("/api/lab-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          scenarioId: scenario.id,
          currentStepLabel: currentStep.label,
          currentScreenId: currentStep.screenId,
          currentStepIndex,
          totalSteps: scenario.steps.length,
          isAutoMessage,
          evaluatePromptQuality:
            !isAutoMessage && (scenario.tutor.evaluatePromptQuality ?? false),
          conversationHistory,
        }),
      });

      const data = await res.json();
      const tutorMsg: Message = {
        role: "tutor",
        content: data.response,
        promptQuality: data.promptQuality ?? null,
      };

      setMessages((prev) => [...prev, tutorMsg]);
      setConversationHistory((prev) => [
        ...prev,
        { role: "user", content: message },
        { role: "assistant", content: data.response },
      ]);

      if (triggerComplete) {
        setTimeout(() => onScenarioComplete(), 600);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "tutor", content: "The wire went quiet for a moment. Try again in a few seconds." },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    await sendToApi(trimmed, false);
  };

  return (
    <div
      className="flex h-full flex-col"
      style={{ backgroundColor: "var(--noir-dark)" }}
    >
      {/* Header */}
      <div
        className="border-b-2 px-4 py-3"
        style={{ borderColor: "var(--noir-sepia)" }}
      >
        <p
          className="font-typewriter text-[13px] font-bold uppercase tracking-widest"
          style={{ color: "var(--noir-sepia)" }}
        >
          The Informant — Tutor
        </p>
        <p className="font-typewriter text-[11px] mt-0.5" style={{ color: "var(--noir-cream)", opacity: 0.6 }}>
          {scenario.title}
        </p>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        role="log"
        aria-live="polite"
        aria-label="Tutor conversation"
      >
        {messages.map((msg, i) => (
          <div key={i}>
            <p
              className="mb-1 font-typewriter text-[13px] font-bold uppercase"
              style={{ color: msg.role === "tutor" ? "var(--noir-sepia)" : "var(--noir-red)" }}
            >
              {msg.role === "tutor" ? "Tutor:" : "You:"}
            </p>
            <p
              className="font-readable text-[18px] leading-relaxed"
              style={{ color: "var(--noir-cream)" }}
            >
              {msg.content}
            </p>
            {/* Prompt quality badge */}
            {msg.role === "user" && msg.promptQuality && (
              <span
                className="mt-1 inline-block border px-2 py-0.5 font-typewriter text-[12px]"
                style={{
                  borderColor: msg.promptQuality === "excellent" ? "#4a7c59" : "var(--noir-sepia)",
                  color: msg.promptQuality === "excellent" ? "#4a7c59" : "var(--noir-sepia)",
                  backgroundColor:
                    msg.promptQuality === "excellent"
                      ? "rgba(74,124,89,0.1)"
                      : "rgba(200,169,110,0.1)",
                }}
              >
                {PROMPT_QUALITY_LABELS[msg.promptQuality]}
              </span>
            )}
          </div>
        ))}

        {isSending && (
          <div>
            <p
              className="mb-1 font-typewriter text-[13px] font-bold uppercase"
              style={{ color: "var(--noir-sepia)" }}
            >
              Tutor:
            </p>
            <p
              className="font-readable text-[18px]"
              style={{ color: "var(--noir-cream)", opacity: 0.5 }}
            >
              …
            </p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="border-t-2 p-3 flex gap-2"
        style={{ borderColor: "var(--noir-sepia)" }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message or question…"
          disabled={isSending}
          className="flex-1 border-2 px-4 py-3 font-readable text-[18px] focus:outline-none"
          style={{
            backgroundColor: "var(--noir-cream)",
            borderColor: "var(--noir-sepia)",
            color: "var(--noir-dark)",
          }}
          aria-label="Message the tutor"
        />
        <button
          type="submit"
          disabled={isSending || !input.trim()}
          className="border-2 px-5 py-3 font-typewriter text-[16px] font-bold uppercase transition-opacity disabled:opacity-40"
          style={{
            borderColor: "var(--noir-sepia)",
            backgroundColor: "var(--noir-dark)",
            color: "var(--noir-sepia)",
          }}
          aria-label="Send message"
        >
          Send
        </button>
      </form>
    </div>
  );
}
