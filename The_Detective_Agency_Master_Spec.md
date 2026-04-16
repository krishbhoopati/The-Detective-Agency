# The Detective Agency: Master Implementation Spec

**Context for AI Agent:** You are building a web-based, interactive narrative game called "The Detective Agency" for the GenLink Hacks hackathon. The target audience is senior citizens (65+). The goal is to teach digital literacy by reframing the user as a seasoned, retired detective solving digital crimes. Read this entire document before writing a single line of code.

**The Three Pillars of Gameplay:**
1. **Scam Detection:** Identifying phishing, fake websites, grandparent scams, and social engineering.
2. **Tech Navigation:** Learning to navigate device settings, menus, and apps through a simulated phone UI.
3. **LLM Literacy:** Actively using an AI assistant ("The Informant") to accomplish investigation tasks.

**Design Mandates:**
- **Aesthetic:** 1940s Noir — sepia tones, high contrast, typewriter fonts, wooden desk UI
- **Accessibility:** Minimum 20px body text, 60×60px touch targets, no time limits, opt-in audio only
- **Senior UX:** Never shame the user. Never use the word "wrong." Every interaction affirms competence.

**Tech Stack:**
- Framework: Next.js 14 (App Router) + TypeScript
- Styling: Tailwind CSS + CSS variables for noir tokens
- Animation: Framer Motion
- Icons: lucide-react
- LLM: Google Gemini API (free tier, no credit card required)
- Voice: ElevenLabs (Phase 5)
- Storage: Browser localStorage (no database)
- Hosting: Vercel (free tier)

**LLM Provider Rationale — Why Gemini:**
Gemini 2.5 Flash free tier provides 1,500 requests/day and 15 RPM with no credit card required — get your API key at aistudio.google.com in under 2 minutes. OpenRouter's free tier caps at 200 requests/day. For a hackathon demo with multiple judges and live senior users, Gemini's limits are dramatically safer. Use model `gemini-2.5-flash` throughout.

---

## CSS Variables (use throughout all components)

```css
:root {
  --noir-dark: #1A1A1A;
  --noir-sepia: #C8A96E;
  --noir-cream: #F5F0E8;
  --noir-paper: #E8DFC8;
  --noir-red: #8B0000;
  --noir-shadow: rgba(0, 0, 0, 0.6);
}
```

**Fonts:** Import `Special Elite` (typewriter, for documents and headings) and `Inter` (clean sans-serif, for UI buttons and labels) from Google Fonts in `app/layout.tsx`.

**Minimum font sizes:** Body 20px, headings 28px+, labels 16px minimum.

---

## File Structure

```
detective-agency/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                      # Landing page
│   ├── cases/
│   │   └── page.tsx                  # Case selection desk
│   ├── case/
│   │   └── [id]/
│   │       └── page.tsx              # Active case gameplay
│   ├── archive/
│   │   └── page.tsx                  # Solved cases archive
│   └── api/
│       ├── commendation/
│       │   └── route.ts              # POST — AI case commendation
│       ├── interrogate/
│       │   └── route.ts              # POST — AI scammer roleplay (Case 3)
│       └── informant/
│           └── route.ts              # POST — The Informant chat assistant
├── data/
│   ├── case-000.json                 # Tutorial (Case 0)
│   ├── case-001.json                 # The Grandson's Gambit
│   ├── case-002.json                 # The Urgent Invoice
│   ├── case-003.json                 # The Tech Support Trap
│   └── case-004.json                 # The Hidden Message (phone sim)
├── lib/
│   ├── gemini.ts                     # Gemini client singleton
│   ├── case-loader.ts                # Load and validate case JSON
│   └── archive.ts                    # localStorage helpers
├── components/
│   ├── EvidenceViewer.tsx
│   ├── ClueStamp.tsx
│   ├── DeductionBuilder.tsx
│   ├── CommendationCard.tsx
│   ├── InterrogationChat.tsx
│   ├── InformantChat.tsx
│   ├── PhoneSimulator.tsx
│   ├── CaseFolder.tsx
│   └── AudioController.tsx
└── public/
    └── audio/
        ├── rain.mp3
        ├── jazz.mp3
        └── typewriter.mp3
```

---

## Environment Variables

```bash
# .env.local
GEMINI_API_KEY=your_key_here
ELEVENLABS_API_KEY=your_key_here   # Phase 5 only
```

**Getting your Gemini API key (free, no credit card):**
1. Go to aistudio.google.com
2. Sign in with any Google account
3. Click "Get API Key" → "Create API key"
4. Copy and paste into `.env.local`

---

## Phase 1 — Project Scaffold + Case Data

**Goal:** Initialize the project, install all dependencies, create all case JSON files, and build the Gemini client. No real UI yet — placeholder divs only.

### Step 1 — Initialize project

```bash
npx create-next-app@latest detective-agency --typescript --tailwind --app
cd detective-agency
npm install framer-motion lucide-react @google/generative-ai elevenlabs
```

### Step 2 — Configure Tailwind

In `tailwind.config.ts`, extend the theme with noir color tokens:

```typescript
extend: {
  colors: {
    "noir-dark": "#1A1A1A",
    "noir-sepia": "#C8A96E",
    "noir-cream": "#F5F0E8",
    "noir-paper": "#E8DFC8",
    "noir-red": "#8B0000",
  },
  fontFamily: {
    typewriter: ["Special Elite", "serif"],
    ui: ["Inter", "sans-serif"],
  },
}
```

In `app/globals.css`, add Google Fonts import and CSS variable declarations:

```css
@import url('https://fonts.googleapis.com/css2?family=Special+Elite&family=Inter:wght@400;600&display=swap');

:root {
  --noir-dark: #1A1A1A;
  --noir-sepia: #C8A96E;
  --noir-cream: #F5F0E8;
  --noir-paper: #E8DFC8;
  --noir-red: #8B0000;
}
```

