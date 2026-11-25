import {
  classifyPostalCode,
  classifyPostalFsa,
  formatServiceAreaLabel,
} from "./classification";

describe("early-access FSA classification", () => {
  it("maps L4G to Aurora in_pilot", () => {
    expect(classifyPostalFsa("L4G")).toEqual({
      status: "in_pilot",
      community: "Aurora",
    });
  });

  it("maps L9P to Uxbridge in_pilot", () => {
    expect(classifyPostalFsa("L9P")).toEqual({
      status: "in_pilot",
      community: "Uxbridge",
    });
  });

  it("maps Bradford L3Z codes to in_pilot", () => {
    expect(classifyPostalFsa("L3Z")).toEqual({
      status: "in_pilot",
      community: "Bradford",
    });
    expect(classifyPostalCode("L3Z 1A1")).toEqual({
      status: "in_pilot",
      community: "Bradford",
    });
    expect(classifyPostalCode("l3z1a1")).toEqual({
      status: "in_pilot",
      community: "Bradford",
    });
    expect(formatServiceAreaLabel("in_pilot", "Bradford")).toBe(
      "In pilot (Bradford)",
    );
  });

  it("maps Oak Ridges L4E and King Township L7B codes to in_pilot", () => {
    expect(classifyPostalFsa("L4E")).toEqual({
      status: "in_pilot",
      community: "Oak Ridges",
    });
    expect(classifyPostalCode("L4E 1A1")).toEqual({
      status: "in_pilot",
      community: "Oak Ridges",
    });
    expect(classifyPostalCode("l4e1a1")).toEqual({
      status: "in_pilot",
      community: "Oak Ridges",
    });
    expect(classifyPostalFsa("L7B")).toEqual({
      status: "in_pilot",
      community: "King Township",
    });
    expect(classifyPostalCode("L7B 1A1")).toEqual({
      status: "in_pilot",
      community: "King Township",
    });
    expect(classifyPostalCode("l7b1a1")).toEqual({
      status: "in_pilot",
      community: "King Township",
    });
    expect(formatServiceAreaLabel("in_pilot", "Oak Ridges")).toBe(
      "In pilot (Oak Ridges)",
    );
    expect(formatServiceAreaLabel("in_pilot", "King Township")).toBe(
      "In pilot (King Township)",
    );
  });

  it("maps overlapping L3Y to in_pilot with a null community", () => {
    expect(classifyPostalFsa("L3Y")).toEqual({
      status: "in_pilot",
      community: null,
    });
  });

  it("classifies rural L0C and L0E as unknown", () => {
    expect(classifyPostalFsa("L0C")).toEqual({
      status: "unknown",
      community: null,
    });
    expect(classifyPostalFsa("L0E")).toEqual({
      status: "unknown",
      community: null,
    });
  });

  it("maps East Gwillimbury L0G codes, including L0G 1M0, to in_pilot", () => {
    expect(classifyPostalCode("L0G 1M0")).toEqual({
      status: "in_pilot",
      community: "East Gwillimbury",
    });
    expect(classifyPostalCode("L0G1M0")).toEqual({
      status: "in_pilot",
      community: "East Gwillimbury",
    });
    expect(classifyPostalCode("l0g 1r0")).toEqual({
      status: "in_pilot",
      community: "East Gwillimbury",
    });
    expect(classifyPostalCode("L0G 1V0")).toEqual({
      status: "in_pilot",
      community: "East Gwillimbury",
    });
  });

  it("keeps other L0G towns outside the pilot", () => {
    expect(classifyPostalCode("L0G 1T0")).toEqual({
      status: "outside_pilot",
      community: null,
    });
  });

  it("classifies other valid Canadian FSAs as outside_pilot", () => {
    expect(classifyPostalFsa("M5V")).toEqual({
      status: "outside_pilot",
      community: null,
    });
    expect(classifyPostalFsa("K1A")).toEqual({
      status: "outside_pilot",
      community: null,
    });
  });
});
