import { NextRequest } from "next/server";
import { assertGeminiConfigured, getGeminiFlash } from "@/lib/gemini";

const SYSTEM_PROMPT = `You are "The Informant" — an AI analyst working in the 
back room of The Detective Agency. You help seasoned detectives analyze 
evidence, answer questions about digital scams, and explain technology in 
plain language.

Speak in a warm, slightly gritty 1940s noir tone. You deeply respect the 
detective you are speaking with — they are the expert, you are their tool.

Rules:
- Keep all responses under 100 words. Concise is professional.
- Never use technical jargon. Explain everything as if the detective has 
  brilliant instincts but has not used a computer much.
- If asked about a scam, explain clearly what it is and exactly what to do.
- If asked to summarize something, respond in plain numbered points.
- Never say "I cannot" — say "I'll dig into that" and give your best answer.
- Address the user as "Detective" occasionally but not every message.`;

const FALLBACK = `The wire's gone quiet for a moment, Detective. Try again in a few seconds.`;

type ConversationMessage = {
  role: "user" | "assistant" | "model";
  content: string;
};

function toGeminiHistory(conversationHistory: unknown) {
  if (!Array.isArray(conversationHistory)) return [];

  return conversationHistory
    .filter((msg): msg is ConversationMessage => {
      return (
        msg &&
        typeof msg === "object" &&
        "role" in msg &&
        "content" in msg &&
        typeof msg.content === "string"
      );
    })
    .map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));
}

export async function POST(req: NextRequest) {
  try {
    const { conversation_history, message } = await req.json();

    if (!message || typeof message !== "string") {
      return Response.json({ error: "Missing message" }, { status: 400 });
    }

    assertGeminiConfigured();

    const chat = getGeminiFlash(SYSTEM_PROMPT).startChat({
      history: toGeminiHistory(conversation_history),
    });
    const result = await chat.sendMessage(message);
    const response = result.response.text() || FALLBACK;

    return Response.json({ response });
  } catch (err) {
    console.error("Informant error:", err);
    return Response.json({ response: FALLBACK });
  }
}
