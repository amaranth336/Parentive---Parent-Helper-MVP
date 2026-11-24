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
  L3Z: "Bradford",
};

const OVERLAP_PILOT_FSAS = new Set(["L3Y", "L9N"]);
const UNKNOWN_RURAL_FSAS = new Set(["L0C", "L0E"]);

/** Rural L0G covers several towns. These codes are East Gwillimbury. */
const PILOT_POSTAL_CODES: Record<string, PilotCommunity> = {
  L0G1M0: "East Gwillimbury",
  L0G1R0: "East Gwillimbury",
  L0G1V0: "East Gwillimbury",
};

function compactPostalCode(postalCode: string): string {
  return postalCode.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function classifyPostalCode(postalCode: string): ServiceAreaClassification {
  const compact = compactPostalCode(postalCode);
  const community = PILOT_POSTAL_CODES[compact];

  if (community) {
    return { status: "in_pilot", community };
  }

  return classifyPostalFsa(compact.slice(0, 3));
}

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

export function formatServiceAreaLabel(
  status: string,
  community: string | null,
): string {
  const statusLabel =
    status === "in_pilot"
      ? "In pilot"
      : status === "outside_pilot"
        ? "Outside pilot"
        : status === "unknown"
          ? "Unknown"
          : status;

  return community ? `${statusLabel} (${community})` : statusLabel;
}
