import type { PilotCommunity } from "@/lib/service-area/communities";

export type ServiceAreaStatus = "in_pilot" | "outside_pilot" | "unknown";

export type ServiceAreaClassification = {
  status: ServiceAreaStatus;
  community: PilotCommunity | null;
};

const UNIQUE_PILOT_FSA: Record<string, PilotCommunity> = {
  L4G: "Aurora",
  L3X: "Newmarket",
  L4P: "Georgina",
  L4A: "Whitchurch-Stouffville",
  L9P: "Uxbridge",
};

const OVERLAP_PILOT_FSAS = new Set(["L3Y", "L9N"]);
const UNKNOWN_RURAL_FSAS = new Set(["L0C", "L0E"]);

export function classifyPostalFsa(fsa: string): ServiceAreaClassification {
  const key = fsa.toUpperCase();
  const uniqueCommunity = UNIQUE_PILOT_FSA[key];

  if (uniqueCommunity) {
    return { status: "in_pilot", community: uniqueCommunity };
  }

  if (OVERLAP_PILOT_FSAS.has(key)) {
    return { status: "in_pilot", community: null };
  }

  if (UNKNOWN_RURAL_FSAS.has(key)) {
    return { status: "unknown", community: null };
  }

  return { status: "outside_pilot", community: null };
}
