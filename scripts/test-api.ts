const baseUrl = process.env.API_BASE_URL ?? "http://localhost:3000";

async function post(path: string, body: unknown) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return { status: response.status, data };
}

async function main() {
  console.log(`Testing Phase 2 API routes at ${baseUrl}`);

  const commendation = await post("/api/commendation", {
    case_id: "case-000",
    case_title: "The Vanishing Invoice",
    scam_type: "phishing",
    clues_found: ["Suspicious sender", "Urgent payment demand", "Mismatched link"],
    total_clues: 3,
    time_elapsed_seconds: 184,
  });
  console.log("\n/api/commendation");
  console.log(commendation);

  const firstTurn = await post("/api/interrogate", {
    player_message: "Before we go further, what operating system am I using?",
    thread_id: null,
    assistant_id: null,
    known_inconsistencies: [],
  });
  console.log("\n/api/interrogate first turn");
  console.log(firstTurn);

  const secondTurn = await post("/api/interrogate", {
    player_message: "Why do you need remote access and my credit card?",
    thread_id: firstTurn.data.thread_id,
    assistant_id: firstTurn.data.assistant_id,
    known_inconsistencies: firstTurn.data.inconsistency_label
      ? [firstTurn.data.inconsistency_label]
      : [],
  });
  console.log("\n/api/interrogate second turn");
  console.log(secondTurn);

  const informant = await post("/api/informant", {
    conversation_history: [],
    message: "What should I do if a caller says my computer is infected?",
  });
  console.log("\n/api/informant");
  console.log(informant);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
