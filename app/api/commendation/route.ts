import { NextRequest } from "next/server";
import { assertGeminiConfigured, geminiFlash } from "@/lib/gemini";

const SYSTEM_CONTEXT = `You are the Chief of The Detective Agency, a noir 
detective bureau in 1940s style. A retired detective — a senior citizen — 
just solved a case involving a real modern digital scam. Write a 3-4 sentence 
commendation in warm noir style. Address them as "Detective." Be specific 
about the clues they found. Make them feel like a seasoned expert whose 
instincts are sharper than rookies half their age. Never be condescending. 
Never mention "learning" or "lesson" — they proved something they already knew. 
Keep it under 80 words. Use noir language: "sharp eye," "the rookie squad is 
taking notes," "the city is safer tonight."`;

const FALLBACK_COMMENDATION = `Detective, your instincts were sharp today. The city's con artists picked the wrong mark. The rookie squad is already studying your report. Case closed.`;

export async function POST(req: NextRequest) {
  try {
    const { case_id, case_title, scam_type, clues_found, total_clues, time_elapsed_seconds } =
      await req.json();

    if (
      !case_id ||
      !case_title ||
      !scam_type ||
      !Array.isArray(clues_found) ||
      typeof total_clues !== "number" ||
      typeof time_elapsed_seconds !== "number"
    ) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    assertGeminiConfigured();

    const prompt = `${SYSTEM_CONTEXT}

Detective just solved: ${case_title} (${scam_type})
Clues they identified: ${clues_found.join(", ")}
Total clues available: ${total_clues}
Time taken: ${time_elapsed_seconds} seconds

Write their commendation now.`;

    const result = await geminiFlash.generateContent(prompt);
    const commendation = result.response.text() || FALLBACK_COMMENDATION;

    return Response.json({ commendation });
  } catch (err) {
    console.error("Commendation error:", err);
    return Response.json({ commendation: FALLBACK_COMMENDATION });
  }
}
