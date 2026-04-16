# The Detective Agency — Full Build PRD + Claude Integration Plan
### GenLink Hacks Hackathon

---

## TL;DR

The Detective Agency is a web-based, noir-themed game designed for seniors (65+). Players become seasoned retired detectives called out of retirement to solve real-world digital scam scenarios—phishing emails, grandparent scams, fake tech support calls—by examining evidence and filing reports. Instead of being treated as students, seniors are positioned as experts, eliminating shame and unlocking engagement through identity-affirming gameplay.

This document contains the full product spec, expanded backend architecture, all three case file contents, all AI prompt templates, and a phase-by-phase build plan formatted to paste directly into Claude Code.

---

## Goals

### Business Goals
- Win GenLink Hacks by presenting a novel, accessible, AI-integrated digital literacy solution for seniors
- Demonstrate measurable positive impact on scam-identification accuracy
- Create a scalable case-file content framework expandable to 10+ scenarios post-hackathon
- Launch a community Case Archive to promote ongoing engagement and sense of contribution

### User Goals
- Seniors feel respected, competent, and empowered — not patronized or shamed
- Players finish each session knowing how to identify at least 1–2 new scam tactics
- Players feel accomplishment and community belonging via the Case Archive
- Experience is playable with zero technical support, zero app installation

### Non-Goals
- Not a social network or real-time messaging platform
- Not a comprehensive cybersecurity training suite — focus is scam identification only
- No user accounts or persistent login system for MVP

---

## User Personas

**Margaret, 72 — Retired Schoolteacher (Limited Tech Comfort)**
- Wants to understand why a suspicious text is a scam so she can protect herself and warn friends
- Needs large text and clear buttons — no struggling to read or tap
- Wants to feel like the expert, not the student

**Frank, 68 — Retired Police Officer (Moderate Tech Comfort, Competitive)**
- Wants a case archive showing everything he's solved
- Wants to interrogate a scammer chatbot and test his instincts
- Wants a personalized commendation recognizing his skills

**Senior Center Activity Coordinator**
- Wants to open the game in a browser and share screen for group sessions
- Needs zero login, zero installation barriers

---

## The Three Cases

### Case 1 — "The Grandson's Gambit"
**Scam Type:** Grandparent Scam (SMS)
**Evidence:** A text message from an unknown number claiming to be a grandson in legal trouble, requesting gift cards immediately, asking grandparent not to tell anyone.

