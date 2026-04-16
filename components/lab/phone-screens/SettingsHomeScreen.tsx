"use client";

import { PhoneHeader, PhoneListRow } from "./shared";

interface SettingsHomeScreenProps {
  highlightedTargetId: string | null;
  onTap: (id: string) => void;
}

const ROWS = [
  { id: "notifications-row", label: "Notifications",        icon: "🔔", sublabel: "Alerts, sounds" },
  { id: "network-row",       label: "Network & Internet",   icon: "🌐", sublabel: "Wi-Fi, Mobile data" },
  { id: "apps-row",          label: "Apps",                 icon: "📱", sublabel: "Permissions, defaults" },
  { id: "accessibility-row", label: "Accessibility",        icon: "♿", sublabel: "Display, interaction" },
  { id: "battery-row",       label: "Battery",              icon: "🔋", sublabel: "Battery saver, usage" },
  { id: "security-row",      label: "Security",             icon: "🔒", sublabel: "Screen lock, biometrics" },
];

export function SettingsHomeScreen({ highlightedTargetId, onTap }: SettingsHomeScreenProps) {
  return (
    <div className="flex h-full flex-col">
      <PhoneHeader title="Settings" />
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
