"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCaseById, CaseData } from "@/lib/case-loader";
import { getArchive } from "@/lib/archive";
import CaseFolder from "@/components/CaseFolder";
import AudioController from "@/components/AudioController";
import { useEffect, useState } from "react";

const CASE_IDS = ["case-001", "case-002", "case-003"];

export default function CasesPage() {
  const router = useRouter();
  const cases = CASE_IDS.map((caseId) => getCaseById(caseId)).filter(
    (caseData): caseData is CaseData => Boolean(caseData)
  );
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const archive = getArchive();
    setSolvedIds(new Set(archive.map((e) => e.case_id)));
  }, []);

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

      <div className="max-w-6xl mx-auto relative z-10">
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
