"use client";

import { useRouter } from "next/navigation";
import { LabContent } from "@/components/lab/LabContent";

export default function LabPage() {
  const router = useRouter();

  return (
    <main className="flex h-screen overflow-hidden" style={{ backgroundColor: "var(--noir-dark)" }}>
      <LabContent onClose={() => router.push("/")} />
    </main>
  );
}
