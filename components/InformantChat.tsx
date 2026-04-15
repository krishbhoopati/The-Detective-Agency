"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface InformantMessage {
  role: "user" | "assistant";
  content: string;
}

interface InformantChatProps {
  caseContext?: {
    title: string;
    scam_type: string;
  };
  onSendMessage?: (
    message: string,
    conversationHistory: InformantMessage[]
  ) => Promise<string>;
}

export default function InformantChat({
  caseContext,
  onSendMessage,
}: InformantChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<InformantMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isSending]);

  const closePanel = () => {
    setIsOpen(false);
    setInput("");
    setMessages([]);
    setIsSending(false);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const userMessage = input.trim();
    if (!userMessage || isSending) return;

    const contextualMessage = caseContext
      ? `Case context: ${caseContext.title} (${caseContext.scam_type}). Detective asks: ${userMessage}`
      : userMessage;
    const historyBeforeCurrent = messages;

    setInput("");
    setIsSending(true);
    setMessages((current) => [...current, { role: "user", content: userMessage }]);

    try {
      const response = onSendMessage
        ? await onSendMessage(contextualMessage, historyBeforeCurrent)
        : "The wire is open, Detective. Once the page connects me to the back room, I can dig deeper.";

      setMessages((current) => [
        ...current,
        { role: "assistant", content: response },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "The wire's gone quiet for a moment, Detective. Try again in a few seconds.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed right-0 top-1/2 z-50 flex min-h-[140px] -translate-y-1/2 items-center justify-center border-2 px-3 font-typewriter text-[16px] font-bold uppercase tracking-widest [writing-mode:vertical-rl]"
          style={{
            backgroundColor: "var(--noir-dark)",
            borderColor: "var(--noir-sepia)",
            color: "var(--noir-sepia)",
          }}
          aria-label="Open The Informant chat"
        >
          📡 Informant
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: 340 }}
            animate={{ x: 0 }}
            exit={{ x: 340 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-1/2 z-50 flex h-[480px] w-[320px] max-w-[calc(100vw-20px)] -translate-y-1/2 flex-col border-2 shadow-2xl"
            style={{
              backgroundColor: "var(--noir-dark)",
              borderColor: "var(--noir-sepia)",
              color: "var(--noir-cream)",
            }}
            aria-label="The Informant chat panel"
          >
            <div
              className="flex items-center justify-between border-b-2 p-3"
              style={{ borderColor: "var(--noir-sepia)" }}
            >
              <h2 className="font-typewriter text-[20px] font-bold uppercase">
                Informant
              </h2>
              <button
                type="button"
                onClick={closePanel}
                className="flex h-12 w-12 items-center justify-center border-2 text-[24px]"
                style={{
                  borderColor: "var(--noir-sepia)",
                  color: "var(--noir-sepia)",
                }}
                aria-label="Close The Informant chat"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {messages.length === 0 ? (
                <p className="text-[16px] leading-relaxed">
                  The wire&apos;s open, Detective. Ask me anything about this case.
                </p>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div key={`${message.role}-${index}`}>
                      <p
                        className="mb-1 font-typewriter text-[16px] font-bold uppercase"
                        style={{ color: "var(--noir-sepia)" }}
                      >
                        {message.role === "user" ? "DETECTIVE:" : "INFORMANT:"}
                      </p>
                      <p className="text-[16px] leading-relaxed">{message.content}</p>
                    </div>
                  ))}
                </div>
              )}
              {isSending && (
                <p
                  className="mt-4 text-[16px] italic"
                  style={{ color: "var(--text-on-dark-muted)" }}
                >
                  INFORMANT: Checking the files...
                </p>
              )}
              <div ref={endRef} />
            </div>

            <form
              onSubmit={handleSubmit}
              className="border-t-2 p-3"
              style={{ borderColor: "var(--noir-sepia)" }}
            >
              <label htmlFor="informant-input" className="sr-only">
                Message The Informant
              </label>
              <div className="flex gap-2">
                <input
                  id="informant-input"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask the Informant..."
                  disabled={isSending}
                  className="min-h-[48px] min-w-0 flex-1 border-2 px-3 text-[16px]"
                  style={{
                    backgroundColor: "var(--noir-cream)",
                    borderColor: "var(--noir-sepia)",
                    color: "var(--noir-dark)",
                  }}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isSending}
                  className="min-h-[48px] min-w-[60px] border-2 px-3 font-typewriter text-[16px] font-bold uppercase disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    borderColor: "var(--noir-sepia)",
                    backgroundColor: "var(--noir-sepia)",
                    color: "var(--noir-dark)",
                  }}
                >
                  Send
                </button>
              </div>
            </form>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
