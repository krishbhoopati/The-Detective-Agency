const ARCHIVE_KEY = "detective_archive";

export interface ArchiveEntry {
  case_id: string;
  case_title: string;
  scam_type: string;
  commendation: string;
  completed_at: string;
  clues_found: number;
}

export function saveCompletedCase(entry: ArchiveEntry): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getArchive();
    // Replace if already exists, otherwise append
    const updated = existing.filter((e) => e.case_id !== entry.case_id);
    updated.unshift(entry);
    localStorage.setItem(ARCHIVE_KEY, JSON.stringify(updated));
  } catch {
    // Private browsing or blocked storage should not interrupt the game.
  }
}

export function getArchive(): ArchiveEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ARCHIVE_KEY);
    return raw ? (JSON.parse(raw) as ArchiveEntry[]) : [];
  } catch {
    return [];
  }
}

export function clearArchive(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ARCHIVE_KEY);
  } catch {
    // Ignore unavailable storage.
  }
}
