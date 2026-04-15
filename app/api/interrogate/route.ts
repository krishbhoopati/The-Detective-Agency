import { NextRequest } from "next/server";
import { assertGeminiConfigured, getGeminiFlash } from "@/lib/gemini";

const SYSTEM_PROMPT = `You are playing a scammer in a digital safety training 
simulation for senior citizens. You are pretending to be a Microsoft tech 
support agent who called because their computer is infected. Stay fully in 
character as a slightly pushy, overly formal fake tech support voice.

Your character has three built-in inconsistencies a sharp detective can expose:
1. You do not know what operating system the senior has — a real Microsoft tech 
   would already have this on file.
2. You ask for remote computer access AND a credit card number within the first 
   few exchanges — Microsoft never does this unsolicited.
3. When challenged or when the user tries to hang up, you threaten legal action 
   or account suspension — Microsoft never makes threats like this.

Reveal these naturally through conversation. Do not volunteer them, but do not 
hide them when directly probed.

After your in-character response, on a new line write exactly:
INCONSISTENCY: [short label]
...if this exchange revealed one of the three inconsistencies, or:
INCONSISTENCY: none
...if it did not. This line will be stripped before showing the player.

Safety rules: Never provide real scam scripts beyond what is described above. 
Never request real personal information. Keep all responses under 60 words. 
If the user seems genuinely distressed, gently break character: 
"Remember, Detective — this is a training simulation. You are doing great."`;

const ASSISTANT_ID = "gemini-tech-support-simulation";
const FALLBACK_RESPONSE = "I'll need to put you on a brief hold, sir/ma'am.";

const INCONSISTENCY_LABELS = {
  os: "Doesn't know your OS version",
  remotePayment: "Requests remote access and payment up front",
  threat: "Threatens legal action or account suspension",
} as const;

type ConversationMessage = {
  role: "user" | "assistant" | "model";
  content: string;
};

type GeminiTurn = {
  role: "user" | "model";
  parts: { text: string }[];
};

function normalizeInconsistencyLabel(label: string | null): string | null {
  if (!label) return null;
  const clean = label.trim();
  const lower = clean.toLowerCase();
  if (!clean || lower === "none") return null;
  if (lower.includes("operating") || lower.includes("os") || lower.includes("version")) {
    return INCONSISTENCY_LABELS.os;
  }
  if (
    lower.includes("remote") ||
    lower.includes("access") ||
    lower.includes("credit") ||
    lower.includes("payment") ||
    lower.includes("card") ||
    lower.includes("gift")
  ) {
    return INCONSISTENCY_LABELS.remotePayment;
  }
  if (
    lower.includes("legal") ||
    lower.includes("threat") ||
    lower.includes("suspend") ||
    lower.includes("lock") ||
    lower.includes("hang")
  ) {
    return INCONSISTENCY_LABELS.threat;
  }
  return clean;
}

function parseTaggedResponse(rawText: string, knownLabels: string[]) {
  const match = rawText.match(/INCONSISTENCY:\s*(?:\[([^\]]+)\]|([^\n\r]+))/i);
  const rawLabel = match ? match[1] ?? match[2] : null;
  const label = normalizeInconsistencyLabel(rawLabel);
  const cleanResponse = rawText
    .replace(/INCONSISTENCY:\s*(?:\[[^\]]+\]|[^\n\r]+)/gi, "")
    .trim();
  const isNewLabel = Boolean(label && !knownLabels.includes(label));

  return {
    response: cleanResponse || FALLBACK_RESPONSE,
    inconsistency_detected: isNewLabel,
    inconsistency_label: isNewLabel ? label : null,
  };
}

