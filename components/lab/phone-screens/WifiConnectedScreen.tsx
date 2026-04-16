"use client";

import { PhoneHeader } from "./shared";

export function WifiConnectedScreen() {
  return (
    <div className="flex h-full flex-col">
      <PhoneHeader title="Wi-Fi" />
      <div className="p-4">
        {/* Toggle row (ON state) */}
        <div
          className="mb-6 flex min-h-[72px] w-full items-center justify-between border-2 px-4"
          style={{ borderColor: "#4a7c59", backgroundColor: "rgba(74, 124, 89, 0.08)" }}
        >
          <div>
            <p className="text-[20px] font-bold" style={{ color: "var(--noir-dark)" }}>Wi-Fi</p>
            <p className="text-[15px]" style={{ color: "#4a7c59" }}>On</p>
          </div>
          {/* Toggle pill (ON state) */}
          <div
            className="relative h-[34px] w-[60px] rounded-full border-2"
            style={{ borderColor: "#4a7c59", backgroundColor: "#4a7c59" }}
            aria-hidden="true"
          >
            <div
              className="absolute right-[2px] top-[2px] h-[26px] w-[26px] rounded-full"
              style={{ backgroundColor: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
            />
          </div>
        </div>

        {/* Connected network */}
        <div
          className="flex items-center gap-3 border-2 px-4 py-4"
          style={{ borderColor: "#4a7c59", backgroundColor: "rgba(74, 124, 89, 0.08)" }}
        >
          <span className="text-[28px]" aria-hidden="true">✓</span>
          <div>
            <p className="text-[20px] font-bold" style={{ color: "#4a7c59" }}>HomeNetwork</p>
            <p className="text-[15px]" style={{ color: "#4a7c59" }}>Connected — Strong signal</p>
          </div>
        </div>
      </div>
    </div>
  );
}
