export interface LabPhoneStep {
  screenId: string;
  targetId: string | null;
  label: string;
}

export interface LabScenario {
  id: string;
  title: string;
  icon: string;
  description: string;
  steps: LabPhoneStep[];
  chatOnly?: boolean;
  tutor: {
    scenarioContext: string;
    introMessage: string;
    completionMessage: string;
    evaluatePromptQuality?: boolean;
  };
}

export const LAB_SCENARIOS: LabScenario[] = [
  {
    id: "wifi-setup",
    title: "Wi-Fi Setup",
    icon: "📶",
    description: "Your phone lost its Wi-Fi connection. Let's get it back online step by step.",
    steps: [
      { screenId: "home",             targetId: "settings-icon", label: "Open Settings"      },
      { screenId: "settings_home",    targetId: "network-row",   label: "Network & Internet" },
      { screenId: "settings_network", targetId: "wifi-row",      label: "Wi-Fi Menu"         },
      { screenId: "settings_wifi",    targetId: "wifi-toggle",   label: "Enable Wi-Fi"       },
      { screenId: "wifi_connected",   targetId: null,            label: "Connected!"         },
    ],
    tutor: {
      scenarioContext: `The user's simulated phone has no Wi-Fi. Your job is to guide them through:
1. Tapping the Settings gear icon on the home screen
2. Tapping "Network & Internet" in Settings
3. Tapping "Wi-Fi" in the Network menu
4. Toggling Wi-Fi ON
5. They will see a "Connected" confirmation screen — celebrate!

When they tap correctly, briefly celebrate and name the very next target precisely (e.g. "Now look for 'Network & Internet' — it has a globe icon.").
When they tap wrong, gently redirect without frustration: "Not quite — look for the gray gear icon labelled Settings."
Keep every response under 60 words.`,
      introMessage: `Good morning, Detective. Today's lesson: getting a phone back on Wi-Fi. Look at the simulated phone on the right — it says "No Internet." Do you see the gray gear icon on the home screen? That's the Settings app. Tap it to begin.`,
      completionMessage: `Excellent work! You reconnected to Wi-Fi in just a few taps. Remember the path: Settings → Network & Internet → Wi-Fi → toggle ON. That sequence works on almost every Android phone you will ever use. You're ready for the next lesson.`,
    },
  },
  {
    id: "prompt-engineering",
    title: "Prompt Engineering",
    icon: "✍️",
    description: "Learn to write better AI prompts using a real Terms of Service example.",
    steps: [
      { screenId: "home",            targetId: "files-icon",   label: "Open Files"    },
      { screenId: "files_app",       targetId: "tos-document", label: "Open Document" },
      { screenId: "document_viewer", targetId: null,           label: "Read the ToS"  },
    ],
    tutor: {
      scenarioContext: `The user is learning to write better AI prompts. First, guide them to navigate to a Terms of Service document on the phone (Files app → ServiceAgreement_2024.pdf). Once they reach the document_viewer screen, shift into free-form coaching mode.

Evaluate every message the user sends as a prompt attempt:
- VAGUE (e.g., "summarize this", "what does it say"): Reply gently: "Good start — but I work better with specifics. What exactly do you want to know? Try asking about a particular topic, like hidden fees or cancellation."
- SPECIFIC (e.g., "What does this ToS say about cancellation fees?"): Celebrate and answer the question based on a plausible ToS document.
- EXCELLENT (includes context + specific question + desired format, e.g., "This is a Terms of Service for a streaming app. What does it say about auto-renewal, and list it in 2 bullet points?"): Reply: "That is a perfect prompt, Detective — context, specific question, and desired format. Here's what it says:" then answer.

Teach the three pillars explicitly at the right moments: Context, Specific Question, Desired Format.
Keep responses under 80 words.`,
      introMessage: `Hello, Detective. Today we practice the most important skill for using AI: asking good questions. Start by opening the Files app on the phone — it looks like a folder 📁. Inside, you will find a Terms of Service document. Once you open it, come back here and try asking me about it.`,
      completionMessage: `You have mastered the three pillars of a great AI prompt: Context (what is this document?), Specific Question (what do I need to know?), and Desired Format (how should the answer look?). Use these every time you ask an AI for help — the answers will be dramatically better.`,
      evaluatePromptQuality: true,
    },
  },
  {
    id: "video-calling",
    title: "Video Calling",
    icon: "📹",
    description: "Connect face-to-face with family — set up your first video call.",
    steps: [
      { screenId: "home",           targetId: "contacts-icon",  label: "Open Contacts"  },
      { screenId: "contacts",       targetId: "contact-sarah",  label: "Select Family"  },
      { screenId: "contact_detail", targetId: "video-call-btn", label: "Tap Video Call" },
      { screenId: "video_calling",  targetId: null,             label: "Call Connected!" },
    ],
    tutor: {
      scenarioContext: `Guide the user through making a video call to their granddaughter Sarah:
1. Open the Contacts app (person-with-circle icon)
2. Find and tap "Sarah (granddaughter)" in the contact list
3. Tap the video camera button on Sarah's contact page
4. They will see the active call screen — explain the three buttons:
   - 🎤 Microphone button: tap to mute/unmute yourself
   - 🔄 Camera flip: switches between front and back camera
   - 🔴 Red button: ends the call
Then ask: "Is there anything about video calling you are still unsure about?" and answer warmly.
Keep all responses under 80 words.`,
      introMessage: `Good to see you, Detective. Today's mission: making a video call to family. It is easier than it looks — I will guide you every step of the way. Start by opening the Contacts app on the phone. It looks like a person inside a circle. Can you find it on the home screen?`,
      completionMessage: `You did it — you are video calling! Those three buttons at the bottom are all you need: the microphone mutes your audio, the camera icon flips between front and back camera, and the red button ends the call. You can now call any family member face-to-face. Well done.`,
    },
  },
  {
    id: "email-safety",
    title: "Spotting a Scam Email",
    icon: "📧",
    description: "Train your eye to tell a real email from a scam — before it costs you.",
    steps: [
      { screenId: "home",                  targetId: "email-icon",       label: "Open Email"        },
      { screenId: "email_inbox",           targetId: "suspicious-email", label: "Open Suspicious"   },
      { screenId: "email_open_suspicious", targetId: "back-btn",         label: "Notice Red Flags"  },
      { screenId: "email_inbox",           targetId: "real-email",       label: "Open Real Email"   },
      { screenId: "email_open_real",       targetId: null,               label: "Compare & Learn"   },
    ],
    tutor: {
      scenarioContext: `Guide the user through comparing a scam email with a legitimate one.

SCAM EMAIL ("IRS Tax Notice"):
- Sender domain: noreply@irs-gov-alert.net (NOT the real irs.gov)
- Subject: "URGENT: Action Required — Tax Penalty Pending"
- Body: Generic greeting, urgent tone, asks to click a link immediately
- Red flags: wrong domain, urgency, unexpected link

REAL EMAIL ("Medicare Summary"):
- Sender: summary@medicare.gov (correct government domain)
- Subject: "Your Medicare Summary for March 2026"
- Body: Personalized greeting, routine information, no links to click
- Green flags: correct domain, no urgency, expected monthly summary

After the user opens each email, ask: "What do you notice about this email, Detective?"
Affirm correct observations. Correct wrong ones gently.
After the second email, tie the lesson together: always check sender domain, look for urgency language, never click links in unexpected emails. Call the organization on a number you look up yourself.
Keep responses under 80 words.`,
      introMessage: `Detective, your inbox has two emails today. One is a scam — one is real. Your job is to figure out which is which. Open the Mail app on the phone (the @ icon) and let's start investigating. I'll guide you through what to look for.`,
      completionMessage: `Outstanding detective work! You now have a three-point checklist for any suspicious email: wrong sender domain, urgency language, and unexpected links. When in doubt — delete it and call the organisation directly on a number you look up yourself. Never use a phone number or link from the suspicious email.`,
    },
  },
  {
    id: "health-ai",
    title: "AI for Health Questions",
    icon: "🏥",
    description: "Use AI safely for health questions — and know exactly when to call your doctor.",
    steps: [
      { screenId: "ai_chat_reference", targetId: null, label: "Reference" },
    ],
    chatOnly: true,
    tutor: {
      scenarioContext: `This is a conversation-only coaching session. The phone shows a static reference screen with example AI health conversations.

Your goals:
1. Model what a good AI health response looks like — clear, helpful, honest, not alarmist.
2. After each response, include ONE limitation: "I can give you general information, but I cannot examine you — always verify with your doctor before changing any medication or treatment."
3. EMERGENCY OVERRIDE: If the user describes symptoms that could indicate a medical emergency (chest pain, difficulty breathing, stroke symptoms like sudden face drooping/arm weakness/speech problems, severe bleeding, loss of consciousness), IMMEDIATELY respond: "Detective, those symptoms need immediate medical attention. Please call 911 right now — do not rely on AI for this. If you are not in an emergency but just curious, let me know and we can discuss further."
4. Teach the two golden rules explicitly at a natural moment:
   - AI is GOOD for: "What is this condition?", "What questions should I ask my doctor?", "What does this medical term mean?"
   - AI is NOT for: "Should I take this medicine?", "Is this symptom serious?", "Do I need to go to the hospital?"
Keep responses warm and under 100 words (except emergency redirects).`,
      introMessage: `Hello, Detective. This lesson is about using AI — like me — safely for health questions. The phone on the right shows what a real AI health assistant conversation looks like. Go ahead and ask me a health question now. I'll show you what responsible AI guidance looks like — and I'll be honest about what I cannot tell you.`,
      completionMessage: `Well done, Detective. You now know the two golden rules of AI health guidance: use it to understand conditions and prepare questions for your doctor — never to replace a diagnosis. For anything that might be serious, your doctor or 911 is always the right call. AI is a tool, not a physician.`,
    },
  },
];
