import case000 from "@/data/case-000.json";
import case001 from "@/data/case-001.json";
import case002 from "@/data/case-002.json";
import case003 from "@/data/case-003.json";
import case004 from "@/data/case-004.json";

export interface Hotspot {
  id: string;
  label: string;
  explanation: string;
  position: {
    top: string;
    left: string;
    width: string;
    height: string;
  };
  tutorial_hint?: string;
}

export interface DeductionOption {
  id: string;
  text: string;
  is_correct: boolean;
}

export interface PhoneSimStep {
  step: number;
  screen: string;
  instruction: string;
  target_id: string;
}

export interface CaseData {
  id: string;
  title: string;
  scam_type: string;
  difficulty: string;
  briefing: string;
  evidence: {
    type: "sms" | "email" | "popup" | "phone_sim";
    html: string;
  };
  hotspots: Hotspot[];
  min_clues_to_deduce: number;
  deduction_options: DeductionOption[];
  learning_summary: string;
  has_interrogation: boolean;
  is_tutorial?: boolean;
  is_phone_sim?: boolean;
  phone_sim_steps?: PhoneSimStep[];
}

export interface CaseSummary {
  id: string;
  title: string;
  scam_type: string;
  difficulty: string;
  is_tutorial?: boolean;
  is_phone_sim?: boolean;
}

const ALL_CASES = [case000, case001, case002, case003, case004] as CaseData[];

export function getAllCases(): CaseSummary[] {
  return ALL_CASES.map(({ id, title, scam_type, difficulty, is_tutorial, is_phone_sim }) => ({
    id,
    title,
    scam_type,
    difficulty,
    is_tutorial,
    is_phone_sim,
  }));
}

export function getCaseById(id: string): CaseData | null {
  return ALL_CASES.find((c) => c.id === id) ?? null;
}
