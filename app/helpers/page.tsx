/**
 * Join the Hive - Helper Recruitment Landing Page
 *
 * Recruitment page for Parentive Helpers.
 */

import type { Metadata } from "next";
import Link from "next/link";
import {
  BRAND,
  SERVICE_AREA_COMMUNITIES,
} from "@/lib/content/site";
import { OrganicBrandSurface } from "@/components/brand/organic-shape";

export const metadata: Metadata = {
  title: "Join the Hive",
  description:
    "Help build Parentive from the beginning as a Founding Helper. Flexible local household support work across select GTA communities. Pilot compensation $20–$23/hour.",
};

const HIRING_STEPS = [
  {
    title: "Apply",
    description:
      "Tell us about your availability, experience and what you’d bring to Parentive.",
  },
  {
    title: "Intro conversation",
    description: "Meet Parentive and learn more about the role.",
  },
  {
    title: "Screening",
    description:
      "May include a job-related assessment and references. The assessment is designed so people can demonstrate capability even without a conventional resume.",
  },
  {
    title: "Conditional offer",
    description: "Successful candidates receive a conditional employment offer.",
  },
  {
    title: "Accept offer + provide required criminal-record check",
    description:
      "After accepting, you provide the required criminal-record check and complete remaining pre-employment requirements.",
  },
  {
    title: "Parentive onboarding",
    description:
      "Founder-led orientation covering Parentive purpose, the service catalogue, standards, household boundaries, privacy, and what successful delivery looks like.",
  },
  {
    title: "Join the Hive",
    description:
      "Begin eligible Parentive assignments as demand becomes available.",
  },
];

const ROLE_POINTS = [
  {
    title: "Flexible local work",
    description:
      "You share your availability. Parentive schedules around demand, geography and fit.",
  },
  {
    title: "Meaningful household support",
    description:
      "The work creates practical capacity for households — laundry, kitchens, resets, and parent-home child support when you qualify.",
  },
  {
    title: "Variety",
    description:
      "The role spans real household support rather than one narrowly defined task category.",
  },
  {
    title: "Parentive handles coordination",
    description:
      "Parentive owns customer relationships, the service catalogue, scope and standards. Helpers are not expected to build a client base.",
  },
  {
    title: "Clear expectations",
    description:
      "You work to an agreed outcome, follow household instructions, and communicate when circumstances change.",
  },
  {
    title: "Fair, respectful compensation",
    description:
      "Parentive Helpers are employees. The work is treated as professional household support, not a side hustle.",
  },
  {
    title: "Strong customer service",
    description:
      "Warmth, discretion, judgement and quality are core to the role. The experience a household has with a Helper is the Parentive experience.",
  },
  {
    title: "Initiative within scope",
    description:
      "Notice what matters, work independently, and use good judgement inside the agreed service boundaries.",
  },
  {
    title: "Help build a modern village",
    description:
      "Founding Helpers help shape how practical support gets done for modern households.",
  },
];

export default function HelpersPage() {
  return (
    <main className="section">
      <div className="container">
        <div className="section-intro">
          <h1>{BRAND.recruitmentCta}</h1>
          <p className="lead">
            Help build Parentive from the beginning. Parentive Helpers provide
            practical household and family support in customer homes — as
            employees, not gig workers.
          </p>
        </div>

        <div className="alert alert-info" style={{ marginBottom: "var(--space-8)" }}>
          Parentive is actively assembling its first Hive for pilot launch. The
          first cohort will be relatively small, with hiring expected to grow as
          Parentive validates the service.
        </div>

        <section className="founding-moment">
          <OrganicBrandSurface shape="pebble" color="sage">
            <h2>Founding Helpers</h2>
            <p>
              Parentive’s Founding Helpers won’t just deliver the service —
              they’ll help shape how Parentive grows. Early Helpers will have a
              voice in how standards, onboarding, scheduling, employee experience
              and future benefits evolve.
            </p>
            <p>
              We’re building something that doesn’t fit neatly into traditional
              cleaning, babysitting or gig-work categories. Parentive is about
              meaningful practical support for modern households — and our
              Founding Helpers will be central to shaping what that looks like.
            </p>
          </OrganicBrandSurface>
        </section>

        <section className="form-section">
          <h2>The role</h2>
          <p>
            A Parentive Helper is capable of the standard non-childcare
            catalogue: home and laundry, kitchen and food, and flexible
            household support. Child-support assignments are a separate
            capability, assessed on meaningful engagement rather than passive
            supervision.
          </p>
          <div className="card-grid cols-2">
            {ROLE_POINTS.map((point) => (
              <article key={point.title} className="card">
                <h3 className="card-title">{point.title}</h3>
                <p className="card-description">{point.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="form-section">
          <h2>Pilot compensation</h2>
          <div className="callout compensation-callout">
            <p style={{ fontSize: "var(--text-3xl)", fontWeight: 600, marginBottom: "var(--space-2)" }}>
              $20–$23/hour
            </p>
            <p>
              Pilot compensation range. Compensation will be reviewed as
              Parentive moves through pilot and launch.
            </p>
            <p>
              Hours are flexible and not guaranteed during pilot. Preference
              will be given to applicants who can offer at least 6 hours of
              availability per week. That preference is not a promise of six
              scheduled hours.
            </p>
          </div>
        </section>

        <section className="form-section">
          <h2>Where the work happens</h2>
          <p>
            Parentive Helpers work in customer homes across select GTA
            communities, including:
          </p>
          <ul>
            {SERVICE_AREA_COMMUNITIES.map((place) => (
              <li key={place}>{place}</li>
            ))}
          </ul>
          <p>Work locations vary by assignment.</p>
          <p>
            Applicants need a valid driver’s licence, their own reliable
            vehicle, and appropriate vehicle insurance.
          </p>
        </section>

        <section className="form-section">
          <h2>Who should apply</h2>
          <p>
            Recruiting is open and not aimed at any one gender, parent status,
            or student background. Relevant experience can come from household
            management, hospitality, customer service, food preparation,
            childcare, education, caregiving, light household work, retail, or
            lived household experience. Demonstrated ability matters more than a
            conventional job title.
          </p>
          <p>Applicants must be 18+ and eligible to legally work in Canada.</p>
        </section>

        <section className="form-section">
          <h2>Hiring process</h2>
          <ol className="steps" style={{ listStyle: "none", padding: 0 }}>
            {HIRING_STEPS.map((step, index) => (
              <li key={step.title} className="card step-block">
                <div className="step-number">{index + 1}</div>
                <h3>{step.title}</h3>
                <p className="card-description">{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="form-section">
          <h2>A note on inclusion</h2>
          <p>
            Parentive welcomes qualified applicants from all backgrounds. Hiring
            decisions are based on job-related qualifications, demonstrated
            ability and the requirements of the role, without discrimination
            contrary to applicable law.
          </p>
        </section>

        <div className="card">
          <h2>Ready to put your hand up?</h2>
          <p>
            Submit an application to be considered for Parentive’s Founding
            Helper team.
          </p>
          <div className="cta-row">
            <Link href="/helpers/apply" className="btn btn-primary btn-lg">
              {BRAND.recruitmentCta}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