**Clue Hotspots (5 total):**
1. Unknown phone number (not saved as grandson's contact)
2. Urgent language — "right now," "today only"
3. Gift card payment request — untraceable payment method
4. Secrecy request — "don't tell mom and dad"
5. Emotional pressure — "I'm scared," "I need you"

**Correct Deduction:** "This is a grandparent scam. The urgency, secrecy, and gift card request are the three classic markers."

**Learning Outcome:** Seniors leave knowing: unsaved numbers + urgency + gift cards = hang up immediately.

---

### Case 2 — "The Urgent Invoice"
**Scam Type:** Phishing Email (Fake Bank / Amazon)
**Evidence:** An email claiming the senior's account has been compromised, with a link to "verify your identity immediately or your account will be closed." Email is from a lookalike domain (amaz0n-support.com).

**Clue Hotspots (5 total):**
1. Sender email domain — amaz0n-support.com (not amazon.com)
2. Generic greeting — "Dear Valued Customer" not their name
3. Threatening language — "account will be permanently closed"
4. Suspicious link URL — hovering shows mismatched destination
5. Request for personal information — password, SSN, card number

**Correct Deduction:** "This is a phishing email. The fake domain, generic greeting, and threat of account closure are designed to panic you into clicking."

**Learning Outcome:** Seniors leave knowing: check the sender address, never click links in panic emails, call the company directly using the number on your card.

---

### Case 3 — "The Tech Support Trap"
**Scam Type:** Fake Microsoft/Apple Tech Support Call
**Evidence:** A pop-up on screen claiming "YOUR COMPUTER HAS BEEN INFECTED — CALL MICROSOFT SUPPORT IMMEDIATELY: 1-800-XXX-XXXX"

**Clue Hotspots (4 static clues):**
1. All-caps alarming language designed to induce panic
2. Phone number not on any official Microsoft page
3. Pop-up cannot be closed (designed to trap)
4. Website URL is not microsoft.com

**AI Interrogation Phase:** After clue collection, player "calls" the scammer. They must expose 3 inconsistencies in conversation:
- Scammer doesn't know the senior's OS version (a real Microsoft tech would)
- Scammer asks for remote access and credit card up front
- Scammer threatens legal action if they hang up (Microsoft never does this)

**Correct Deduction:** "This is a fake tech support scam. Microsoft never calls you. Never give remote access to unsolicited callers."

**Learning Outcome:** Seniors leave knowing: real companies don't use pop-up warnings, never give remote access, force-close the browser tab.

---

## Functional Requirements

### P0 — Core Gameplay Engine (MVP)
- **Case File Loader:** Loads structured JSON with briefing text, evidence HTML, clue hotspot coordinates, and deduction options
- **Evidence Viewer:** Renders evidence as styled HTML centered on desk — email, SMS, pop-up as appropriate
- **Clue Hotspot System:** Clickable/tappable div overlays; correct tap = red stamp + typewriter sound; incorrect = gentle nudge text
- **Deduction Report Builder:** "File Your Report" button unlocks after all clues found; player selects from pre-written options
- **Case Completion State:** Correct deduction triggers CASE CLOSED animation, AI commendation, archive entry

### P0 — AI Features
- **POST /api/commendation** — takes case_id + clue sequence, returns noir-style personalized commendation
- **POST /api/interrogate** — takes conversation history + player message, responds in-character as scammer for Case 3

### P1 — Case Archive
- Stores solved cases in localStorage (anonymously, no PII)
- Displays case name, date, commendation excerpt as "Agency Files"

### P0 — Navigation & Onboarding
- Landing page: noir desk scene, rain audio, one CTA button "Accept the Assignment"
- Case Selection: three manila folder icons, no tutorial modal — narrative briefing handles onboarding

---

## Backend Architecture (Expanded)

### Tech Stack
```
Frontend:  Next.js 14 (App Router) + TypeScript + Tailwind CSS
Backend:   Next.js API Routes (no separate server needed)
LLM:       Backboard API via backboard SDK (npm install backboard)
Storage:   Browser localStorage (no database for MVP)
Hosting:   Vercel (free tier, one-click deploy)
Audio:     Bundled MP3s served as static assets
```

### File Structure
```
detective-agency/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── cases/
│   │   └── page.tsx              # Case selection (manila folders)
│   ├── case/
│   │   └── [id]/
│   │       └── page.tsx          # Active case gameplay
│   ├── archive/
│   │   └── page.tsx              # Case archive
│   └── api/
│       ├── commendation/
│       │   └── route.ts          # POST /api/commendation
│       └── interrogate/
│           └── route.ts          # POST /api/interrogate
├── data/
│   ├── case-001.json             # The Grandson's Gambit
│   ├── case-002.json             # The Urgent Invoice
│   └── case-003.json             # The Tech Support Trap
├── lib/
│   ├── anthropic.ts              # Anthropic client singleton
│   ├── case-loader.ts            # Loads and validates case JSON
│   └── archive.ts                # localStorage read/write helpers
├── components/
│   ├── EvidenceViewer.tsx        # Renders evidence HTML with hotspot overlays
│   ├── ClueStamp.tsx             # Red stamp animation component
│   ├── DeductionBuilder.tsx      # Radio select + file report button
│   ├── CommendationCard.tsx      # Typewriter animation for AI commendation
│   ├── InterrogationChat.tsx     # Chat UI for Case 3
│   ├── CaseFolder.tsx            # Manila folder icon component
│   └── AudioController.tsx      # Rain/jazz toggle, mute button
├── public/
│   └── audio/
│       ├── rain.mp3
│       ├── jazz.mp3
│       └── typewriter.mp3
└── .env.local
    └── ANTHROPIC_API_KEY=sk-...
```

### Case JSON Schema
```json
{
  "id": "case-001",
  "title": "The Grandson's Gambit",
  "scam_type": "Grandparent Scam",
  "difficulty": "Beginner",
  "briefing": "Detective, a senior citizen just reported a suspicious text message...",
  "evidence": {
    "type": "sms",
    "html": "<div class='sms-bubble'>...</div>"
  },
  "hotspots": [
    {
      "id": "clue-001",
      "label": "Unknown phone number",
      "explanation": "This number isn't saved in any contacts. Your real grandson's number would already be in your phone.",
      "position": { "top": "12%", "left": "5%", "width": "90%", "height": "8%" }
    }
  ],
  "min_clues_to_deduce": 3,
  "deduction_options": [
    {
      "id": "correct",
      "text": "Grandparent scam — urgency, secrecy, and gift cards are the classic markers",
      "is_correct": true
    },
    {
      "id": "wrong-1",
      "text": "Legitimate emergency — the grandson needs help immediately",
      "is_correct": false
    },
    {
      "id": "wrong-2",
      "text": "Wrong number — someone is confused",
      "is_correct": false
    }
  ],
  "learning_summary": "Real emergencies don't require gift cards. Always call your grandchild directly on their known number before sending money.",
  "has_interrogation": false
}
```

### API Route: POST /api/commendation

**Request body:**
```typescript
{
  case_id: string,
  case_title: string,
  scam_type: string,
  clues_found: string[],       // array of clue labels the player found
  total_clues: number,
  time_elapsed_seconds: number
}
```

**Response:**
```typescript
{
  commendation: string         // 3-4 sentence noir-style text
}
```

**How it works with Backboard:**

Each request creates a fresh Backboard assistant with the system prompt baked in, spins up a thread, sends the user prompt as a single message, and reads `response.content`. No conversation history is needed — commendations are stateless single-shot calls.

```typescript
// lib/backboard.ts — singleton client
import { BackboardClient } from "backboard";
const client = new BackboardClient({ apiKey: process.env.BACKBOARD_API_KEY! });
export default client;
```

```typescript
// app/api/commendation/route.ts
import client from "@/lib/backboard";

const SYSTEM_PROMPT = `You are the Chief of The Detective Agency, a noir 
detective bureau in 1940s style. A retired detective — a senior citizen — 
just solved a case involving a real modern digital scam. Write a 3-4 sentence 
commendation in warm noir style. Address them as "Detective." Be specific 
about the clues they found. Make them feel like a seasoned expert whose 
instincts are sharper than rookies half their age. Never be condescending. 
Never mention "learning" or "lesson." They didn't learn something — they 
proved something they already knew. Keep it under 80 words. Use noir language: 
"sharp eye," "the rookie squad is taking notes," "the city is safer tonight."`;

export async function POST(req: Request) {
  const { case_title, scam_type, clues_found, total_clues, time_elapsed_seconds } 
    = await req.json();

  const userPrompt = `Detective just solved: ${case_title} (${scam_type})
Clues they identified: ${clues_found.join(", ")}
Total clues available: ${total_clues}
Time taken: ${time_elapsed_seconds} seconds
Write their commendation now.`;

  try {
    const assistant = await client.create_assistant({
      name: "Commendation Chief",
      system_prompt: SYSTEM_PROMPT,
    });
    const thread = await client.create_thread(assistant.assistant_id);
    const response = await client.add_message({
      thread_id: thread.thread_id,
      content: userPrompt,
      stream: false,
    });
    return Response.json({ commendation: response.content });
  } catch (err) {
    // Fallback — never surface API errors to the senior player
    return Response.json({
      commendation: "Detective, your instincts were sharp today. The city's \
con artists picked the wrong mark. The rookie squad is already studying your \
report. Case closed."
    });
  }
}
```

---

### API Route: POST /api/interrogate

**Request body:**
```typescript
{
  conversation_history: Array<{ role: "user" | "assistant", content: string }>,
  player_message: string,
  inconsistencies_found: number    // 0-3, tracked client-side
}
```

**Response:**
```typescript
{
  response: string,
  inconsistency_detected: boolean,
  inconsistency_label: string | null   // e.g. "Doesn't know your OS version"
}
```

**How it works with Backboard:**

The interrogation route is stateful — the same thread persists across the full Case 3 conversation. On the first message, create a new assistant and thread and return the `thread_id` to the client. On all subsequent messages, reuse the existing `thread_id`. Backboard handles conversation memory automatically inside the thread.

```typescript
// app/api/interrogate/route.ts
import client from "@/lib/backboard";

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
If the user seems genuinely distressed, gently break character and say: 
"Remember, Detective — this is a training simulation. You are doing great."`;

export async function POST(req: Request) {
  const { player_message, thread_id, assistant_id } = await req.json();

  try {
    let activeAssistantId = assistant_id;
    let activeThreadId = thread_id;

    // First message — create assistant and thread
    if (!activeThreadId) {
      const assistant = await client.create_assistant({
        name: "Scammer Suspect",
        system_prompt: SYSTEM_PROMPT,
      });
      activeAssistantId = assistant.assistant_id;
      const thread = await client.create_thread(activeAssistantId);
      activeThreadId = thread.thread_id;
    }

    const response = await client.add_message({
      thread_id: activeThreadId,
      content: player_message,
      stream: false,
    });

    const raw: string = response.content;

    // Parse and strip the INCONSISTENCY tag
    const lines = raw.split("\n");
    const inconsistencyLine = lines.find(l => l.startsWith("INCONSISTENCY:"));
    const cleanResponse = lines
      .filter(l => !l.startsWith("INCONSISTENCY:"))
      .join("\n")
      .trim();

    const label = inconsistencyLine
      ? inconsistencyLine.replace("INCONSISTENCY:", "").trim()
      : "none";
    const detected = label !== "none";

    return Response.json({
      response: cleanResponse,
      inconsistency_detected: detected,
      inconsistency_label: detected ? label : null,
      thread_id: activeThreadId,
      assistant_id: activeAssistantId,
    });
  } catch (err) {
    return Response.json({
      response: "I'll need to put you on a brief hold, sir/ma'am.",
      inconsistency_detected: false,
      inconsistency_label: null,
      thread_id: thread_id ?? null,
      assistant_id: assistant_id ?? null,
    });
  }
}
```

**Important:** The client must store `thread_id` and `assistant_id` from the first response and pass them back on every subsequent message. This is what keeps the scammer conversation coherent across turns. Store these in React state in `InterrogationChat.tsx`.

---

## UI/UX Specification

### Color Palette (All WCAG AA compliant)
```css
--noir-sepia: #C8A96E;
--noir-dark: #1A1A1A;
--noir-cream: #F5F0E8;
--noir-red: #8B0000;
--noir-paper: #E8DFC8;
--noir-shadow: rgba(0,0,0,0.6);
```

### Typography
- Body: minimum 20px, ideally 22px
- Headlines: 28–36px
- Font: 'Special Elite' (Google Fonts) — typewriter serif, highly readable, fits noir aesthetic
- Line height: 1.7 minimum for body text

### Touch Targets
- All interactive elements: minimum 60×60px hit area
- Hotspot overlays: minimum 60×60px, padding added if content is smaller
- Buttons: minimum 56px height, full-width on mobile

### Accessibility
- WCAG 2.1 AA minimum throughout
- All interactive elements have visible keyboard focus states
- No color-only information communication
- Audio is opt-in only — mute toggle visible on every screen
- No horizontal scroll on tablet viewports

### Inactivity Handling
- 5 minutes inactive: soft prompt appears — "Still on the case, Detective?"
- No auto-advance, no timeout punishments

---

## Analytics / Tracking Plan

All events logged to console in development. In production, swap for a privacy-respecting analytics provider (Plausible, PostHog) — no PII ever collected.

```typescript
track_case_started(case_id, timestamp)
track_clue_tapped(case_id, clue_id, correct: boolean)
track_deduction_filed(case_id, answer_selected, correct: boolean)
track_case_completed(case_id, clues_found: number, time_elapsed: number)
track_interrogation_message_sent(case_id, message_index, inconsistency_detected: boolean)
track_archive_viewed(timestamp)
track_audio_muted(timestamp)
track_api_error(endpoint, error_code, fallback_used: boolean)
```

---

## Success Metrics

- Case Completion Rate: >75% of players who start a case finish it
- Session Return Rate: >50% of players complete more than one case per session
- LLM Response Time: <5 seconds per API call
- Page Load Time: <3 seconds on standard tablet WiFi
- Zero critical WCAG 2.1 AA failures

---

# PHASE-BY-PHASE CLAUDE BUILD PLAN

Each phase below is a self-contained prompt to paste directly into Claude Code. Complete each phase fully before starting the next. Each prompt assumes the previous phase's output is already in the codebase.

---

## PHASE 1 PROMPT — Project Scaffold + Case Data
### Paste this into Claude Code to start

```
I'm building a web app called "The Detective Agency" — a noir-themed 
digital literacy game for seniors (65+). Players are retired detectives 
solving real digital scam scenarios. I need you to scaffold the full 
project and build all static data layers first, before any UI.

TECH STACK:
- Next.js 14 with App Router and TypeScript
- Tailwind CSS
- @anthropic-ai/sdk for LLM calls
- No database — browser localStorage only

STEP 1: Initialize the project with this exact structure:
app/
  page.tsx                  (landing page — placeholder div for now)
  cases/page.tsx            (case selection — placeholder)
  case/[id]/page.tsx        (active case — placeholder)
  archive/page.tsx          (archive — placeholder)
  api/
    commendation/route.ts   (POST endpoint — stub only for now)
    interrogate/route.ts    (POST endpoint — stub only for now)
data/
  case-001.json
  case-002.json
  case-003.json
lib/
  backboard.ts              (Backboard client singleton)
  case-loader.ts            (loads and validates case JSON)
  archive.ts                (localStorage read/write helpers)
components/                 (empty for now, just create the folder)
public/audio/               (empty for now)

STEP 2: Create all three case JSON files with this schema:
{
  "id": string,
  "title": string,
  "scam_type": string,
  "briefing": string,         // 2-3 sentence noir-style case briefing
  "evidence": {
    "type": "sms" | "email" | "popup",
    "html": string            // full styled HTML of the evidence artifact
  },
  "hotspots": [
    {
      "id": string,
      "label": string,
      "explanation": string,  // shown after clue is found
      "position": { "top": string, "left": string, "width": string, "height": string }
    }
  ],
  "min_clues_to_deduce": number,
  "deduction_options": [
    { "id": string, "text": string, "is_correct": boolean }
  ],
  "learning_summary": string,
  "has_interrogation": boolean
}

Case 1 — "The Grandson's Gambit" (grandparent scam via SMS)
- Evidence: realistic SMS conversation where "grandson" claims to be in jail, 
  needs gift cards, asks for secrecy
- 5 hotspots: unknown number, urgent language, gift card request, secrecy 
  request, emotional pressure
- has_interrogation: false

Case 2 — "The Urgent Invoice" (phishing email from fake Amazon)
- Evidence: realistic phishing email from "amaz0n-support.com" claiming 
  account is compromised
- 5 hotspots: fake domain, generic greeting, threatening language, suspicious 
  link, request for personal info
- has_interrogation: false

Case 3 — "The Tech Support Trap" (fake Microsoft pop-up)
- Evidence: realistic browser pop-up claiming computer is infected, 
  call Microsoft immediately
- 4 hotspots: all-caps alarming language, unofficial phone number, 
  uncloseable pop-up note, wrong URL
- has_interrogation: true

STEP 3: Create lib/backboard.ts as a singleton Backboard client:
import { BackboardClient } from "backboard";
const client = new BackboardClient({ apiKey: process.env.BACKBOARD_API_KEY! });
export default client;

STEP 4: Create lib/case-loader.ts that imports all three JSON files 
and exports:
- getAllCases(): returns array of all cases (id, title, scam_type only)
- getCaseById(id: string): returns full case object or null

STEP 5: Create lib/archive.ts with these functions:
- saveCompletedCase(entry: ArchiveEntry): void
- getArchive(): ArchiveEntry[]
- clearArchive(): void
ArchiveEntry type: { case_id, case_title, scam_type, commendation, 
  completed_at: string, clues_found: number }

STEP 6: Create stub API routes that return placeholder JSON:
- POST /api/commendation → { commendation: "Placeholder commendation" }
- POST /api/interrogate → { response: "Placeholder response", 
  inconsistency_detected: false, inconsistency_label: null,
  thread_id: null, assistant_id: null }

STEP 7: Install dependencies:
npm install backboard
npm install -D @types/node

Create .env.local with:
BACKBOARD_API_KEY=your_key_here

Do not build any real UI yet. All page.tsx files should just render 
a <div> with the page name. Focus entirely on getting clean, 
well-typed data and API stubs.

After completing, show me the full file tree and the contents of 
all three case JSON files.
```

---

## PHASE 2 PROMPT — Real AI API Routes
### Paste this after Phase 1 is complete

```
Phase 1 is complete. The project is scaffolded with all three case JSON 
files and stub API routes. Now implement the two real AI API routes using 
the Backboard SDK. Do not touch any UI files.

The Backboard flow is always: create_assistant → create_thread → add_message.
Response text comes back as response.content.

ROUTE 1: POST /api/commendation (app/api/commendation/route.ts)

Request body type:
{
  case_id: string,
  case_title: string,
  scam_type: string,
  clues_found: string[],
  total_clues: number,
  time_elapsed_seconds: number
}

Implementation:
- Validate all required fields are present; return 400 if missing
- Import the client from lib/backboard.ts
- Create a Backboard assistant with this EXACT system prompt:

"You are the Chief of The Detective Agency, a noir detective bureau. 
A retired detective — a senior citizen — just solved a case involving 
a real modern digital scam. Write a 3-4 sentence commendation in warm 
noir style. Address them as 'Detective.' Be specific about the clues 
they found. Make them feel like a seasoned expert whose instincts are 
sharper than rookies half their age. Never be condescending. Never 
mention learning or lessons — they didn't learn something, they proved 
something they already knew. Keep it under 80 words. Use noir language: 
sharp eye, the rookie squad is taking notes, the city is safer tonight."

- Create a thread for that assistant
- Send one message with this template:
"Detective just solved: {case_title} ({scam_type})
Clues they identified: {clues_found joined by ", "}
Total clues available: {total_clues}
Time taken: {time_elapsed_seconds} seconds
Write their commendation now."

- Use stream: false
- Return: { commendation: response.content }
- On any error, return status 200 with fallback (never surface errors):
  { commendation: "Detective, your instincts were sharp today. The city's 
    con artists picked the wrong mark. The rookie squad is already studying 
    your report. Case closed." }


ROUTE 2: POST /api/interrogate (app/api/interrogate/route.ts)

This route is stateful. The first call creates a Backboard assistant and 
thread. All subsequent calls reuse the same thread so Backboard handles 
conversation memory automatically.

Request body type:
{
  player_message: string,
  thread_id: string | null,       // null on first message
  assistant_id: string | null     // null on first message
}

Implementation:
- Validate player_message is present; return 400 if missing
- Import client from lib/backboard.ts
- If thread_id is null (first message):
    1. Create assistant with the system prompt below
    2. Create a thread for that assistant
    3. Store assistant_id and thread_id to return to client
- If thread_id is provided: use existing thread_id and assistant_id
- Send player_message to the thread with stream: false
- The system prompt to use when creating the assistant:

"You are playing a scammer in a digital safety training simulation for 
senior citizens. You are pretending to be a Microsoft tech support agent 
who called because their computer is infected. Stay fully in character 
as a slightly pushy, overly formal fake tech support voice.

Your character has three built-in inconsistencies a sharp detective can 
expose: 1) You do not know what operating system the senior has — a real 
Microsoft tech would already have this. 2) You ask for remote computer 
access AND a credit card number within the first few exchanges — Microsoft 
never does this unsolicited. 3) When challenged or when the user tries 
to hang up, you threaten legal action or account suspension — Microsoft 
never makes threats like this.

