# The Detective Agency

The Detective Agency is a noir-styled Next.js training app that helps older adults practice spotting digital scams and build confidence with modern technology. Players move through detective cases, question scammer personas, use an AI "Informant" for help, and work through guided smartphone exercises in The Lab.

## Features

- Desk-style home screen with a Chief briefing, evidence board, and field manual
- Case browser backed by JSON case files in `data/`
- Interactive investigations with evidence review, deduction building, and scam interrogation
- AI-powered helper routes for interrogations, informant chat, lab tutoring, commendations, and voice guidance
- Digital literacy content in the LLM Field Manual
- The Lab, a guided phone simulator for hands-on smartphone and AI practice
- Solved-case archive stored in the browser

## Tech Stack

- Next.js 14 App Router
- React 18 + TypeScript
- Tailwind CSS
- Framer Motion
- Google Gemini API
- ElevenLabs API

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create a local env file:

```bash
cp .env.local.example .env.local
```

3. Add the required keys to `.env.local`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

4. Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Available Scripts

- `npm run dev` starts the development server
- `npm run build` creates a production build
- `npm run start` runs the production server
- `npm run lint` runs the Next.js linter

## App Routes

- `/` detective desk landing screen
- `/cases` case selection and Informant chat
- `/case/[id]` individual investigation flow
- `/archive` solved case archive
- `/literacy` LLM Field Manual
- `/lab` standalone Lab experience

## API Routes

- `/api/interrogate` Gemini-backed scammer simulation
- `/api/informant` Gemini-backed analyst chat
- `/api/lab-tutor` Gemini-backed lab tutor
- `/api/commendation` post-case commendation generator
- `/api/voice-guide` short contextual guidance for the current screen
- `/api/tts` ElevenLabs text-to-speech

## Content and Assets

- Case content lives in `data/case-*.json`
- Lab scenarios live in `lib/lab-scenarios.ts`
- Pre-generated audio assets live in `public/audio/`

## Notes

- The app expects valid Gemini credentials for most AI interactions.
- `ELEVENLABS_API_KEY` is only required for the `/api/tts` route.
- Solved cases are tracked client-side, and the home screen currently clears archive progress on reload for testing.
