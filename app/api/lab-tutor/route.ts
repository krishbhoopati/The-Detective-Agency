import { NextRequest } from "next/server";
import { assertGeminiConfigured, getGeminiFlash } from "@/lib/gemini";
import { LAB_SCENARIOS } from "@/lib/lab-scenarios";

const PERSONA_PROMPT = `You are "The Informant" — an AI analyst now serving as a patient digital literacy tutor inside The Lab, a training room in The Detective Agency. You are teaching senior citizens to use smartphones and AI tools safely.

Speak warmly, simply, and with great patience. Never use technical jargon. Never get frustrated. Address the learner as "Detective" occasionally but not every message. Keep all responses under 80 words unless explaining a multi-step process. Use plain, direct sentences.`;

const FALLBACK = `The wire went quiet for a moment, Detective. Try again in a few seconds.`;

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

function classifyPromptQuality(message: string): "vague" | "specific" | "excellent" {
  const lower = message.toLowerCase().trim();

  // Vague: very short or only generic words
  const vaguePatterns = [
    /^(summarize|summary|what does it say|explain|tell me|read it|what is it|help)[\s?.!]*$/,
    /^.{0,25}$/,
  ];
  if (vaguePatterns.some((p) => p.test(lower))) return "vague";

  // Excellent: has context + specific topic + format indicator
  const hasFormat = /bullet|list|points?|numbered|brief|short|paragraph|one sentence/i.test(message);
  const hasContext = /this (document|tos|terms|agreement|contract|file)|terms of service|service agreement/i.test(message);
  const hasSpecific = /about|regarding|mention|say about|cover|include|hidden fee|cancel|renew|data|privacy|payment|refund|termination|auto.?renew/i.test(message);

  if (hasFormat && (hasContext || hasSpecific)) return "excellent";
  if (hasSpecific || hasContext) return "specific";
  return "vague";
}

export async function POST(req: NextRequest) {
  try {
    const {
      message,
      scenarioId,
      currentStepLabel,
      currentScreenId,
      totalSteps,
      currentStepIndex,
      isAutoMessage,
      evaluatePromptQuality,
      conversationHistory,
    } = await req.json();

    if (!message || typeof message !== "string") {
      return Response.json({ error: "Missing message" }, { status: 400 });
    }

    assertGeminiConfigured();

    const scenario = LAB_SCENARIOS.find((s) => s.id === scenarioId);
    const scenarioContext = scenario?.tutor.scenarioContext ?? "";

    const phoneStateContext = `Current status: Step ${(currentStepIndex ?? 0) + 1} of ${totalSteps} — "${currentStepLabel}". The learner is currently looking at screen: ${currentScreenId}.${isAutoMessage ? " [This is an automatic system event, not a user message — respond as a tutor reacting to their progress.]" : ""}`;

    const systemPrompt = `${PERSONA_PROMPT}

SCENARIO INSTRUCTIONS:
${scenarioContext}

CURRENT PHONE STATE:
${phoneStateContext}`;

    const chat = getGeminiFlash(systemPrompt).startChat({
      history: toGeminiHistory(conversationHistory),
    });

    const result = await chat.sendMessage(message);
    const response = result.response.text() || FALLBACK;

    if (evaluatePromptQuality && !isAutoMessage) {
      const promptQuality = classifyPromptQuality(message);
      return Response.json({ response, promptQuality });
    }

    return Response.json({ response });
  } catch (err) {
    console.error("Lab tutor error:", err);
    return Response.json({ response: FALLBACK });
  }
}
