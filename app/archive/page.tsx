"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getArchive, ArchiveEntry } from "@/lib/archive";

export default function ArchivePage() {
  const [entries, setEntries] = useState<ArchiveEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setEntries(getArchive());
    setMounted(true);
  }, []);

  return (
    <main
      className="page-fade-in min-h-screen px-5 py-10"
      style={{
        backgroundColor: "var(--noir-dark)",
        backgroundImage:
          "radial-gradient(ellipse at top, rgba(200,169,110,0.1), transparent 46%), linear-gradient(135deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 18px)",
      }}
    >
      <div className="max-w-4xl mx-auto">
        <Link
          href="/cases"
          className="inline-flex min-h-[60px] items-center justify-center px-5 py-3 mb-8 text-xl font-bold transition-all hover:opacity-90 focus-visible:outline-2"
          style={{
            backgroundColor: "var(--noir-sepia)",
            color: "var(--noir-dark)",
          }}
        >
          Back to Open Cases
        </Link>

        <div className="mb-10">
          <h1
            className="text-4xl sm:text-5xl font-bold mb-4 uppercase"
            style={{ color: "var(--noir-sepia)" }}
          >
            AGENCY FILES
          </h1>
          <p className="text-[22px]" style={{ color: "var(--noir-cream)" }}>
            Cases closed. Criminals identified.
          </p>
        </div>

        {!mounted ? (
          <p className="text-[22px]" style={{ color: "var(--noir-cream)" }}>
            One moment, Detective...
          </p>
        ) : entries.length === 0 ? (
          <div
            className="p-8 border-2"
            style={{
              borderColor: "var(--noir-sepia)",
              backgroundColor: "var(--noir-paper)",
              color: "var(--noir-dark)",
            }}
          >
            <p className="text-[22px] leading-relaxed mb-6">
              No cases on file yet, Detective. Your work begins on the street.
            </p>
            <Link
              href="/cases"
              className="focus-on-paper inline-flex min-h-[60px] items-center px-3 text-xl font-bold hover:underline focus-visible:outline-2"
              style={{
                color: "var(--noir-dark)",
              }}
            >
              Open a case
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {entries.map((entry) => (
              <article
                key={entry.case_id}
                className="p-6 border-2"
                style={{
                  backgroundColor: "var(--noir-paper)",
                  borderColor: "var(--noir-sepia)",
                  color: "var(--noir-dark)",
                }}
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                  <div>
                    <h2
                      className="text-2xl font-bold leading-tight"
                      style={{ color: "var(--noir-dark)" }}
                    >
                      {entry.case_title}
                    </h2>
                    <p className="text-xl mt-2" style={{ color: "var(--text-on-paper-secondary)" }}>
                      {entry.scam_type}
                    </p>
                  </div>
                  <span
                    className="text-xl font-bold border-2 px-3 py-2 rotate-[-5deg] shrink-0"
                    style={{ borderColor: "var(--noir-red)", color: "var(--noir-red)" }}
                    aria-label="Case status: closed"
                  >
                    CLOSED
                  </span>
                </div>

                {entry.commendation && (
                  <p
                    className="text-xl italic leading-relaxed my-5 border-l-2 pl-4"
                    style={{ borderLeftColor: "var(--noir-sepia)", color: "var(--text-on-paper)" }}
                    aria-label="Commendation excerpt"
                  >
                    &ldquo;{entry.commendation.length > 120
                      ? entry.commendation.slice(0, 120) + "..."
                      : entry.commendation}&rdquo;
                  </p>
                )}

                <p className="text-xl" style={{ color: "var(--text-on-paper-secondary)" }}>
                  Closed{" "}
                  {new Date(entry.completed_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  with {entry.clues_found} clues logged
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
