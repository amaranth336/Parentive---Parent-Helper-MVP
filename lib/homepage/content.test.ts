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
  "Laundry - wash, fold & put away",
  "Bedroom reset - including washing/changing bedding",
  "Playroom or family room reset",
  "Baby gear reset - clean, tidy & put away",
  "Light home organization",
  "Light cleaning - dusting, vaccuuming, wiping down surfaces",
  "Kitchen retouch - includes tidy and dishes",
  "Kitchen reset - includes light pantry reorganization and fridge cleanout",
  "Dinner prep",
  "Tomorrow's lunches",
  "Meal prep for the week",
  "Produce & snack prep",
  "Uninterrupted hour",
  "Parent's Helper visit",
  "Flexible support request",
] as const;

describe("homepage content", () => {
  const allText = flattenHomepageText(homepage);

  it("includes the homepage offering lines exactly", () => {
    const groupedNames = homepage.support.groups.flatMap((group) => [
      ...group.names,
    ]);

    expect(homepage.support.lead).toBe(
      "These are our early offerings only. We'll share further service details as we expand and grow.",
    );
    expect(OFFERING_NAMES).toEqual(REQUIRED_OFFERING_NAMES);
    expect(groupedNames).toEqual([...REQUIRED_OFFERING_NAMES]);

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

  it("keeps early-access follow-up language current", () => {
    expect(homepage.howItWorks.steps[1]?.body).toBe(
      "Interested families can add themselves to the early-access list.",
    );
    expect(homepage.howItWorks.steps[1]?.body).not.toMatch(/list is open/i);
    expect(homepage.howItWorks.steps[2]?.title).toBe(
      "We'll be in touch when services become available in your area",
    );
    expect(homepage.howItWorks.steps[2]?.body).toBe(
      "Parentive will follow up with families in the launch communities as services become available.",
    );
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

  it("numbers how-it-works steps for section treatment", () => {
    expect(homepage.howItWorks.steps.map((step) => step.number)).toEqual([
      "01",
      "02",
      "03",
    ]);
  });

  it("keeps FAQ content available for the /faq route", () => {
    expect(homepage.faq.heading).toBe("Frequently asked questions");
    expect(homepage.faq.items).toHaveLength(4);
    expect(homepage.faq.items[0]?.question).toBe("Where is Parentive available?");
  });

  it("states what households can expect from Parentive Helpers", () => {
    expect(homepage.expect.heading).toBe("What you can expect:");
    expect(homepage.expect.points).toEqual([
      "Trusted people in your home. Every Parentive Helper is fully screened via references and Vulnerable Sector Check before working with families.",
      "Capable, dependable support. Helpers are selected for reliability, judgement, attention to detail and the ability to follow through on the outcome agreed for the visit.",
      'Clear expectations, not vague help. Each visit has defined boundaries and outcomes, so you know what Parentive is taking on and what "done" should look like.',
      "Respect for your home and routines. Helpers work thoughtfully within your household, follow your preferences and communicate clearly if something needs clarification.",
      "Positive engagement with children. For parent-present support involving children, Helpers are screened for their ability to engage warmly, appropriately and actively — not simply supervise.",
    ]);
    expect(homepage.expect.closing).toBe(
      "You're not just getting another pair of hands. You're getting support you can feel comfortable bringing into your home.",
    );
  });
});
