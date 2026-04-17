import { GoogleGenerativeAI } from "@google/generative-ai";

export const GEMINI_FLASH_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

export const geminiFlash = genAI.getGenerativeModel({
  model: GEMINI_FLASH_MODEL,
});

export function getGeminiFlash(systemInstruction?: string) {
  return genAI.getGenerativeModel({
    model: GEMINI_FLASH_MODEL,
    ...(systemInstruction ? { systemInstruction } : {}),
  });
}

export function assertGeminiConfigured() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
}

export default genAI;
