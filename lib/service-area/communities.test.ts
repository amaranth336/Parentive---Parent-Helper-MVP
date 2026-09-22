import { formatPilotCommunityList, PILOT_COMMUNITIES } from "./communities";

describe("pilot communities", () => {
  it("includes the six current names including Uxbridge", () => {
    expect(PILOT_COMMUNITIES).toEqual([
      "East Gwillimbury",
      "Newmarket",
      "Aurora",
      "Georgina",
      "Whitchurch-Stouffville",
      "Uxbridge",
    ]);
    expect(PILOT_COMMUNITIES).toHaveLength(6);
    expect(PILOT_COMMUNITIES).toContain("Uxbridge");
  });

  it("formats the list for customer-facing copy", () => {
    expect(formatPilotCommunityList(PILOT_COMMUNITIES)).toBe(
      "East Gwillimbury, Newmarket, Aurora, Georgina, Whitchurch-Stouffville, and Uxbridge",
    );
  });
});