### Step 3 — Create lib/gemini.ts

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const geminiFlash = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export default genAI;
```

### Step 4 — Create lib/archive.ts

```typescript
export interface ArchiveEntry {
  case_id: string;
  case_title: string;
  scam_type: string;
  commendation: string;
  completed_at: string;
  clues_found: number;
}

export function saveCompletedCase(entry: ArchiveEntry): void {
  try {
    const existing = getArchive();
    const updated = [entry, ...existing.filter(e => e.case_id !== entry.case_id)];
    localStorage.setItem("detective_archive", JSON.stringify(updated));
  } catch { /* localStorage unavailable — fail silently */ }
}

export function getArchive(): ArchiveEntry[] {
  try {
    const raw = localStorage.getItem("detective_archive");
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function clearArchive(): void {
  try { localStorage.removeItem("detective_archive"); } catch { /* silent */ }
}
```

### Step 5 — Create lib/case-loader.ts

```typescript
import case000 from "@/data/case-000.json";
import case001 from "@/data/case-001.json";
import case002 from "@/data/case-002.json";
import case003 from "@/data/case-003.json";
import case004 from "@/data/case-004.json";

const ALL_CASES = [case000, case001, case002, case003, case004] as CaseData[];

export interface Hotspot {
  id: string;
  label: string;
  explanation: string;
  position: { top: string; left: string; width: string; height: string };
  tutorial_hint?: string;
}

export interface DeductionOption {
  id: string;
  text: string;
  is_correct: boolean;
}

export interface PhoneSimStep {
  step: number;
  screen: string;
  instruction: string;
  target_id: string;
}

export interface CaseData {
  id: string;
  title: string;
  scam_type: string;
  briefing: string;
  evidence: { type: string; html: string };
  hotspots: Hotspot[];
  min_clues_to_deduce: number;
  deduction_options: DeductionOption[];
  learning_summary: string;
  has_interrogation: boolean;
  is_tutorial?: boolean;
  is_phone_sim?: boolean;
  phone_sim_steps?: PhoneSimStep[];
}

export function getAllCases(): Pick<CaseData, "id" | "title" | "scam_type" | "is_tutorial" | "is_phone_sim">[] {
  return ALL_CASES.map(({ id, title, scam_type, is_tutorial, is_phone_sim }) => ({
    id, title, scam_type, is_tutorial, is_phone_sim
  }));
}

export function getCaseById(id: string): CaseData | null {
  return ALL_CASES.find(c => c.id === id) ?? null;
}
```

### Step 6 — Create all five case JSON files

**data/case-000.json** (Tutorial):
```json
{
  "id": "case-000",
  "title": "Welcome to the Agency",
  "scam_type": "Tutorial",
  "briefing": "Detective. Before we put you on a real case, let us show you how we operate around here. This is a practice run. No pressure — we just want to make sure you know your tools.",
  "evidence": {
    "type": "sms",
    "html": "<div style='background:#1a1a2e;padding:20px;border-radius:8px;font-family:sans-serif;max-width:380px;margin:0 auto'><div style='color:#888;font-size:13px;margin-bottom:12px;text-align:center'>Messages</div><div style='background:#2d2d2d;border-radius:12px;padding:12px 16px;margin-bottom:8px;max-width:85%'><div style='color:#aaa;font-size:12px;margin-bottom:4px'>Unknown Number</div><div style='color:#fff;font-size:18px;line-height:1.6'>Hi grandma! It's Tommy. I lost my phone and borrowed a friend's. Can you call me back?</div></div><div style='background:#0084ff;border-radius:12px;padding:12px 16px;margin-bottom:8px;max-width:85%;margin-left:auto'><div style='color:#fff;font-size:18px;line-height:1.6'>Tommy? Is this really you?</div></div><div style='background:#2d2d2d;border-radius:12px;padding:12px 16px;max-width:85%'><div style='color:#fff;font-size:18px;line-height:1.6'>Yes grandma! Please don't tell mom and dad yet. I need help urgently.</div></div></div>"
  },
  "hotspots": [
    {
      "id": "tutorial-clue-1",
      "label": "Unknown phone number",
      "explanation": "The message came from a number not saved in any contacts. Your real grandson's number would already be in your phone.",
      "position": { "top": "8%", "left": "5%", "width": "90%", "height": "13%" },
      "tutorial_hint": "Tap the top of the message where it says 'Unknown Number' — that is your first clue."
    },
    {
      "id": "tutorial-clue-2",
      "label": "Secrecy request",
      "explanation": "Asking you to keep a secret from family is a classic pressure tactic. Real family emergencies do not require secrecy.",
      "position": { "top": "72%", "left": "5%", "width": "90%", "height": "22%" },
      "tutorial_hint": "Now tap the last message — what is the sender asking you to keep secret?"
    }
  ],
  "min_clues_to_deduce": 2,
  "deduction_options": [
    { "id": "correct", "text": "This looks suspicious — unknown number and secrecy request are warning signs", "is_correct": true },
    { "id": "wrong-1", "text": "This is probably my grandson — I should respond right away", "is_correct": false }
  ],
  "learning_summary": "Always verify by calling your grandchild on their real, saved number before responding to messages from unknown numbers.",
  "has_interrogation": false,
  "is_tutorial": true
}
```

**data/case-001.json** (Grandparent Scam):
```json
{
  "id": "case-001",
  "title": "The Grandson's Gambit",
  "scam_type": "Grandparent Scam",
  "briefing": "Detective, a senior citizen just reported a suspicious text message. Someone claiming to be her grandson is demanding gift cards and asking her to keep it secret. Something does not add up. Examine the evidence.",
  "evidence": {
    "type": "sms",
    "html": "<div style='background:#1a1a2e;padding:20px;border-radius:8px;font-family:sans-serif;max-width:380px;margin:0 auto'><div style='color:#888;font-size:13px;margin-bottom:12px;text-align:center'>Messages</div><div style='background:#2d2d2d;border-radius:12px;padding:12px 16px;margin-bottom:8px;max-width:85%'><div style='color:#aaa;font-size:12px;margin-bottom:4px'>+1 (347) 829-4401 — Unknown</div><div style='color:#fff;font-size:18px;line-height:1.6'>Grandma it's me Danny. I'm in trouble. I got arrested and I need bail money RIGHT NOW. Please don't tell mom and dad.</div></div><div style='background:#2d2d2d;border-radius:12px;padding:12px 16px;margin-bottom:8px;max-width:85%'><div style='color:#fff;font-size:18px;line-height:1.6'>I need you to go to Walgreens and buy $500 in Google Play gift cards. Scratch the back and send me the numbers. TODAY ONLY or I stay in jail.</div></div><div style='background:#2d2d2d;border-radius:12px;padding:12px 16px;max-width:85%'><div style='color:#fff;font-size:18px;line-height:1.6'>Please grandma I'm scared. Don't tell anyone, they said it'll make things worse. I love you.</div></div></div>"
  },
  "hotspots": [
    {
      "id": "clue-unknown-number",
      "label": "Unknown phone number",
      "explanation": "This number is not saved in any contacts. Your real grandson's number would already be saved in your phone.",
      "position": { "top": "7%", "left": "5%", "width": "90%", "height": "10%" }
    },
    {
      "id": "clue-urgency",
      "label": "Extreme urgency — 'RIGHT NOW', 'TODAY ONLY'",
      "explanation": "Scammers create artificial urgency to stop you from thinking clearly or calling someone you trust first.",
      "position": { "top": "27%", "left": "5%", "width": "90%", "height": "10%" }
    },
    {
      "id": "clue-gift-cards",
      "label": "Gift card payment request",
      "explanation": "No legitimate emergency ever requires payment in gift cards. This is always a scam. Police, bail bondsmen, and lawyers never accept gift cards.",
      "position": { "top": "36%", "left": "5%", "width": "90%", "height": "20%" }
    },
    {
      "id": "clue-secrecy",
      "label": "Secrecy demand — 'don't tell mom and dad'",
      "explanation": "Asking you to keep it secret from family cuts off your support network. Real emergencies welcome family involvement.",
      "position": { "top": "57%", "left": "5%", "width": "90%", "height": "10%" }
    },
    {
      "id": "clue-emotional-pressure",
      "label": "Emotional pressure — 'I'm scared', 'I love you'",
      "explanation": "Scammers use emotional manipulation to override your natural skepticism. A real grandchild would understand if you took a moment to verify.",
      "position": { "top": "73%", "left": "5%", "width": "90%", "height": "20%" }
    }
  ],
  "min_clues_to_deduce": 3,
  "deduction_options": [
    { "id": "correct", "text": "Grandparent scam — unknown number, gift card demand, and secrecy are the three classic markers", "is_correct": true },
    { "id": "wrong-1", "text": "Legitimate emergency — the grandson needs help immediately", "is_correct": false },
    { "id": "wrong-2", "text": "Wrong number — someone is confused", "is_correct": false }
  ],
  "learning_summary": "Real emergencies never require gift cards. Always hang up and call your grandchild directly on their saved number to verify before doing anything.",
  "has_interrogation": false
}
```

**data/case-002.json** (Phishing Email):
```json
{
  "id": "case-002",
  "title": "The Urgent Invoice",
  "scam_type": "Phishing Email",
  "briefing": "Detective, a victim forwarded us a suspicious email. It looks official but something is off. The sender claims their Amazon account has been compromised and demands immediate action. Examine every detail carefully.",
  "evidence": {
    "type": "email",
    "html": "<div style='background:#fff;padding:24px;font-family:Arial,sans-serif;max-width:560px;margin:0 auto;border:1px solid #ddd'><div style='border-bottom:1px solid #eee;padding-bottom:12px;margin-bottom:16px'><div style='font-size:13px;color:#666;margin-bottom:4px'>From: <span style='color:#c00'>security-alert@amaz0n-support.com</span></div><div style='font-size:13px;color:#666;margin-bottom:4px'>To: customer@email.com</div><div style='font-size:13px;color:#666;margin-bottom:4px'>Subject: ⚠️ URGENT: Your Amazon Account Has Been Compromised</div></div><div style='color:#333'><p style='font-size:17px;line-height:1.7'>Dear Valued Customer,</p><p style='font-size:17px;line-height:1.7'>We have detected <strong>unauthorized access</strong> to your Amazon account. Your account will be <strong style='color:#c00'>permanently closed within 24 hours</strong> unless you verify your identity immediately.</p><p style='font-size:17px;line-height:1.7'>Click the link below to verify your account now:</p><div style='background:#f5f5f5;padding:12px;border-radius:4px;margin:16px 0;word-break:break-all;font-size:14px;color:#0066cc'>http://amazon-account-verify.suspicious-login.net/secure/verify?id=8472</div><p style='font-size:17px;line-height:1.7'>You will need to provide your password, Social Security Number, and credit card information to restore access.</p><p style='font-size:17px;line-height:1.7'>Sincerely,<br>Amazon Security Team</p></div></div>"
  },
  "hotspots": [
    {
      "id": "clue-fake-domain",
      "label": "Fake email domain — amaz0n-support.com",
      "explanation": "The real Amazon only sends email from amazon.com. Look closely — this uses a zero (0) instead of the letter 'o', plus an extra '-support'. This is a spoofed domain.",
      "position": { "top": "8%", "left": "5%", "width": "90%", "height": "8%" }
    },
    {
      "id": "clue-generic-greeting",
      "label": "Generic greeting — 'Dear Valued Customer'",
      "explanation": "Amazon knows your real name and always addresses you personally in legitimate emails. 'Valued Customer' means they don't actually know who you are.",
      "position": { "top": "32%", "left": "5%", "width": "90%", "height": "8%" }
    },
    {
      "id": "clue-threat",
      "label": "Threatening language — 'permanently closed within 24 hours'",
      "explanation": "Legitimate companies give you time to respond and contact their official support. Fake emails create panic with threats to stop you from thinking.",
      "position": { "top": "40%", "left": "5%", "width": "90%", "height": "10%" }
    },
    {
      "id": "clue-suspicious-link",
      "label": "Suspicious link URL — not amazon.com",
      "explanation": "The link goes to 'suspicious-login.net', not amazon.com. The real Amazon website always starts with amazon.com, never anything else.",
      "position": { "top": "55%", "left": "5%", "width": "90%", "height": "10%" }
    },
    {
      "id": "clue-ssn-request",
      "label": "Requests Social Security Number and credit card",
      "explanation": "Amazon never asks for your Social Security Number. No legitimate company asks for your SSN or full credit card via email. This is identity theft.",
      "position": { "top": "67%", "left": "5%", "width": "90%", "height": "10%" }
    }
  ],
  "min_clues_to_deduce": 3,
  "deduction_options": [
    { "id": "correct", "text": "Phishing email — fake domain, generic greeting, and SSN request are the giveaways", "is_correct": true },
    { "id": "wrong-1", "text": "Legitimate Amazon security alert — I should click the link and verify", "is_correct": false },
    { "id": "wrong-2", "text": "Spam email — harmless, just ignore it", "is_correct": false }
  ],
  "learning_summary": "Always check the sender's email address carefully. When in doubt, go directly to amazon.com in your browser — never click links in emails. Amazon never asks for your Social Security Number.",
  "has_interrogation": false
}
```

**data/case-003.json** (Tech Support Scam with AI interrogation):
```json
{
  "id": "case-003",
  "title": "The Tech Support Trap",
  "scam_type": "Fake Tech Support",
  "briefing": "Detective, a victim's computer showed a terrifying pop-up claiming to be from Microsoft. It would not close. They called the number. We need you to examine the pop-up evidence, then interrogate the suspect on the phone. Expose three lies and we have our case.",
  "evidence": {
    "type": "popup",
    "html": "<div style='background:#0078d4;padding:0;font-family:Arial,sans-serif;max-width:560px;margin:0 auto;border:3px solid #005a9e'><div style='background:#c00;padding:8px 16px;color:#fff;font-size:14px;display:flex;justify-content:space-between'><span>⚠️ Windows Security Alert</span><span style='cursor:pointer;opacity:0.5'>✕</span></div><div style='background:#fff;padding:24px'><div style='text-align:center;margin-bottom:16px'><div style='font-size:48px'>🔒</div><div style='font-size:22px;font-weight:bold;color:#c00;margin:8px 0'>YOUR COMPUTER HAS BEEN LOCKED</div></div><p style='font-size:17px;line-height:1.7;color:#333'>A virus has been detected on your computer. Your personal data, banking information, and passwords are at risk of being stolen.</p><p style='font-size:17px;line-height:1.7;color:#c00;font-weight:bold'>DO NOT CLOSE THIS WINDOW OR RESTART YOUR COMPUTER.</p><p style='font-size:17px;line-height:1.7;color:#333'>Call Microsoft Support IMMEDIATELY:</p><div style='text-align:center;font-size:28px;font-weight:bold;color:#0078d4;margin:16px 0'>1-800-642-7676</div><p style='font-size:14px;color:#999;text-align:center'>This page is displayed from: secure-microsoft-alert.xyz — Windows Defender Firewall</p></div></div>"
  },
  "hotspots": [
    {
      "id": "clue-allcaps-alarm",
      "label": "ALL-CAPS alarming language designed to cause panic",
      "explanation": "Real Microsoft notifications are calm and professional. Screaming all-caps text is designed to frighten you into acting without thinking.",
      "position": { "top": "22%", "left": "5%", "width": "90%", "height": "10%" }
    },
    {
      "id": "clue-unofficial-number",
      "label": "Unofficial phone number — not on microsoft.com",
      "explanation": "Microsoft's real support number is on microsoft.com/support. Any pop-up that gives you a phone number to call is a scam — real alerts link to their website.",
      "position": { "top": "60%", "left": "5%", "width": "90%", "height": "12%" }
    },
    {
      "id": "clue-do-not-close",
      "label": "Warning not to close the window",
      "explanation": "Legitimate security software wants you to close and restart your computer. Telling you NOT to close it is a trap to keep you panicking.",
      "position": { "top": "43%", "left": "5%", "width": "90%", "height": "9%" }
    },
    {
      "id": "clue-wrong-url",
      "label": "Website URL is not microsoft.com",
      "explanation": "The small print shows this page comes from 'secure-microsoft-alert.xyz' — not microsoft.com. Microsoft's websites always end in microsoft.com.",
      "position": { "top": "87%", "left": "5%", "width": "90%", "height": "10%" }
    }
  ],
  "min_clues_to_deduce": 3,
  "deduction_options": [
    { "id": "correct", "text": "Fake tech support scam — unofficial URL, unofficial number, and 'do not close' warning expose this", "is_correct": true },
    { "id": "wrong-1", "text": "Legitimate Microsoft warning — I should call the number immediately", "is_correct": false },
    { "id": "wrong-2", "text": "Real virus — I need professional help right away", "is_correct": false }
  ],
  "learning_summary": "Microsoft never locks your computer or calls you unsolicited. If you see a scary pop-up, force-close your browser. If your computer seems locked, restart it. Never call a number from a pop-up.",
  "has_interrogation": true
}
```

**data/case-004.json** (Phone Navigation Mini-Game):
```json
{
  "id": "case-004",
  "title": "The Hidden Message",
  "scam_type": "App Navigation",
  "briefing": "Detective, a suspicious message arrived on a victim's phone — then vanished. It was automatically archived. You will need to navigate their phone to find it. Tap the icons and menus just like you would on a real phone.",
  "evidence": { "type": "phone_sim", "html": "" },
  "hotspots": [],
  "min_clues_to_deduce": 1,
  "deduction_options": [
    { "id": "correct", "text": "Found it — the archived message was from an unknown number asking for gift cards", "is_correct": true }
  ],
  "learning_summary": "Messages don't disappear — they get archived. Check your archived or spam folder if an important or suspicious message seems to have vanished.",
  "has_interrogation": false,
  "is_phone_sim": true,
  "phone_sim_steps": [
    { "step": 1, "screen": "home", "instruction": "Tap the Messages app to open it.", "target_id": "messages-icon" },
    { "step": 2, "screen": "messages_inbox", "instruction": "The message is not here. Tap the menu icon (☰) in the top corner to see more options.", "target_id": "menu-icon" },
    { "step": 3, "screen": "messages_menu", "instruction": "Tap 'Archived Messages' to look inside.", "target_id": "archived-option" },
    { "step": 4, "screen": "archived", "instruction": "There it is. Tap the suspicious message to open it.", "target_id": "suspicious-message" }
  ]
}
```

---

## Phase 2 — Gemini API Routes

**Goal:** Implement all three AI API routes using the Gemini SDK. Do not touch any UI files during this phase.

### Route 1 — POST /api/commendation

Single-turn call. Takes case completion data, returns a personalized noir-style commendation.

```typescript
// app/api/commendation/route.ts
import { NextRequest } from "next/server";
import { geminiFlash } from "@/lib/gemini";

const SYSTEM_CONTEXT = `You are the Chief of The Detective Agency, a noir 
detective bureau in 1940s style. A retired detective — a senior citizen — 
just solved a case involving a real modern digital scam. Write a 3-4 sentence 
commendation in warm noir style. Address them as "Detective." Be specific 
about the clues they found. Make them feel like a seasoned expert whose 
instincts are sharper than rookies half their age. Never be condescending. 
Never mention "learning" or "lesson" — they proved something they already knew. 
Keep it under 80 words. Use noir language: "sharp eye," "the rookie squad is 
taking notes," "the city is safer tonight."`;

const FALLBACK = `Detective, your instincts were sharp today. The city's con 
artists picked the wrong mark. The rookie squad is already studying your 
report. Case closed.`;

export async function POST(req: NextRequest) {
  try {
    const { case_title, scam_type, clues_found, total_clues, time_elapsed_seconds }
      = await req.json();

    if (!case_title || !clues_found) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    const prompt = `${SYSTEM_CONTEXT}

Detective just solved: ${case_title} (${scam_type})
Clues they identified: ${(clues_found as string[]).join(", ")}
Total clues available: ${total_clues}
Time taken: ${time_elapsed_seconds} seconds

Write their commendation now.`;

    const result = await geminiFlash.generateContent(prompt);
    const commendation = result.response.text() ?? FALLBACK;

    return Response.json({ commendation });
  } catch (err) {
    console.error("Commendation error:", err);
    return Response.json({ commendation: FALLBACK });
  }
}
```

### Route 2 — POST /api/interrogate

Multi-turn stateless call. The client sends the full conversation history on every request.

```typescript
// app/api/interrogate/route.ts
import { NextRequest } from "next/server";
import { geminiFlash } from "@/lib/gemini";

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

Reveal these naturally. Do not volunteer them, but do not hide them when probed.

After your in-character response, on a new line write exactly:
INCONSISTENCY: [short label]
...if this exchange revealed one of the three inconsistencies, or:
INCONSISTENCY: none
...if not. This line will be stripped before showing the player.

Safety rules: Never provide real scam techniques beyond what is described. 
Never request real personal information. Keep responses under 60 words. 
If the user seems distressed, break character: 
"Remember, Detective — this is a training simulation. You are doing great."`;

const FALLBACK_RESPONSE = "I'll need to put you on a brief hold, sir/ma'am.";

export async function POST(req: NextRequest) {
  try {
    const { conversation_history, player_message } = await req.json();

    if (!player_message) {
      return Response.json({ error: "Missing player_message" }, { status: 400 });
    }

    // Build Gemini chat history format
    const history = (conversation_history ?? []).map((msg: { role: string; content: string }) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const chat = geminiFlash.startChat({
      history,
      systemInstruction: SYSTEM_PROMPT,
    });

    const result = await chat.sendMessage(player_message);
    const raw = result.response.text() ?? FALLBACK_RESPONSE;

    // Parse and strip INCONSISTENCY tag
    const lines = raw.split("\n");
    const inconsistencyLine = lines.find(l => l.startsWith("INCONSISTENCY:"));
    const cleanResponse = lines
      .filter(l => !l.startsWith("INCONSISTENCY:"))
      .join("\n")
      .trim();

    const label = inconsistencyLine
      ? inconsistencyLine.replace("INCONSISTENCY:", "").trim()
      : "none";
    const detected = label.toLowerCase() !== "none";

    return Response.json({
      response: cleanResponse || FALLBACK_RESPONSE,
      inconsistency_detected: detected,
      inconsistency_label: detected ? label : null,
    });
  } catch (err) {
    console.error("Interrogate error:", err);
    return Response.json({
      response: FALLBACK_RESPONSE,
      inconsistency_detected: false,
      inconsistency_label: null,
    });
  }
}
```

**Frontend note for InterrogationChat.tsx:** Maintain a `conversationHistory` array in React state. After each exchange, append both the player message and assistant response. Send the array (excluding the current message) on every request. This is what keeps the scammer conversation coherent across turns without any server-side session.

### Route 3 — POST /api/informant

The persistent AI assistant available on every case screen.

```typescript
// app/api/informant/route.ts
import { NextRequest } from "next/server";
import { geminiFlash } from "@/lib/gemini";

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

export async function POST(req: NextRequest) {
  try {
    const { conversation_history, message } = await req.json();

    if (!message) {
      return Response.json({ error: "Missing message" }, { status: 400 });
    }

    const history = (conversation_history ?? []).map((msg: { role: string; content: string }) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const chat = geminiFlash.startChat({
      history,
      systemInstruction: SYSTEM_PROMPT,
    });

    const result = await chat.sendMessage(message);
    const response = result.response.text() ?? FALLBACK;

    return Response.json({ response });
  } catch (err) {
    console.error("Informant error:", err);
    return Response.json({ response: FALLBACK });
  }
}
```

**Test all three routes** before moving to Phase 3. Write a test script at `scripts/test-api.ts` that calls each endpoint with sample data and logs responses. Confirm commendation generates, interrogation is coherent across two turns, and informant answers a question.

---

## Phase 3 — Core Gameplay Components

**Goal:** Build all UI components as pure React components receiving data as props. No API calls inside components — all data flows from the page. Do not build pages yet.

### Component 1 — EvidenceViewer.tsx

Props: `evidenceHtml: string`, `hotspots: Hotspot[]`, `foundClues: string[]`, `onClueFound: (id: string) => void`, `onWrongClick: () => void`

- Renders `evidenceHtml` in a cream-background container (max-width 580px, centered)
- Overlays each hotspot as an absolutely-positioned div — invisible but clickable, minimum 60×60px hit area
- Found hotspot: shows a red stamp overlay with checkmark (animate in with scale from 1.3 to 1.0)
- On correct click: call `onClueFound`, play `public/audio/typewriter.mp3` via `new Audio()`
- On any non-hotspot click: call `onWrongClick`
- Counter at bottom: "Clues Found: X of Y" — 22px, cream text

### Component 2 — ClueStamp.tsx

Props: `label: string`, `explanation: string`, `isVisible: boolean`

- Animates in (opacity 0→1, scale 0.95→1) when `isVisible` becomes true using Framer Motion
- Dark background, sepia border, typewriter font
- Auto-dismisses after 3 seconds or on click anywhere
- Shows label in bold (20px) and explanation below (18px)

### Component 3 — DeductionBuilder.tsx

Props: `options: DeductionOption[]`, `isUnlocked: boolean`, `onDeductionFiled: (id: string) => void`

- Locked state: "Find more clues before filing your report, Detective." — muted sepia text, 20px
- Unlocked state: all options as large radio button rows (minimum 60px height each, full descriptive text, 20px)
- "File Your Report" button: full-width, dark background, sepia text, minimum 64px height, 22px font
- Wrong selection: "The evidence points elsewhere, Detective. Keep looking." — resets after 2 seconds
- Correct selection: call `onDeductionFiled` immediately

### Component 4 — CommendationCard.tsx

Props: `commendation: string`, `isLoading: boolean`, `caseTitle: string`, `onAddToArchive: () => void`, `onReturnToCases: () => void`

- Full-screen overlay with dark noir background (z-index 50)
- Loading state: "Analyzing evidence..." with a slow pulse animation
- Loaded: "CASE CLOSED" text in large dark red — animate as an ink stamp (rotate from -12deg to 0, scale 1.4 to 1, with a slight bounce using Framer Motion spring)
- Commendation text types out character by character (40ms per character using setInterval)
- "Add to Archive" button (full-width, 64px, sepia background)
- "Return to Cases" text link below

### Component 5 — InterrogationChat.tsx

Props: `inconsistenciesFound: number`, `onSendMessage: (msg: string) => Promise<{response: string, inconsistency_detected: boolean, inconsistency_label: string | null}>`, `onInterrogationComplete: () => void`

- Maintains `conversationHistory` and `displayMessages` in local state
- Styled as a telephone transcript (cream background, typewriter font, dark text)
- Messages labeled "DETECTIVE:" and "SUSPECT:" (18px, high contrast)
- Input: minimum 56px height, placeholder "Ask the suspect a question, Detective..."
- Sidebar or top bar showing three dots — filled red for found inconsistencies, empty circles for remaining
- When `inconsistenciesFound === 3`: show "INTERROGATION COMPLETE" banner, disable input, call `onInterrogationComplete` after 2 seconds

### Component 6 — InformantChat.tsx

A collapsible chat panel that is always present on the case screen, fixed to the right edge.

- Collapsed state: a vertical tab on the right edge reading "📡 INFORMANT" (min 140px tall, always tappable)
- Expanded state: a 320×480px panel slides in from the right
- Intro message when empty: "The wire's open, Detective. Ask me anything about this case."
- Messages labeled "DETECTIVE:" and "INFORMANT:" (16px)
- Input: minimum 48px height, Enter key sends
- Conversation history resets when the panel is closed and reopened (no persistence needed)
- Context-aware: accepts optional `caseContext: { title: string; scam_type: string }` prop and prepends it invisibly to each message

### Component 7 — PhoneSimulator.tsx

Props: `steps: PhoneSimStep[]`, `onComplete: () => void`

A self-contained simulated smartphone UI. Renders different screens based on current step, calls `onComplete()` when the final target is tapped.

Screens to implement (keyed by `screen` field in PhoneSimStep):

- `home`: Grid of app icons. Messages icon highlighted. Only "messages-icon" advances.
- `messages_inbox`: Shows two safe messages. Hamburger menu (☰) in top right. Only "menu-icon" advances.
- `messages_menu`: Dropdown menu with four options. Only "archived-option" advances.
- `archived`: One suspicious message visible. Only "suspicious-message" advances.

Wrong tap: show "Not quite, Detective. Keep looking." for 1.5 seconds.

Step instruction shown above the phone in a sepia callout box (20px, high contrast).

Progress dots below the phone (filled sepia = completed, empty = remaining).

Phone container: 320×580px, dark border-radius 36px, looks like a real smartphone.

### Component 8 — CaseFolder.tsx

Props: `case_id: string`, `title: string`, `scam_type: string`, `isCompleted: boolean`, `isTutorial?: boolean`, `onClick: () => void`

- Manila folder appearance (amber/sepia colors), minimum 80×80px tap target
- Completed: green checkmark badge, slightly faded
- Tutorial case: "START HERE" badge in dark red
- Hover/focus: lift effect (translateY -4px, shadow increase)

### Component 9 — AudioController.tsx

- Fixed position, top-right, always visible (z-index 50)
- Initializes `rain.mp3` and `jazz.mp3` as looping audio — never autoplay
- First user interaction with any page element starts audio
- Single mute toggle button: 🔊 / 🔇, minimum 48×48px
- Mutes all audio simultaneously

---

## Phase 4 — Page Assembly + Full Game Loop

**Goal:** Wire all components into pages and implement the complete game state machine.

### Page 1 — app/page.tsx (Landing)

- Full viewport, dark background
- "THE DETECTIVE AGENCY" in `font-typewriter` 36px+ sepia
- Subheading 24px: "Retired. But not done."
- Body 22px cream: "Digital crimes are rising. The young detectives don't know what they're looking at. They need your wisdom."
- Single CTA button: "Accept the Assignment" — 72px height, full sepia background, dark text, `font-typewriter`
- On click: navigate to `/cases`
- Render `<AudioController />`
- CSS scanlines overlay (repeating linear-gradient at 3% opacity for texture)

### Page 2 — app/cases/page.tsx (Case Selection)

- Header: "OPEN CASES" sepia 32px
- Subheading: "Choose your assignment, Detective." 22px cream
- Load all cases with `getAllCases()`
- Load archive with `getArchive()` — mark completed cases
- Check `localStorage.getItem("tutorial_complete")` on mount; if falsy, `router.push("/case/case-000")`
- Render `CaseFolder` grid (1 column mobile, 3 columns tablet/desktop)
- "View Agency Files" link at bottom → `/archive`
- Render `<InformantChat />` fixed to right edge

### Page 3 — app/case/[id]/page.tsx (Active Case — main game)

State machine with these steps: `"briefing" | "investigation" | "deduction" | "interrogation" | "commendation"`

State to manage:
```typescript
const [currentStep, setCurrentStep] = useState<Step>("briefing");
const [foundClues, setFoundClues] = useState<string[]>([]);
const [wrongClickMessage, setWrongClickMessage] = useState<string | null>(null);
const [commendation, setCommendation] = useState<string | null>(null);
const [commendationLoading, setCommendationLoading] = useState(false);
const [inconsistenciesFound, setInconsistenciesFound] = useState(0);
const [startTime] = useState(Date.now());
```

Game flow:

**BRIEFING:** Show case briefing text with typewriter animation. "Examine the Evidence" button (64px, 22px font) advances to investigation.

**INVESTIGATION:**
- If `caseData.is_phone_sim`: render `<PhoneSimulator>` — on complete, advance directly to deduction
- Otherwise: render `<EvidenceViewer>` with hotspots
- Show `<ClueStamp>` when a clue is found (auto-dismiss 3s)
- Show `wrongClickMessage` below evidence (auto-clear 2s)
- `<DeductionBuilder>` always rendered below — unlocks when `foundClues.length >= min_clues_to_deduce`

**DEDUCTION:**
- On correct deduction:
  - If `has_interrogation`: advance to interrogation step
  - Otherwise: call `POST /api/commendation`, set `commendationLoading`, advance to commendation

**INTERROGATION (Case 3 only):**
- Render `<InterrogationChat>`
- Track `inconsistenciesFound` from API responses
- When complete: call `POST /api/commendation`, advance to commendation

**COMMENDATION:**
- Render `<CommendationCard>`
- "Add to Archive": save via `saveCompletedCase()`, then:
  - If `caseData.is_tutorial`: set `localStorage.setItem("tutorial_complete", "true")`
  - Navigate to `/cases`

**Tutorial hints (when `caseData.is_tutorial`):**
Show the `tutorial_hint` of the first unfound hotspot as a highlighted callout above the evidence viewer:
```tsx
{isTutorial && currentHint && (
  <div style={{ background: "var(--noir-red)", color: "var(--noir-cream)", padding: "12px 16px", fontSize: "20px", marginBottom: "16px", fontFamily: "Special Elite, serif" }}>
    👆 {currentHint}
  </div>
)}
```

Render `<InformantChat caseContext={{ title: caseData.title, scam_type: caseData.scam_type }} />` on all steps.

5-minute inactivity detection: show a gentle overlay "Still on the case, Detective? Take your time." with "I'm here" dismiss button.

### Page 4 — app/archive/page.tsx (Case Archive)

- Header: "AGENCY FILES" sepia 32px
- Subheading: "Cases closed. Criminals identified." 22px
- Load `getArchive()`
- Empty state: "No cases on file yet, Detective. Your work begins on the street." with link to `/cases`
- Each entry: paper-card style (cream background, sepia border), case title, scam type, date completed, commendation excerpt (first 120 chars + "...")
- "Back to Open Cases" button at top

---

## Phase 5 — ElevenLabs Voice Integration

**Goal:** Add premium audio accessibility features. Requires `ELEVENLABS_API_KEY` in `.env.local`.

Get your ElevenLabs API key at elevenlabs.io — the free tier includes 10,000 characters/month with no credit card required for initial signup.

### Feature 1 — The Chief's Briefing (Audio Accessibility)

Pre-generate audio for every case briefing using ElevenLabs TTS so seniors who struggle with reading can hear the case briefing read aloud.

**Implementation:**

Add a `POST /api/tts` route:

```typescript
// app/api/tts/route.ts
import { NextRequest } from "next/server";
import { ElevenLabsClient } from "elevenlabs";

const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text) return Response.json({ error: "Missing text" }, { status: 400 });

    const audio = await client.textToSpeech.convert("JBFqnCBsd6RMkjVDRZzb", {
      // Voice ID "George" — deep, warm, authoritative. Fits the Chief character.
      text,
      model_id: "eleven_multilingual_v2",
      output_format: "mp3_44100_128",
    });

    // Stream audio buffer back as mp3
    const chunks: Buffer[] = [];
    for await (const chunk of audio) {
      chunks.push(Buffer.from(chunk));
    }
    const buffer = Buffer.concat(chunks);

    return new Response(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (err) {
    console.error("TTS error:", err);
    return Response.json({ error: "TTS failed" }, { status: 500 });
  }
}
```

**UI mechanic:** On the briefing step of each case, show a rotary phone icon button next to the briefing text:

```tsx
// In the briefing step of app/case/[id]/page.tsx
const [audioUrl, setAudioUrl] = useState<string | null>(null);
const [audioLoading, setAudioLoading] = useState(false);

const playBriefing = async () => {
  if (audioUrl) {
    new Audio(audioUrl).play();
    return;
  }
  setAudioLoading(true);
  try {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: caseData.briefing }),
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    setAudioUrl(url);
    new Audio(url).play();
  } finally {
    setAudioLoading(false);
  }
};

// Button JSX:
<button
  onClick={playBriefing}
  disabled={audioLoading}
  style={{ fontSize: "32px", background: "none", border: "none", cursor: "pointer", minWidth: "60px", minHeight: "60px" }}
  aria-label="Hear this briefing read aloud"
  title="Listen to briefing"
>
  {audioLoading ? "⏳" : "📞"}
</button>
```

The phone rings when clicked — case briefing audio plays in the Chief's voice. Cache the URL so replaying doesn't re-fetch.

### Feature 2 — Voice Interrogation (Conversational AI) — Optional Enhancement

If time permits, replace the text-based interrogation in Case 3 with a live voice interrogation using ElevenLabs Conversational AI.

```typescript
// app/api/voice-interrogate/route.ts
import { ElevenLabsClient } from "elevenlabs";

const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY! });

export async function POST(req: NextRequest) {
  // Initialize a conversational AI session with the scammer persona
  // Use ElevenLabs Agent API with the same scammer system prompt from Phase 2
  // Return a session token for the client to connect via WebSocket
}
```

**Note:** This feature requires microphone permission from the user. Add a clear "ENABLE MICROPHONE" consent button before starting. If the user declines, fall back gracefully to the text-based interrogation from Phase 2. Do not block the demo on this feature — implement it only if Phases 1–5 are complete and working.

---

## Phase 6 — Polish, Accessibility, and Deployment

**Goal:** Finalize all visual polish, run a full accessibility audit, and deploy to Vercel.

### Accessibility Audit Checklist

Run through every screen and confirm:
- [ ] Every body text element is minimum 20px
- [ ] Every interactive element has a minimum 60×60px touch target
- [ ] Every interactive element has a visible keyboard focus state (2px sepia outline on dark backgrounds)
- [ ] All images have `alt` text
- [ ] No information conveyed by color alone
- [ ] No horizontal scroll on 768px tablet viewport
- [ ] Audio never autoplays — always requires a user gesture

### Animation Polish

- Landing page: subtle CSS scanlines overlay (repeating-linear-gradient at 3% opacity)
- CASE CLOSED stamp: Framer Motion spring — starts at scale 1.4, rotate -12deg, snaps to final with bounce
- Case folder hover: `transform: translateY(-4px)` with shadow increase (Framer Motion `whileHover`)
- Page fade-in on mount: all pages animate opacity 0→1 over 300ms
- Typewriter text: use `setInterval` at 35ms per character with a blinking cursor (`|`) while typing

### Inactivity Handling

On the case page, add a timer that resets on any user interaction:

```typescript
useEffect(() => {
  let timer: NodeJS.Timeout;
  const reset = () => {
    clearTimeout(timer);
    timer = setTimeout(() => setShowInactivityPrompt(true), 5 * 60 * 1000);
  };
  window.addEventListener("click", reset);
  window.addEventListener("keypress", reset);
  reset();
  return () => {
    clearTimeout(timer);
    window.removeEventListener("click", reset);
    window.removeEventListener("keypress", reset);
  };
}, []);
```

Show overlay: "Still on the case, Detective? Take your time." with one button: "I'm here."

### Fallback Hardening

- Test API fallbacks: temporarily set `GEMINI_API_KEY` to an invalid value, run through a case, confirm fallback commendation appears without breaking the game
- Wrap all `localStorage` calls in try/catch (private browsing mode throws)
- Wrap all `Audio()` calls in try/catch (some browsers block audio APIs)

### Deployment

```bash
# 1. Confirm .env.local is in .gitignore
# 2. Create vercel.json
```

```json
{
  "env": {
    "GEMINI_API_KEY": "@gemini-api-key",
    "ELEVENLABS_API_KEY": "@elevenlabs-api-key"
  }
}
```

```bash
# 3. Add env vars in Vercel dashboard (Settings → Environment Variables)
# 4. Deploy
vercel --prod
```

Test the live URL on:
- Desktop Chrome
- Mobile Safari (iPhone)
- Tablet (iPad) — this is the primary senior center device

### Demo Video Checklist (confirm before recording)

- [ ] Landing page loads in under 3 seconds on tablet WiFi
- [ ] Case 0 tutorial auto-launches on first visit
- [ ] Tutorial hints appear and advance correctly
- [ ] Case 1 briefing typewriter animation plays
- [ ] Clue tapping with red stamp animation works on tablet
- [ ] Deduction filing works, wrong answer shows gentle feedback
- [ ] AI commendation appears with typewriter effect
- [ ] Case 3 interrogation chat is coherent across multiple turns
- [ ] Inconsistency detection fires at least once in demo
- [ ] Case 4 phone simulator navigates through all 4 screens
- [ ] The Informant tab expands and answers a question
- [ ] ElevenLabs phone icon reads briefing aloud
- [ ] Case archive shows completed cases
- [ ] Audio mute toggle works on every screen
- [ ] No horizontal scroll on tablet viewport

---

## Quick Reference

| Decision | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 App Router | Vercel-native, API routes built in |
| LLM | Gemini 2.5 Flash | 1,500 req/day free, no credit card, easiest setup |
| Voice | ElevenLabs | Best TTS quality, free tier 10k chars/month |
| Styling | Tailwind + CSS variables | Rapid development, consistent noir tokens |
| Storage | localStorage only | No DB needed, no PII collected |
| Font | Special Elite + Inter | Typewriter aesthetic, high legibility |
| Animation | Framer Motion | Smooth stamps, typewriter, card transitions |
| Hosting | Vercel free tier | Zero config, instant deploys |

---

*Built for GenLink Hacks — helping senior citizens become the digital detectives they always were.*
