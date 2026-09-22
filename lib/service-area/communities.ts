export const PILOT_COMMUNITIES = [
  "East Gwillimbury",
  "Newmarket",
  "Aurora",
  "Georgina",
  "Whitchurch-Stouffville",
  "Uxbridge",
] as const;

export type PilotCommunity = (typeof PILOT_COMMUNITIES)[number];

export function formatPilotCommunityList(
  communities: readonly string[] = PILOT_COMMUNITIES,
): string {
  if (communities.length === 0) {
    return "";
  }

  if (communities.length === 1) {
    return communities[0];
  }

  const leading = communities.slice(0, -1).join(", ");
  return `${leading}, and ${communities[communities.length - 1]}`;
}
