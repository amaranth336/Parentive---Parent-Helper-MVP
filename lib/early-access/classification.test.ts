import { classifyPostalCode, classifyPostalFsa } from "./classification";

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