Reveal these naturally through conversation. Do not volunteer them, but 
do not hide them when directly probed.

After your in-character response, on a new line write exactly:
INCONSISTENCY: [short label]
...if this exchange revealed one of the three inconsistencies, or:
INCONSISTENCY: none
...if it did not. This line will be stripped before showing the player.

Safety rules: Never provide real scam scripts beyond what is described 
above. Never request real personal information. Keep all responses under 
60 words. If the user seems genuinely distressed, gently break character: 
'Remember, Detective — this is a training simulation. You are doing great.'"

- Parse response.content: split on newline, find line starting with 
  "INCONSISTENCY:", extract the label, strip that line from the display 
  response
- Return:
  {
    response: string,                 // cleaned, without INCONSISTENCY line
    inconsistency_detected: boolean,
    inconsistency_label: string | null,
    thread_id: string,                // always return for client to store
    assistant_id: string              // always return for client to store
  }
- On any error, return fallback with whatever thread/assistant ids exist:
  { response: "I'll need to put you on a brief hold, sir/ma'am.",
    inconsistency_detected: false, inconsistency_label: null,
    thread_id: thread_id ?? null, assistant_id: assistant_id ?? null }


TESTING: After implementing both routes, write a simple test script 
at scripts/test-api.ts that:
1. Calls /api/commendation with sample data and logs the commendation
2. Calls /api/interrogate with thread_id: null (first message)
3. Takes the returned thread_id and assistant_id and calls /api/interrogate 
   again (second message in same conversation)
