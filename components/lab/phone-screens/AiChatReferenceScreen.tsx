"use client";

export function AiChatReferenceScreen() {
  const examples = [
    {
      question: "What is high blood pressure?",
      answer:
        "High blood pressure (hypertension) means the force of blood against your artery walls is consistently too high. It often has no symptoms but raises the risk of heart disease and stroke. Speak to your doctor if your readings are consistently over 130/80.",
    },
    {
      question: "What does 'HDL cholesterol' mean?",
      answer:
        "HDL is 'good' cholesterol — it carries cholesterol away from arteries to the liver for removal. Higher HDL is better. Your doctor can tell you your target range based on your overall health.",
    },
    {
      question: "Can I take ibuprofen with my blood pressure medication?",
      answer:
        "I can share general information: ibuprofen can sometimes affect blood pressure medications. However, I cannot advise you on your specific medications — please call your pharmacist or doctor before combining any medicines.",
    },
  ];

  return (
    <div className="flex h-full flex-col">
      <div
        className="flex min-h-[52px] items-center border-b px-3"
        style={{ borderColor: "#d8d0bd", backgroundColor: "#fffaf0" }}
      >
        <span className="text-[14px] font-bold uppercase" style={{ color: "#8b6f3d" }}>
          AI Health Assistant — Example Conversations
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {examples.map((ex, i) => (
          <div key={i} className="space-y-2">
            {/* User question */}
            <div className="flex justify-end">
              <div
                className="max-w-[85%] border-2 px-3 py-2 text-[13px] leading-relaxed"
                style={{
                  borderColor: "var(--noir-sepia)",
                  backgroundColor: "rgba(200,169,110,0.15)",
                  color: "var(--noir-dark)",
                }}
              >
                <p className="mb-1 text-[11px] font-bold uppercase" style={{ color: "#8b6f3d" }}>
                  You
                </p>
                {ex.question}
              </div>
            </div>

            {/* AI answer */}
            <div className="flex justify-start">
              <div
                className="max-w-[85%] border-2 px-3 py-2 text-[13px] leading-relaxed"
                style={{
                  borderColor: "#d8d0bd",
                  backgroundColor: "#fffaf0",
                  color: "var(--noir-dark)",
                }}
              >
                <p className="mb-1 text-[11px] font-bold uppercase" style={{ color: "#66594a" }}>
                  AI
                </p>
                {ex.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
