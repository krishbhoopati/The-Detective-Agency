"use client";

import { PhoneAppButton } from "./shared";

interface HomeScreenProps {
  highlightedTargetId: string | null;
  onTap: (id: string) => void;
}

const APPS = [
  { id: "phone-icon",    label: "Phone",    icon: "☎" },
  { id: "messages-icon", label: "Messages", icon: "✉" },
  { id: "photos-icon",   label: "Photos",   icon: "▧" },
  { id: "contacts-icon", label: "Contacts", icon: "👤" },
  { id: "email-icon",    label: "Mail",     icon: "@" },
  { id: "settings-icon", label: "Settings", icon: "⚙" },
  { id: "files-icon",    label: "Files",    icon: "📁" },
  { id: "clock-icon",    label: "Clock",    icon: "◷" },
  { id: "maps-icon",     label: "Maps",     icon: "🗺" },
];

export function HomeScreen({ highlightedTargetId, onTap }: HomeScreenProps) {
  return (
    <div className="grid grid-cols-3 gap-4 p-4 pt-10">
      {APPS.map((app) => (
        <PhoneAppButton
          key={app.id}
          label={app.label}
          icon={app.icon}
          highlighted={highlightedTargetId === app.id}
          onClick={() => onTap(app.id)}
        />
      ))}
    </div>
  );
}
