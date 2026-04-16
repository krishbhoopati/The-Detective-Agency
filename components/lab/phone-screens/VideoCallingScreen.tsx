"use client";

export function VideoCallingScreen() {
  return (
    <div
      className="flex h-full flex-col items-center justify-between py-6"
      style={{ backgroundColor: "#1a1a2e", color: "#fff" }}
    >
      {/* Top: caller info */}
      <div className="flex flex-col items-center gap-3">
        <div
          className="flex h-[80px] w-[80px] items-center justify-center rounded-full text-[32px] font-bold"
          style={{ backgroundColor: "#4a6c8a" }}
          aria-hidden="true"
        >
          S
        </div>
        <p className="text-[22px] font-bold">Sarah (granddaughter)</p>
        <p className="text-[16px] opacity-75">00:00:12</p>
      </div>

      {/* Middle: placeholder video area */}
      <div
        className="w-full max-w-[220px] h-[160px] rounded-xl flex items-center justify-center border-2"
        style={{ borderColor: "rgba(255,255,255,0.2)", backgroundColor: "rgba(255,255,255,0.05)" }}
        aria-label="Sarah's video feed"
      >
        <p className="text-[14px] opacity-50 text-center px-4">Sarah's camera<br />(connecting...)</p>
      </div>

      {/* Bottom: call controls */}
      <div className="flex gap-6">
        <button
          type="button"
          className="flex h-[64px] w-[64px] flex-col items-center justify-center gap-1 rounded-full border-2 text-[26px]"
          style={{ borderColor: "rgba(255,255,255,0.3)", backgroundColor: "rgba(255,255,255,0.1)" }}
          aria-label="Mute microphone"
        >
          🎤
          <span className="text-[10px]">Mute</span>
        </button>

        <button
          type="button"
          className="flex h-[64px] w-[64px] flex-col items-center justify-center gap-1 rounded-full border-2 text-[26px]"
          style={{ borderColor: "rgba(255,255,255,0.3)", backgroundColor: "rgba(255,255,255,0.1)" }}
          aria-label="Flip camera"
        >
          🔄
          <span className="text-[10px]">Flip</span>
        </button>

        <button
          type="button"
          className="flex h-[64px] w-[64px] flex-col items-center justify-center gap-1 rounded-full border-2 text-[26px]"
          style={{ borderColor: "#8B0000", backgroundColor: "rgba(139,0,0,0.5)" }}
          aria-label="End call"
        >
          🔴
          <span className="text-[10px]">End</span>
        </button>
      </div>
    </div>
  );
}