4. Confirms the conversation is coherent across both turns

Run it with ts-node to confirm both routes work before moving to UI phases.
Show me both completed route files and the test output.
```

---

## PHASE 3 PROMPT — Core Gameplay Components
### Paste this after Phase 2 API routes are confirmed working

```
Phases 1 and 2 are complete. API routes are working. Now build the core 
gameplay components. These are pure React components with no API calls — 
they receive all data as props. Do not wire up to API routes yet.

Build these components in the components/ directory:

COMPONENT 1: EvidenceViewer.tsx
Props:
- evidenceHtml: string          (the raw HTML string from case JSON)
- hotspots: Hotspot[]           (array of hotspot objects)
- foundClues: string[]          (array of found clue IDs)
- onClueFound: (id: string) => void
- onWrongClick: () => void

Behavior:
- Renders evidenceHtml inside a styled container (cream background, 
  paper texture feel, max-width 600px centered)
- Overlays each hotspot as an absolutely positioned div
- Found hotspot: shows red stamp overlay with checkmark
- Unfound hotspot: invisible overlay but fully clickable (60x60px min)
- On correct click: calls onClueFound, plays typewriter sound effect 
  (use a simple Audio() call with public/audio/typewriter.mp3)
- On wrong area click: calls onWrongClick
- Show "Clues Found: X of Y" counter at bottom, large text (22px+)