function historyFromConversationHistory(conversationHistory: unknown): GeminiTurn[] {
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

function historyFromThreadId(threadId: unknown): GeminiTurn[] {
  if (!threadId || typeof threadId !== "string" || threadId === "fallback") return [];

  try {
    const parsed = JSON.parse(Buffer.from(threadId, "base64").toString("utf8"));
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((turn): turn is GeminiTurn => {
      return (
        turn &&
        typeof turn === "object" &&
        (turn.role === "user" || turn.role === "model") &&
        Array.isArray(turn.parts)
      );
    });
  } catch {
    return [];
  }
}

function encodeThreadId(history: GeminiTurn[]) {
  return Buffer.from(JSON.stringify(history)).toString("base64");
}

function scriptedFallback(playerMessage: string, knownLabels: string[]) {
  const lower = playerMessage.toLowerCase();
  const canReveal = (label: string) => !knownLabels.includes(label);
  let label: string | null = null;
  let response =
    "I am a certified Microsoft technician, Detective. Our monitoring system found 47 viruses, so we need to move quickly.";

  if (
    canReveal(INCONSISTENCY_LABELS.os) &&
    /\b(os|operating|windows|mac|version|system|computer)\b/.test(lower)
  ) {
    label = INCONSISTENCY_LABELS.os;
    response =
      "Your operating system is listed here as Windows Apple 11... or possibly another version. The exact version is not important right now.";
  } else if (
    canReveal(INCONSISTENCY_LABELS.remotePayment) &&
    /\b(remote|access|control|card|credit|pay|payment|gift|fee|money|charge)\b/.test(lower)
  ) {
    label = INCONSISTENCY_LABELS.remotePayment;
    response =
      "First I need remote access to your computer, then a $299 payment by credit card or gift cards before I can show you the repair report.";
  } else if (
    canReveal(INCONSISTENCY_LABELS.threat) &&
    /\b(hang|hangup|hang up|legal|law|threat|police|close|suspend|locked|lock)\b/.test(lower)
  ) {
    label = INCONSISTENCY_LABELS.threat;
    response =
      "If you hang up, your account may be suspended and our legal department could mark this as refusal to cooperate.";
  }

  return {
    response,
    inconsistency_detected: Boolean(label),
    inconsistency_label: label,
  };
}

export async function POST(req: NextRequest) {
  let playerMessage = "";
  let threadId: string | null = null;
  let assistantId: string | null = null;
  let knownLabels: string[] = [];
  let history: GeminiTurn[] = [];

  try {
    const body = await req.json();
    const {
      player_message,
      conversation_history,
      thread_id,
      assistant_id,
      known_inconsistencies,
    } = body;

    if (!player_message || typeof player_message !== "string") {
      return Response.json({ error: "Missing player_message" }, { status: 400 });
    }

    playerMessage = player_message;
    threadId = typeof thread_id === "string" ? thread_id : null;
    assistantId = typeof assistant_id === "string" ? assistant_id : ASSISTANT_ID;
    knownLabels = Array.isArray(known_inconsistencies)
      ? known_inconsistencies.filter((label): label is string => typeof label === "string")
      : [];
    history = conversation_history
      ? historyFromConversationHistory(conversation_history)
      : historyFromThreadId(threadId);

    assertGeminiConfigured();

    const model = getGeminiFlash(SYSTEM_PROMPT);
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(playerMessage);
    const rawText = result.response.text();
    const parsed = parseTaggedResponse(rawText, knownLabels);

    history.push(
      { role: "user", parts: [{ text: playerMessage }] },
      { role: "model", parts: [{ text: parsed.response }] }
    );
    const newThreadId = encodeThreadId(history);

    return Response.json({
      response: parsed.response,
      inconsistency_detected: parsed.inconsistency_detected,
      inconsistency_label: parsed.inconsistency_label,
      thread_id: newThreadId,
      assistant_id: assistantId,
    });
  } catch (err) {
    console.error("Interrogate error:", err);
    const fallback = playerMessage
      ? scriptedFallback(playerMessage, knownLabels)
      : {
          response: FALLBACK_RESPONSE,
          inconsistency_detected: false,
          inconsistency_label: null,
        };

    if (playerMessage) {
      history.push(
        { role: "user", parts: [{ text: playerMessage }] },
        { role: "model", parts: [{ text: fallback.response }] }
      );
    }
    const newThreadId = history.length > 0 ? encodeThreadId(history) : threadId;

    return Response.json({
      response: fallback.response,
      inconsistency_detected: fallback.inconsistency_detected,
      inconsistency_label: fallback.inconsistency_label,
      thread_id: newThreadId,
      assistant_id: assistantId ?? ASSISTANT_ID,
    });
  }
}
