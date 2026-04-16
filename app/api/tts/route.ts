import { NextRequest } from "next/server";
import { ElevenLabsClient } from "elevenlabs";

const CHIEF_VOICE_ID = "JBFqnCBsd6RMkjVDRZzb";

export async function POST(req: NextRequest) {
  try {
    const { text } = (await req.json()) as { text?: unknown };

    if (!text || typeof text !== "string") {
      return Response.json({ error: "Missing text" }, { status: 400 });
    }

    if (!process.env.ELEVENLABS_API_KEY) {
      return Response.json(
        { error: "ELEVENLABS_API_KEY is not configured" },
        { status: 503 }
      );
    }

    const client = new ElevenLabsClient({
      apiKey: process.env.ELEVENLABS_API_KEY,
    });

    const audio = await client.textToSpeech.convert(CHIEF_VOICE_ID, {
      text,
      model_id: "eleven_multilingual_v2",
      output_format: "mp3_44100_128",
    });

    const chunks: Buffer[] = [];
    for await (const chunk of audio) {
      chunks.push(Buffer.from(chunk));
    }

    const buffer = Buffer.concat(chunks);

    return new Response(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("TTS error:", err);
    return Response.json({ error: "TTS failed" }, { status: 500 });
  }
}
