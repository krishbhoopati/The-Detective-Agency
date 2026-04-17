"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SECTIONS = [
  {
    id: "llm",
    title: "What Is an LLM?",
    icon: "🤖",
    content: (
      <>
        <p>
          LLM stands for <strong>Large Language Model</strong> — a type of AI that has read
          enormous amounts of text and learned to generate new writing that sounds human.
        </p>
        <p className="mt-4">
          Think of it like a very well-read assistant who can write emails, answer questions, and
          hold a conversation — but who has no real-world experiences of their own.
        </p>
        <p className="mt-4">
          Examples you may have heard of: ChatGPT, Gemini, Claude.
        </p>
      </>
    ),
  },
  {
    id: "scams",
    title: "How Scammers Use AI",
    icon: "⚠️",
    content: (
      <>
        <p>Criminals now use AI to make scams harder to spot. Common tactics include:</p>
        <ul className="mt-4 space-y-3 list-none">
          {[
            ["Phishing emails", "AI writes convincing messages pretending to be your bank, the IRS, or Amazon — no spelling mistakes, perfect grammar."],
            ["Voice cloning", "Scammers record a few seconds of someone's voice (from social media) and clone it to fake emergency calls from &ldquo;family members.&rdquo;"],
            ["Fake profiles", "AI generates realistic photos and bios for people who don't exist to build trust before asking for money."],
            ["Deepfake video", "AI can put anyone's face into a video — used in fake investment testimonials or impersonation schemes."],
          ].map(([term, desc]) => (
            <li key={term} className="border-l-4 pl-4" style={{ borderColor: "var(--noir-sepia)" }}>
              <strong className="block" style={{ color: "var(--noir-sepia)" }}>{term}</strong>
              <span dangerouslySetInnerHTML={{ __html: desc as string }} />
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "redflags",
    title: "Red Flags to Spot",
    icon: "🚩",
    content: (
      <>
        <p>When something feels off online, check for these warning signs:</p>
        <ul className="mt-4 space-y-3">
          {[
            "Urgency — \"Act NOW or lose your account!\" Legitimate organisations don't pressure you like this.",
            "Requests for gift cards, wire transfers, or cryptocurrency. No real business uses these as payment.",
            "Links that look almost right — \"amaz0n.com\" instead of \"amazon.com.\"",
            "Someone you've never met in person asking for personal information or money.",
            "Calls from family members in distress who refuse to let you call back on a number you know.",
          ].map((flag, i) => (
            <li key={i} className="flex gap-3">
              <span className="shrink-0 font-retro text-xs mt-1" style={{ color: "var(--noir-sepia)" }}>
                0{i + 1}
              </span>
              <span>{flag}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "glossary",
    title: "Agency Glossary",
    icon: "📖",
    content: (
      <dl className="space-y-4">
        {[
          ["LLM", "Large Language Model. An AI trained on massive amounts of text to generate human-like writing."],
          ["Phishing", "A fake message designed to trick you into giving up passwords, money, or personal details."],
          ["Social engineering", "Manipulating people emotionally (fear, urgency, trust) to get them to do something harmful."],
          ["Deepfake", "AI-generated video or audio that realistically shows someone saying or doing something they never did."],
          ["Two-factor authentication (2FA)", "A second step when logging in — like a code texted to your phone — that stops hackers even if they have your password."],
          ["URL spoofing", "Making a fake web address look almost identical to a real one to trick you into entering your credentials."],
        ].map(([term, def]) => (
          <div key={term}>
            <dt className="font-retro text-xs" style={{ color: "var(--noir-sepia)" }}>
              {term}
            </dt>
            <dd className="mt-1 ml-4">{def}</dd>
          </div>
        ))}
      </dl>
    ),
  },
];

export default function LiteracyPage() {
  const router = useRouter();
  const [openSection, setOpenSection] = useState<string | null>("llm");

  return (
    <main
      className="page-fade-in min-h-screen"
      style={{ backgroundColor: "var(--noir-dark)", color: "var(--noir-cream)" }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b-2"
        style={{ backgroundColor: "var(--noir-dark)", borderColor: "var(--noir-sepia)" }}
      >
        <button
          type="button"
          onClick={() => router.push("/")}
          className="font-typewriter text-lg hover:underline focus-visible:outline-2"
          style={{ color: "var(--noir-sepia)" }}
          aria-label="Back to the Detective's Desk"
        >
          ← Back to Desk
        </button>
        <div
          className="font-retro text-xs hidden sm:block"
          style={{ color: "var(--noir-sepia)" }}
        >
          FIELD MANUAL
        </div>
      </div>

      {/* Page Title */}
      <div className="max-w-2xl mx-auto px-5 pt-10 pb-6">
        <div
          className="inline-block border-2 px-4 py-2 text-sm font-bold uppercase mb-6"
          style={{ borderColor: "var(--noir-sepia)", color: "var(--noir-sepia)" }}
        >
          Digital Crimes Division
        </div>
        <h1
          className="font-typewriter text-4xl sm:text-5xl font-bold leading-tight mb-4"
          style={{ color: "var(--noir-sepia)" }}
        >
          The LLM Field Manual
        </h1>
        <p className="text-xl leading-relaxed" style={{ color: "var(--noir-cream)" }}>
          Everything you need to understand AI, spot digital scams, and protect the people
          who rely on you.
        </p>
      </div>

      {/* Accordion Sections */}
      <div className="max-w-2xl mx-auto px-5 pb-16 space-y-4">
        {SECTIONS.map((section) => {
          const isOpen = openSection === section.id;
          return (
            <div
              key={section.id}
              className="border-2"
              style={{ borderColor: isOpen ? "var(--noir-sepia)" : "var(--noir-medium)" }}
            >
              <button
                type="button"
                onClick={() => setOpenSection(isOpen ? null : section.id)}
                className="w-full flex items-center justify-between px-6 py-5 text-left transition-colors"
                style={{
                  backgroundColor: isOpen ? "rgba(200,169,110,0.12)" : "var(--noir-medium)",
                  color: isOpen ? "var(--noir-sepia)" : "var(--noir-cream)",
                }}
                aria-expanded={isOpen}
              >
                <span className="flex items-center gap-3 font-typewriter text-xl sm:text-2xl font-bold">
                  <span aria-hidden="true">{section.icon}</span>
                  {section.title}
                </span>
                <span
                  className="font-retro text-xs transition-transform duration-300"
                  style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
                  aria-hidden="true"
                >
                  ▶
                </span>
              </button>

              {isOpen && (
                <div
                  className="px-6 py-6 text-xl leading-relaxed border-t-2"
                  style={{
                    borderColor: "var(--noir-sepia)",
                    color: "var(--noir-cream)",
                  }}
                >
                  {section.content}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div
        className="max-w-2xl mx-auto px-5 pb-16 text-center"
      >
        <p className="font-typewriter text-xl mb-6" style={{ color: "var(--noir-cream)" }}>
          Ready to put your knowledge to the test?
        </p>
        <button
          type="button"
          onClick={() => router.push("/cases")}
          className="inline-flex items-center justify-center px-10 py-5 font-typewriter text-xl font-bold transition-all hover:translate-y-[-2px] hover:shadow-2xl focus-visible:outline-2"
          style={{
            backgroundColor: "var(--noir-sepia)",
            color: "var(--noir-dark)",
            boxShadow: "0 4px 30px rgba(200, 169, 110, 0.3)",
          }}
          aria-label="Go to case browser and take a case"
        >
          Take a Case →
        </button>
      </div>
    </main>
  );
}