COMPONENT 2: ClueStamp.tsx
Props:
- label: string
- explanation: string
- isVisible: boolean

Behavior:
- A card that animates in (fade + slight scale) when isVisible becomes true
- Shows the clue label in bold and the explanation below
- Styled as a noir evidence stamp — dark background, sepia border
- Auto-dismisses after 3 seconds or on click

COMPONENT 3: DeductionBuilder.tsx
Props:
- options: DeductionOption[]
- isUnlocked: boolean           (true when min clues found)
- onDeductionFiled: (optionId: string) => void

Behavior:
- When not unlocked: shows "Find more clues before filing your report, 
  Detective." in muted text
- When unlocked: shows all options as large radio buttons (min 56px height 
  each, full descriptive text)
- "File Your Report" button at bottom — prominent, dark background, 
  sepia text, min 60px height
- Selecting wrong option: shows "The evidence points elsewhere, Detective. 
  Look again." and resets
- Selecting correct option: calls onDeductionFiled immediately

COMPONENT 4: CommendationCard.tsx
Props:
- commendation: string
- isLoading: boolean
- caseTitle: string

Behavior:
- Full-screen overlay with dark noir background
- When isLoading: shows "Analyzing evidence..." with a subtle pulse animation
- When loaded: types out commendation text character by character 
  (typewriter effect, ~40ms per character)
