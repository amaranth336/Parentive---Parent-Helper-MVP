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
        <div className="helpers-lead">
          <a className="btn btn-primary helpers-apply-cta" href="#helpers-apply">
            Apply now
          </a>
          <h1>{HELPERS_HEADING}</h1>
          <p className="helpers-eyebrow">{HELPERS_EYEBROW}</p>
        </div>
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
            As a Founding Helper, you&apos;ll bring practical, caring support
            into family homes: laundry and household resets, folding and
            putting away clothes, kitchen tasks and meal prep, organizing
            family spaces, and other household support within our pilot
            services. Helpers who are assessed as a good fit may also spend
            time engaging with children while a parent or responsible adult is
            home.
          </p>
          <p>
            You&apos;ll work in family homes across our pilot communities:{" "}
            {formatPilotCommunityList(PILOT_COMMUNITIES)}.
          </p>
          <p>
            You can share your ideas on our service standards, team culture,
            processes and the employee experience, and your input will help
            shape how Parentive takes form. Final decisions about running the
            company remain with Parentive.
          </p>
          <p>
            Beyond the pilot, CPR and First Aid certification is preferred for
            Helpers who will spend time with children. It isn&apos;t required
            for every Helper role when you apply.
          </p>
        </section>

        <section
          className="helpers-section"
          aria-labelledby="helpers-hiring-heading"
        >
          <h2 id="helpers-hiring-heading">Hiring for the pilot</h2>
          <p>
            We&apos;re welcoming applications for a small first group of
            Founding Helpers, and hiring may grow as demand does. We can&apos;t
            promise an offer or a response by a specific date, but we&apos;re
            so glad you&apos;re considering it.
          </p>
          <ol className="helpers-lifecycle">
            <li>
              <span className="helpers-section-number">01</span> Apply
            </li>
            <li>
              <span className="helpers-section-number">02</span> Have an intro
              conversation with us
            </li>
            <li>
              <span className="helpers-section-number">03</span> Share
              references and, if needed, complete a job-related practical
              assessment
            </li>
            <li>
              <span className="helpers-section-number">04</span> Receive a
              conditional offer
            </li>
            <li>
              <span className="helpers-section-number">05</span> Complete a
              background check and pre-employment requirements
            </li>
            <li>
              <span className="helpers-section-number">06</span> Join Parentive
              onboarding
            </li>
            <li>
              <span className="helpers-section-number">07</span> Start
              assignments as demand becomes available
            </li>
          </ol>
          <p>
            Onboarding covers service quality, household boundaries, privacy,
            communicating with families, food and allergy expectations, and,
            where relevant, standards for actively engaging with children.
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

        <div id="helpers-apply">
          <HelpersApplicationForm />
        </div>
      </div>
    </main>
  );
}
