"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAllCases } from "@/lib/case-loader";
import { getArchive } from "@/lib/archive";
import CaseFolder from "@/components/CaseFolder";
import AudioController from "@/components/AudioController";
import InformantChat, { InformantMessage } from "@/components/InformantChat";
import { useEffect, useState } from "react";

export default function CasesPage() {
  const router = useRouter();
  const cases = getAllCases();
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());
  const [checkedTutorial, setCheckedTutorial] = useState(false);

  useEffect(() => {
    const archive = getArchive();
    setSolvedIds(new Set(archive.map((e) => e.case_id)));

    if (!localStorage.getItem("tutorial_complete")) {
      router.push("/case/case-000");
      return;
    }

    setCheckedTutorial(true);
  }, [router]);

  const sendInformantMessage = async (
    message: string,
    conversationHistory: InformantMessage[]
  ) => {
    const response = await fetch("/api/informant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        conversation_history: conversationHistory,
      }),
    });

    if (!response.ok) throw new Error("Informant request failed");
    const data = (await response.json()) as { response?: string };
    return data.response ?? "The wire went quiet, Detective. Try again in a moment.";
  };

  return (
    <main
      className="page-fade-in min-h-screen px-5 py-10 relative overflow-hidden"
      style={{
        backgroundColor: "var(--noir-dark)",
        backgroundImage:
          "linear-gradient(90deg, rgba(200,169,110,0.04) 1px, transparent 1px), linear-gradient(rgba(200,169,110,0.04) 1px, transparent 1px), radial-gradient(ellipse at top, rgba(200,169,110,0.1), transparent 48%)",
        backgroundSize: "56px 56px, 56px 56px, 100% 100%",
      }}
    >
      <AudioController />
      <InformantChat onSendMessage={sendInformantMessage} />

      <div className="content-scale-down max-w-6xl mx-auto relative z-10">
        <Link
          href="/"
          className="inline-flex min-h-[60px] items-center gap-2 px-3 text-xl mb-8 hover:underline focus-visible:outline-2"
          style={{ color: "var(--noir-sepia)" }}
          aria-label="Back to headquarters"
        >
          Back to HQ
        </Link>

        <div className="mb-12">
          <h1
            className="text-4xl sm:text-5xl font-bold mb-4 uppercase"
            style={{ color: "var(--noir-sepia)" }}
          >
            OPEN CASES
          </h1>
          <p className="text-[22px]" style={{ color: "var(--noir-cream)" }}>
            Choose your assignment, Detective.
          </p>
        </div>

        {checkedTutorial ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {cases.map((c) => (
              <CaseFolder
                key={c.id}
                case_id={c.id}
                title={c.title}
                scam_type={c.scam_type}
                isCompleted={solvedIds.has(c.id)}
                isTutorial={c.is_tutorial}
                onClick={() => router.push(`/case/${c.id}`)}
              />
            ))}
          </div>
        ) : (
          <p className="text-[22px]" style={{ color: "var(--noir-cream)" }}>
            Opening your first assignment...
          </p>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/archive"
            className="inline-flex min-h-[60px] items-center justify-center px-4 text-xl hover:underline focus-visible:outline-2"
            style={{ color: "var(--noir-sepia)" }}
          >
            View Agency Files
          </Link>
        </div>
      </div>
    </main>
  );
}
