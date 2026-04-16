"use client";

import { PhoneHeader } from "./shared";

interface SettingsWifiScreenProps {
  highlightedTargetId: string | null;
  onTap: (id: string) => void;
}

export function SettingsWifiScreen({ highlightedTargetId, onTap }: SettingsWifiScreenProps) {
  const isHighlighted = highlightedTargetId === "wifi-toggle";

  return (
    <div className="flex h-full flex-col">
      <PhoneHeader title="Wi-Fi" />
      <div className="p-4">
        {/* Toggle row */}
        <button
          type="button"
          onClick={() => onTap("wifi-toggle")}
          className="mb-6 flex min-h-[72px] w-full items-center justify-between border-2 px-4"
          style={{
            borderColor: isHighlighted ? "var(--noir-sepia)" : "#d8d0bd",
            backgroundColor: isHighlighted ? "rgba(200, 169, 110, 0.22)" : "#fffaf0",
          }}
          aria-label="Toggle Wi-Fi on or off"
        >
          <div>
            <p className="text-[20px] font-bold" style={{ color: "var(--noir-dark)" }}>Wi-Fi</p>
            <p className="text-[15px]" style={{ color: "#8b6f3d" }}>Tap to turn on</p>
          </div>
          {/* Toggle pill (OFF state) */}
          <div
            className="relative h-[34px] w-[60px] rounded-full border-2"
            style={{ borderColor: "#c0b89a", backgroundColor: "#d8d0bd" }}
            aria-hidden="true"
          >
            <div
              className="absolute left-[2px] top-[2px] h-[26px] w-[26px] rounded-full"
              style={{ backgroundColor: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
            />
          </div>
        </button>

        <p className="text-center text-[18px]" style={{ color: "#8b6f3d" }}>
          Wi-Fi is currently off.
          <br />
          Tap the toggle above to enable it.
        </p>
      </div>
    </div>
  );
}
