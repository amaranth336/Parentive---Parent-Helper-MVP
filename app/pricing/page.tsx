import type { Metadata } from "next";
import Link from "next/link";
import { BRAND, PRELAUNCH_STATUS } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Pricing designed around what you need done. Defined Parentive services are priced around the outcome. Flexible and time-based support is priced around reserved Helper capacity. Pilot pricing is being finalized before bookings open.",
};

const SECTIONS = [
  {
    title: "Outcome-based pricing",
    body: "Defined catalogue services — such as a Laundry Reset, Kitchen Reset, or Dinner Prep — are priced around the outcome. You know the intended result of the visit, rather than buying an undefined block of chores.",
  },
  {
    title: "Time-based support",
    body: "Flexible support and time-based family support are priced around reserved Helper capacity. Uninterrupted Hour remains a one-hour service. Parent’s Helper Visit and Flexible Support Request use a two-hour customer-facing minimum, with additional time in 30-minute increments once bookings open.",
  },
  {
    title: "Reserved Helper capacity",
    body: "Parentive visits reserve Helper time, even when a defined service is shorter than the full visit window. A minimum visit charge will apply so that capacity can be scheduled sustainably. That minimum is not the same thing as three hours of customer-facing work, and the final amount is still being set.",
  },
  {
    title: "Recurring support",
    body: "Weekly, biweekly, monthly, and occasional support are all part of the model. Recurring visits may qualify for modest savings once rates are finalized. Exact percentages are still being determined and will never be used to price a visit below a sustainable floor.",
  },
  {
    title: "Founding customer / pilot pricing",
    body: "Parentive intends to offer a Founding Customer Rate during the pilot. Introductory pricing may be reviewed after the pilot and is not a permanent entitlement. There is no countdown or artificial scarcity attached to it.",
  },
  {
    title: "Combining services",
    body: "You can request more than one service in the same visit. Parentive will review the combination and confirm the appropriate duration when bookings open. Automatic bundle discounts are not promised during the pilot.",
  },
  {
    title: "Pre-ordered Pickup",
    body: "When it fits a visit, a Helper can collect a pre-ordered, pre-paid grocery or household order that is already ready for pickup. The household places and pays for the order. The Helper does not independently shop or front personal funds. This add-on is priced around time plus a kilometre fee. Exact rates remain to be finalized.",
  },
  {
    title: "Payment timing",
    body: "When visits are being confirmed, payment will be due 48 hours before the scheduled visit. If a visit is confirmed inside that window, payment is due when the visit is confirmed. Helpers do not accept service payments, and cash is not used for Parentive services. Applicable tax will be added.",
  },
  {
    title: "Cancellation architecture",
    body: "More than 24 hours’ notice: no cancellation or rescheduling fee. Less than 24 hours: a late-cancellation fee equal to the finalized minimum visit charge. If a household is not present or the Helper cannot access the home, the full booked service fee may apply where Parentive reserved the capacity and cannot reasonably reassign the Helper.",
  },
];

export default function PricingPage() {
  return (
    <main className="section">
      <div className="container">
        <div className="section-intro">
          <p className="prelaunch-note">{PRELAUNCH_STATUS}</p>
          <h1>Pricing designed around what you need done</h1>
          <p className="lead">
            Defined Parentive services are priced around the outcome. Flexible
            and time-based support is priced around reserved Helper capacity.
          </p>
          <p>Pilot pricing is being finalized before bookings open.</p>
        </div>

        <div className="alert alert-info" style={{ marginBottom: "var(--space-8)" }}>
          No public dollar amounts are listed yet. When bookings open, you’ll
          see the price that matches the support you requested before a visit is
          confirmed.
        </div>

        <div className="callout-grid">
          {SECTIONS.map((section) => (
            <article key={section.title} className="callout">
              <h2 className="callout-title">{section.title}</h2>
              <p className="callout-body">{section.body}</p>
            </article>
          ))}
        </div>

        <div className="card" style={{ marginTop: "var(--space-8)" }}>
          <h2>A few more details</h2>
          <ul>
            <li>
              A few minutes of orientation at the start helps your Helper work
              independently and efficiently for the rest of the visit. There is
              no separate orientation fee.
            </li>
            <li>
              Standard travel to a visit inside the approved launch geography is
              not billed as a separate customer charge.
            </li>
            <li>
              If the scope changes when a Helper arrives, Parentive pauses,
              reviews the revised time and price, and continues only with your
              approval.
            </li>
            <li>
              If you described the work accurately and Parentive underestimated
              the time during pilot, Parentive absorbs the extra labour cost
              rather than adding an unexpected charge.
            </li>
            <li>
              Parentive does not solicit tips, add gratuity prompts, or process
              tips. A customer may independently offer a cash tip directly to a
              Helper.
            </li>
          </ul>
          <div className="cta-row">
            <Link href="/request" className="btn btn-primary">
              {BRAND.customerCta}
            </Link>
            <Link href="/how-it-works" className="btn btn-secondary">
              How Parentive works
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
