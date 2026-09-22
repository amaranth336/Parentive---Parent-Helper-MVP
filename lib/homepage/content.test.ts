import {
  LOCKED_BELIEF,
  LOCKED_DESCRIPTOR,
  LOCKED_H1,
  LOCKED_PAYOFF,
  OFFERING_NAMES,
  PARENT_HOME_REQUIRED,
  flattenHomepageText,
  homepage,
  homepageCtas,
} from "./content";

const REQUIRED_OFFERING_NAMES = [
  "Laundry Reset",
  "Fold & Put Away",
  "Bed Reset",
  "Playroom Reset",
  "Family Room Reset",
  "Baby Gear Reset",
  "Kitchen Reset",
  "Dinner Prep",
  "Tomorrow's Lunches",
  "Meal Prep Reset",
  "Produce & Snack Prep",
  "Uninterrupted Hour",
  "Parent's Helper Visit",
  "Flexible Support Request",
] as const;

describe("homepage content", () => {
  const allText = flattenHomepageText(homepage);

  it("includes all 14 offering names exactly", () => {
    const groupedNames = homepage.support.groups.flatMap((group) => [
      ...group.names,
    ]);

    expect(OFFERING_NAMES).toEqual(REQUIRED_OFFERING_NAMES);
    expect(groupedNames).toHaveLength(14);
    expect(groupedNames).toEqual(expect.arrayContaining([...REQUIRED_OFFERING_NAMES]));
    expect(new Set(groupedNames).size).toBe(14);

    for (const name of REQUIRED_OFFERING_NAMES) {
      expect(allText).toContain(name);
    }
  });

  it("states that a parent or responsible adult remains home", () => {
    expect(PARENT_HOME_REQUIRED).toContain(
      "a parent or responsible adult remains home",
    );
    expect(allText).toContain("a parent or responsible adult remains home");
    expect(homepage.support.groups.find((group) => group.id === "family-support")?.note).toBe(
      PARENT_HOME_REQUIRED,
    );
  });

  it("does not publish prices or currency", () => {
    expect(allText).not.toMatch(/\$|£|€|CAD\b|USD\b|CDN\b/i);
    expect(allText).not.toMatch(/\b\d+\.\d{2}\b/);
  });

  it("does not use Hive language", () => {
    expect(allText).not.toMatch(/hive/i);
    expect(allText).not.toMatch(/join the hive/i);
  });

  it("uses a live early-access primary CTA and an in-page secondary hash", () => {
    expect(homepageCtas.length).toBeGreaterThan(0);

    for (const cta of homepageCtas) {
      expect(cta.href).not.toContain("/services");
      expect(cta.href).not.toContain("/request");
    }

    expect(homepage.hero.primaryCta.href).toBe("/early-access");
    expect(homepage.hero.primaryCta.label).toBe("How to join early access");
    expect(homepage.hero.secondaryCta.href).toBe("#support");
    expect(homepage.hero.secondaryCta.href.startsWith("#")).toBe(true);
  });

  it("includes Uxbridge in area and availability copy", () => {
    expect(homepage.area.body).toContain("Uxbridge");
    expect(
      homepage.faq.items.find((item) => item.question === "Where is Parentive available?")
        ?.answer,
    ).toContain("Uxbridge");
    expect(allText).toContain("Uxbridge");
  });

  it("does not restore /request", () => {
    expect(allText).not.toContain("/request");
    expect(homepageCtas.map((cta) => cta.href).join(" ")).not.toContain("/request");
  });

  it("says early access is open and does not book a visit", () => {
    expect(homepage.howItWorks.steps[1]?.body).toMatch(/list is open/i);
    expect(homepage.howItWorks.steps[1]?.body).not.toMatch(/not open yet/i);
    expect(homepage.earlyAccess.body).toMatch(/sign-up is open/i);
    expect(homepage.earlyAccess.alert).toMatch(/sign-up is open/i);
    expect(homepage.earlyAccess.body).toContain("Nothing on this page books a visit");
    expect(homepage.hero.primaryCta.href).toBe("/early-access");
    expect(homepage.metadata.description).not.toMatch(/being prepared/i);
    expect(homepage.hero.launchLine).toMatch(/join the early-access list now/i);
    expect(homepage.hero.launchLine).not.toMatch(/preparing early access/i);
  });

  it("preserves locked brand lines verbatim", () => {
    expect(homepage.hero.heading).toBe(LOCKED_H1);
    expect(homepage.hero.kicker).toBe(LOCKED_DESCRIPTOR);
    expect(homepage.why.belief).toBe(LOCKED_BELIEF);
    expect(homepage.makeRoom.heading).toBe(LOCKED_PAYOFF);
    expect(allText.split(LOCKED_BELIEF).length - 1).toBe(1);
  });
});
