import type { Metadata } from "next";
import Image from "next/image";
import { HelpersApplicationForm } from "@/components/helpers-application-form";
import heroLaundry from "@/public/images/helpers/helpers-hero-laundry.webp";
import mealPrep from "@/public/images/helpers/helpers-midpage-meal-prep.webp";
import {
  COMPENSATION_LINE,
  COMPENSATION_SUPPORT_PRIMARY,
  HELPERS_EYEBROW,
  HELPERS_HEADING,
  HELPERS_INTRO,
} from "@/lib/helpers/copy";
import {
  formatPilotCommunityList,
  PILOT_COMMUNITIES,
} from "@/lib/service-area/communities";

export const metadata: Metadata = {
  title: "Join the team — Parentive",
  description:
    "Apply to become a Founding Helper and help shape Parentive from the beginning.",
};

export default function HelpersPage() {
  return (
    <main id="main-content" className="page helpers">
      <div className="helpers-content">
        <p className="helpers-eyebrow">{HELPERS_EYEBROW}</p>
        <h1>{HELPERS_HEADING}</h1>
        <p className="helpers-intro">{HELPERS_INTRO}</p>

        <div className="helpers-hero-photo">
          <Image
            src={heroLaundry}
            alt="Person holding a woven basket filled with folded laundry"
            fill
            priority
            sizes="(max-width: 936px) calc(100vw - 40px), 896px"
            className="helpers-hero-photo-image"
          />
        </div>

        <div className="helpers-compensation-group">
          <p className="helpers-compensation">{COMPENSATION_LINE}</p>
          <p className="helpers-compensation-support">
            {COMPENSATION_SUPPORT_PRIMARY}
          </p>
        </div>

        <section className="helpers-section" aria-labelledby="helpers-role-heading">
          <h2 id="helpers-role-heading">The Founding Helper role</h2>
          <p>
            Founding Helpers provide practical household support grounded in
            Parentive&apos;s pilot service catalogue — laundry and household
            resets, folding and putting away clothing, kitchen tasks and meal
            preparation, organizing family spaces, additional in-scope household
            support, and, for appropriately assessed Helpers, parent-present child
            engagement while a parent or responsible adult remains home.
          </p>
          <p>
            Assignments take place in customers&apos; homes and locations vary
            across our pilot communities:{" "}
            {formatPilotCommunityList(PILOT_COMMUNITIES)}.
          </p>
          <p>
            Founding Helpers can provide input on developing service standards,
            team culture, organizational processes and the employee experience.
            That input informs how Parentive takes shape; it does not promise
            control over corporate decisions.
          </p>
          <p>
            CPR and First Aid certification is preferred beyond our pilot phase
            for Helpers considered for child-support eligibility. It is not
            mandatory for every Helper role at the time of application.
          </p>
        </section>

        <section
          className="helpers-section"
          aria-labelledby="helpers-hiring-heading"
        >
          <h2 id="helpers-hiring-heading">Hiring for the pilot</h2>
          <p>
            Parentive is actively accepting Founding Helper applications for a
            small first cohort. Hiring may expand as demand grows. Applying does
            not guarantee an offer or a response by a specific date.
          </p>
          <ol className="helpers-lifecycle">
            <li>
              <span className="helpers-section-number">01</span> Apply
            </li>
            <li>
              <span className="helpers-section-number">02</span> Intro
              conversation
            </li>
            <li>
              <span className="helpers-section-number">03</span> Possible
              job-related practical assessment and references
            </li>
            <li>
              <span className="helpers-section-number">04</span> Conditional
              offer
            </li>
            <li>
              <span className="helpers-section-number">05</span> Appropriate
              background check and pre-employment requirements
            </li>
            <li>
              <span className="helpers-section-number">06</span> Parentive
              onboarding
            </li>
            <li>
              <span className="helpers-section-number">07</span> Assignments as
              demand becomes available
            </li>
          </ol>
          <p>
            Onboarding covers service quality, household boundaries, privacy,
            customer communication, food and allergy expectations, and where
            relevant, active child-engagement standards.
          </p>
          <p>
            Parentive welcomes qualified applicants from all backgrounds. Hiring
            decisions are based on job-related qualifications, demonstrated
            ability and role requirements, without discrimination contrary to
            applicable law.
          </p>
        </section>

        <div className="helpers-secondary-photo">
          <Image
            src={mealPrep}
            alt="Person slicing cucumber while preparing vegetables at a kitchen counter"
            fill
            sizes="(max-width: 936px) calc(100vw - 40px), 896px"
            className="helpers-secondary-photo-image"
          />
        </div>

        <HelpersApplicationForm />
      </div>
    </main>
  );
}
