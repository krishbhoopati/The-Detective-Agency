"use client";

import { PhoneHeader, PhoneListRow } from "./shared";

interface SettingsNetworkScreenProps {
  highlightedTargetId: string | null;
  onTap: (id: string) => void;
}

const ROWS = [
  { id: "mobile-data-row", label: "Mobile Data",  icon: "📡", sublabel: "Cellular connection" },
  { id: "wifi-row",        label: "Wi-Fi",         icon: "📶", sublabel: "Currently off" },
  { id: "hotspot-row",     label: "Hotspot",       icon: "🔥", sublabel: "Share your connection" },
  { id: "vpn-row",         label: "VPN",           icon: "🛡", sublabel: "Not connected" },
];

export function SettingsNetworkScreen({ highlightedTargetId, onTap }: SettingsNetworkScreenProps) {
  return (
    <div className="flex h-full flex-col">
      <PhoneHeader title="Network & Internet" />
      <div className="flex-1 overflow-y-auto p-3">
        {ROWS.map((row) => (
          <PhoneListRow
            key={row.id}
            label={row.label}
            icon={row.icon}
            sublabel={row.sublabel}
            highlighted={highlightedTargetId === row.id}
            onClick={() => onTap(row.id)}
          />
        ))}
      </div>
    </div>
  );
}