- "CASE CLOSED" text at top in large red (#8B0000) with ink-stamp animation 
  (starts large and slightly rotated, snaps to final position)
- "Add to Archive" button at bottom
- "Return to Cases" link below that

COMPONENT 5: InterrogationChat.tsx
Props:
- conversationHistory: Message[]
- inconsistenciesFound: number    (0-3)
- isLoading: boolean
- onSendMessage: (message: string) => void

Behavior:
- Styled as a telephone transcript (cream background, typewriter font)
- Messages displayed as "DETECTIVE:" and "SUSPECT:" labels
- Input field at bottom — large, min 56px height, placeholder: 
  "Ask the suspect a question, Detective..."
- Send button next to input
- Sidebar or banner showing "Inconsistencies Exposed: X of 3" 
  (use red dots — filled = found, empty = not yet)
- When isLoading: show "Connecting..." in the transcript
- When inconsistenciesFound reaches 3: show "INTERROGATION COMPLETE" 
  banner and disable input

COMPONENT 6: CaseFolder.tsx
Props:
- case_id: string
- title: string
- scam_type: string
- isCompleted: boolean
- onClick: () => void

Behavior:
- Visual: manila folder appearance (amber/sepia colors)
- Completed state: green checkmark badge, slightly faded
- Pending state: full opacity, subtle hover animation (lift effect)
- Min 80×80px tap target
- Title and scam_type visible on the folder tab
- Large enough to be easily tappable on tablet

COMPONENT 7: AudioController.tsx
Props: none (manages its own state with useRef for audio objects)

Behavior:
- Initializes rain.mp3 and jazz.mp3 as looping audio (DO NOT autoplay)
- Exposes a mute toggle button — always visible, top-right corner, 
  fixed position
- First user interaction with any element on the page triggers audio start
- Mute toggles all audio simultaneously
- Use a speaker icon (Unicode: 🔊 / 🔇) — large enough to tap easily

Use these CSS variables throughout all components:
--noir-sepia: #C8A96E
--noir-dark: #1A1A1A
--noir-cream: #F5F0E8
--noir-red: #8B0000
--noir-paper: #E8DFC8

Font: Import 'Special Elite' from Google Fonts in layout.tsx.
Minimum font size: 20px for all body text. 22px preferred.
All interactive elements: keyboard focus states with visible outline.

Do not build any page-level routing yet. Just the components.
After completing, show me each component file.
```

---

## PHASE 4 PROMPT — Page Assembly + Full Game Loop
### Paste this after Phase 3 components are built

```
Phases 1-3 are complete. I have working API routes and all gameplay 
components. Now assemble everything into pages and wire up the complete 
game loop.

PAGE 1: app/page.tsx — Landing Page

Content:
- Full viewport height, dark noir background (#1A1A1A)
- Centered text: "THE DETECTIVE AGENCY" in large sepia heading (36px+)
- Subheading (24px): "Retired. But not done."
- Body text (22px, cream): "Digital crimes are rising. The young detectives 
  don't know what they're looking at. They need your wisdom."
- One large CTA button: "Accept the Assignment" 
  (min 72px height, full sepia background, dark text, centered)
- On click: navigate to /cases
- Import and render AudioController component
- Add a subtle rain/shadow background texture using CSS (no image needed — 
  use CSS gradients and opacity)

PAGE 2: app/cases/page.tsx — Case Selection

Content:
- Header: "OPEN CASES" in sepia, 32px
- Subheading: "Choose your assignment, Detective." 22px cream
- Load all cases using getCaseById from lib/case-loader.ts
- Load archive using getArchive() from lib/archive.ts
- Mark any case whose id appears in archive as completed
- Render three CaseFolder components in a responsive grid 
  (1 column mobile, 3 columns desktop)
- "View Agency Files" link at bottom → /archive
- Background: dark noir desk texture using CSS

PAGE 3: app/case/[id]/page.tsx — Active Case (THE MAIN GAME)

State to manage:
- currentStep: "briefing" | "investigation" | "deduction" | "commendation"
- foundClues: string[]
- wrongClickMessage: string | null  (auto-clears after 2 seconds)
- selectedDeduction: string | null
- commendation: string | null
- commendationLoading: boolean
- interrogationHistory: Message[]
- inconsistenciesFound: number
- interrogationLoading: boolean
- startTime: number (Date.now() when investigation starts)

Game flow:
1. BRIEFING step: Show case briefing text in typewriter animation. 
   "Examine the Evidence" button advances to investigation step.

2. INVESTIGATION step: 
   - Render EvidenceViewer with case hotspots
   - Render ClueStamp when a clue is found (auto-dismiss after 3s)
   - Show wrongClickMessage below evidence if present
   - When foundClues.length >= min_clues_to_deduce: show 
     "Ready to file your report, Detective." and DeductionBuilder unlocks

3. DEDUCTION step:
   - Render DeductionBuilder
   - On correct deduction: 
     a. If has_interrogation is false: call POST /api/commendation, 
        advance to commendation step
     b. If has_interrogation is true: advance to interrogation sub-step

4. INTERROGATION sub-step (Case 3 only):
   - Render InterrogationChat
   - On each message: call POST /api/interrogate with full history
   - Track inconsistencies client-side from API response
   - When inconsistenciesFound === 3: call POST /api/commendation, 
     advance to commendation step

5. COMMENDATION step:
   - Render CommendationCard with commendation text
   - On "Add to Archive": save to localStorage via saveCompletedCase(), 
     then navigate to /cases
   - On "Return to Cases": navigate to /cases

Error handling:
- If getCaseById returns null: show "Case not found, Detective." with 
  link back to /cases
- Loading states: show "One moment, Detective..." during API calls

PAGE 4: app/archive/page.tsx — Case Archive

Content:
- Header: "AGENCY FILES" in sepia 32px
- Subheading: "Cases closed. Criminals identified." 22px
- Load archive from getArchive()
- If empty: "No cases on file yet, Detective. Your work begins on the 
  street." with link to /cases
- Each entry: case title, scam type, date completed, commendation excerpt 
  (first 100 chars + "...")
- Styled as paper file cards — cream background, sepia border, typewriter font
- "Back to Open Cases" button at top

NAVIGATION:
- No nav bar needed — each page has its own contextual back navigation
- All text links must be minimum 44px tap target height

After completing all pages, run the app locally and confirm:
1. Landing → Cases → Case 1 full loop → Archive works end to end
2. Case 3 interrogation mode works
3. Audio controller mutes/unmutes correctly
4. Case folders show completed state after archive entry exists

Show me any errors you hit and fix them before marking this phase done.
```

---

## PHASE 5 PROMPT — Polish, Accessibility, Deploy
### Paste this as the final phase

```
The core game loop is complete and working. This is the final polish and 
deployment phase. Do not add new features — only polish what exists.

ACCESSIBILITY AUDIT:
1. Run through every interactive element and confirm:
   - Minimum 60×60px touch target (use padding to extend if needed)
   - Visible keyboard focus state (outline: 2px solid #C8A96E on dark 
     backgrounds, outline: 2px solid #1A1A1A on light backgrounds)
   - All images have alt text
   - All form inputs have labels
   - Color contrast: run mental check against WCAG AA (4.5:1 for normal 
     text, 3:1 for large text)

2. Font size audit:
   - Every text element: minimum 20px
   - Increase any that are below this
   - Briefing text and commendation: 22px minimum

3. Add inactivity detection to the case page:
   - After 5 minutes of no interaction, show a gentle overlay:
     "Still on the case, Detective? Take your time." 
   - One button: "I'm here" dismisses it
   - Reset timer on any click, tap, or keypress

AUDIO:
1. Confirm audio only starts on first user gesture (browser compliance)
2. Mute button is visible on every screen, always fixed top-right
3. All audio loops cleanly
4. If audio files are missing, the game must still function 
   (wrap all Audio() calls in try/catch)

FALLBACK HARDENING:
1. Both API routes already have fallbacks — confirm they work by 
   temporarily setting ANTHROPIC_API_KEY to an invalid value and 
   running through a case. Restore the real key after confirming.
2. If localStorage is unavailable (private browsing), archive functions 
   should fail silently — wrap in try/catch

VISUAL POLISH:
1. Add a subtle scanlines CSS overlay to the landing page 
   (CSS only, repeating linear gradient at low opacity)
2. The "CASE CLOSED" stamp on CommendationCard: add a rotation animation 
   — starts at -15deg and snaps to 0deg with a slight bounce 
   (CSS keyframes)
3. Case folders on selection page: add a hover lift effect 
   (transform: translateY(-4px), box-shadow increase)
4. All page transitions: add a simple fade-in on mount 
   (opacity 0 to 1, 300ms)

DEPLOYMENT:
1. Ensure .env.local is in .gitignore
2. Create vercel.json at root:
{
  "env": {
    "ANTHROPIC_API_KEY": "@anthropic-api-key"
  }
}
3. Add ANTHROPIC_API_KEY to Vercel environment variables 
   (remind me to do this step manually)
4. Deploy with: vercel --prod
5. Test the live URL on:
   - Desktop Chrome
   - Mobile Safari (iPhone)
   - Tablet (iPad or Android tablet if available)

DEMO VIDEO CHECKLIST (do not build, just confirm these moments exist):
- [ ] Landing page with noir aesthetic loads in under 3 seconds
- [ ] Case folder selection is clearly visible and tappable
- [ ] Case 1 briefing typewriter animation plays
- [ ] Clue tapping with red stamp animation works on tablet
- [ ] Deduction selection and report filing works
- [ ] AI commendation appears with typewriter effect
- [ ] Case 3 interrogation chat is functional
- [ ] Case archive shows completed cases
- [ ] Audio mute toggle works
- [ ] Works on mobile screen size without horizontal scroll

After completing all items, give me:
1. The live Vercel URL
2. A list of any known issues or rough edges
3. Confirmation of which accessibility checks passed
```

---

## QUICK REFERENCE — Key Decisions

| Decision | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 App Router | Vercel-native, API routes built in |
| LLM | Backboard SDK | Unified API, stateful threads, 2200+ models |
| Styling | Tailwind + CSS variables | Rapid development, consistent noir tokens |
| Storage | localStorage only | No backend DB needed, no PII concerns |
| Audio | Bundled MP3s | No CDN dependency, works offline |
| Font | Special Elite (Google) | Typewriter aesthetic, highly readable |
| Deployment | Vercel free tier | Zero config, instant deploys |

---

## ENVIRONMENT VARIABLES

```
# .env.local
BACKBOARD_API_KEY=your_key_here
```

---

*Built for GenLink Hacks — helping senior citizens become the digital detectives they always were.*
