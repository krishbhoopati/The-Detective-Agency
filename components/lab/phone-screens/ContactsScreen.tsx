"use client";

import { PhoneHeader } from "./shared";

interface ContactsScreenProps {
  highlightedTargetId: string | null;
  onTap: (id: string) => void;
}

const CONTACTS = [
  { id: "contact-dr-patel", name: "Dr. Patel",           initials: "DP", sublabel: "Primary care physician" },
  { id: "contact-martha",   name: "Martha",               initials: "M",  sublabel: "Friend" },
  { id: "contact-sarah",    name: "Sarah (granddaughter)", initials: "S",  sublabel: "Family" },
];

export function ContactsScreen({ highlightedTargetId, onTap }: ContactsScreenProps) {
  return (
    <div className="flex h-full flex-col">
      <PhoneHeader title="Contacts" />
      <div className="flex-1 overflow-y-auto p-3">
        {CONTACTS.map((contact) => {
          const isHighlighted = highlightedTargetId === contact.id;
          return (
            <button
              key={contact.id}
              type="button"
              onClick={() => onTap(contact.id)}
              className="mb-2 flex min-h-[68px] w-full items-center gap-3 border-2 px-4 text-left"
              style={{
                borderColor: isHighlighted ? "var(--noir-sepia)" : "#d8d0bd",
                backgroundColor: isHighlighted ? "rgba(200, 169, 110, 0.22)" : "#fffaf0",
                color: "var(--noir-dark)",
              }}
              aria-label={`Open ${contact.name}`}
            >
              <div
                className="flex h-[44px] w-[44px] flex-shrink-0 items-center justify-center rounded-full text-[18px] font-bold"
                style={{
                  backgroundColor: isHighlighted ? "var(--noir-sepia)" : "#c0b89a",
                  color: "#fff",
                }}
                aria-hidden="true"
              >
                {contact.initials}
              </div>
              <div>
                <p className="text-[20px] font-semibold">{contact.name}</p>
                <p className="text-[15px]" style={{ color: "#66594a" }}>{contact.sublabel}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
