import { FIELD_ERRORS } from "@/lib/our-support/copy";
import {
  removeService,
  shortcutLabel,
  summarizeSelection,
  toggleService,
} from "@/lib/our-support/selection";
import { validateVisitRequestInput } from "@/lib/our-support/validation";

const contact = {
  name: "Ada Lovelace",
  email: "Ada@Example.com",
  postalCode: "l4g1a1",
  preferredTimes: "Tuesday mornings",
  helperNotes: "Fold shirts on the shelf.",
  visitType: "one-time" as const,
};

describe("visit selection", () => {
  it("adds, removes, and hides the shortcut when nothing is selected", () => {
    const added = toggleService([], "S16");
    const again = toggleService(added, "S02");
    expect(again).toEqual(["S16", "S02"]);
    expect(removeService(again, "S16")).toEqual(["S02"]);
    expect(toggleService(again, "S02")).toEqual(["S16"]);

    const empty = summarizeSelection([], "one-time");
    expect(empty.shortcutVisible).toBe(false);
    expect(empty.subtotalCents).toBe(0);

    const selected = summarizeSelection(["S16", "S02"], "one-time");
    expect(selected.shortcutVisible).toBe(true);
    expect(selected.subtotalCents).toBe(9500);
    expect(shortcutLabel(selected)).toBe("2 services · $95 subtotal");
  });

  it("quotes Flexible Support separately and does not price it at zero", () => {
    const summary = summarizeSelection(["S19"], "one-time");
    expect(summary.quoteRequired).toBe(true);
    expect(summary.lines[0]?.priceCents).toBeNull();
    expect(summary.subtotalCents).toBe(0);
    expect(shortcutLabel(summary)).toBe("1 service · Quoted separately");
    expect(shortcutLabel(summary)).not.toContain("$0");
  });

  it("blocks washing-only selections and fixed totals under the minimum", () => {
    expect(summarizeSelection(["S01", "S15"], "one-time").washingOnly).toBe(true);
    expect(summarizeSelection(["S01", "S02"], "one-time").washingOnly).toBe(false);

    const under = summarizeSelection(["S08", "S05"], "one-time");
    expect(under.subtotalCents).toBe(7000);
    expect(under.fixedBelowMinimum).toBe(true);
    expect(under.minimumCents).toBe(8000);

    const recurringUnder = summarizeSelection(["S02", "S12"], "recurring");
    expect(recurringUnder.subtotalCents).toBe(2700);
    expect(recurringUnder.minimumCents).toBe(6000);
    expect(recurringUnder.fixedBelowMinimum).toBe(true);
  });
});

describe("visit request validation", () => {
  it("accepts a priced visit at the one-time minimum and ignores no client price list", () => {
    const result = validateVisitRequestInput({
      ...contact,
      serviceIds: ["S16"],
      subtotalCents: 8000,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.email).toBe("ada@example.com");
      expect(result.value.postalCode).toBe("L4G 1A1");
      expect(result.value.subtotalCents).toBe(8000);
      expect(result.value.quoteRequired).toBe(false);
      expect(result.value.recurringPreferences).toBeNull();
    }
  });

  it("rejects a client subtotal that does not match catalogue prices", () => {
    const result = validateVisitRequestInput({
      ...contact,
      serviceIds: ["S16"],
      subtotalCents: 100,
      priceCents: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors.subtotalCents).toBe(FIELD_ERRORS.subtotalMismatch);
    }
  });

  it("rejects washing-only and below-minimum fixed requests", () => {
    const washing = validateVisitRequestInput({
      ...contact,
      serviceIds: ["S01", "S15"],
      subtotalCents: 10000,
    });
    expect(washing.ok).toBe(false);
    if (!washing.ok) {
      expect(washing.fieldErrors.services).toBe(FIELD_ERRORS.washingOnly);
    }

    const below = validateVisitRequestInput({
      ...contact,
      serviceIds: ["S08", "S05"],
      subtotalCents: 7000,
    });
    expect(below.ok).toBe(false);
    if (!below.ok) {
      expect(below.fieldErrors.services).toBe(FIELD_ERRORS.belowMinimumOneTime);
    }
  });

  it("allows a flexible quote under the minimum when the description is present", () => {
    const missing = validateVisitRequestInput({
      ...contact,
      serviceIds: ["S19", "S01"],
      subtotalCents: 5000,
    });
    expect(missing.ok).toBe(false);

    const result = validateVisitRequestInput({
      ...contact,
      serviceIds: ["S19", "S01"],
      subtotalCents: 5000,
      flexibleDescription: "Please also tidy the entry closet while the laundry runs.",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.quoteRequired).toBe(true);
      expect(result.value.fixedBelowMinimum).toBe(true);
      expect(result.value.lines.find((line) => line.id === "S19")?.priceCents).toBeNull();
      expect(result.value.subtotalCents).toBe(5000);
    }
  });

  it("requires free-form recurring details and drops them for one-time visits", () => {
    const missing = validateVisitRequestInput({
      ...contact,
      visitType: "recurring",
      serviceIds: ["S05", "S03"],
      subtotalCents: 6000,
    });
    expect(missing.ok).toBe(false);
    if (!missing.ok) {
      expect(missing.fieldErrors.recurringPreferences).toBe(
        FIELD_ERRORS.recurringRequired,
      );
    }

    const recurring = validateVisitRequestInput({
      ...contact,
      visitType: "recurring",
      serviceIds: ["S05", "S03"],
      subtotalCents: 6000,
      recurringPreferences: "Every other Thursday, dinner and a kitchen retouch.",
    });
    expect(recurring.ok).toBe(true);

    const leaked = validateVisitRequestInput({
      ...contact,
      visitType: "one-time",
      serviceIds: ["S16"],
      subtotalCents: 8000,
      recurringPreferences: "Weekly",
    });
    expect(leaked.ok).toBe(false);
  });
});
