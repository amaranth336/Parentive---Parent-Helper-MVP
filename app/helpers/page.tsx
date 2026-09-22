/**
 * Join the Hive - Helper Recruitment Landing Page
 * 
 * Recruitment page for Parentive Helpers, following Linear 009 requirements.
 */

'use client';

import { Button } from '@/components/form';

export default function HelpersPage() {
  return (
    <main className="page">
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          <div className="logo">🧸</div>
          <h1 style={{ fontSize: '28px', margin: 0, color: '#fff' }}>Parentive</h1>
        </div>
        <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#fff', margin: '16px 0 12px', letterSpacing: '-0.02em' }}>
          Join the Hive
        </h2>
        <p style={{ fontSize: '18px', color: 'rgba(226, 232, 240, 0.9)', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
          Become a Founding Helper and help shape a new kind of practical support for modern households.
        </p>
      </div>

      {/* Main content */}
      <div className="card" style={{ maxWidth: '900px', margin: '0 auto 28px' }}>
        {/* Active hiring alert */}
        <div className="alert alert-info" style={{ marginBottom: '24px' }}>
          <strong>We&apos;re actively hiring.</strong> Preliminary hiring begins with the Parentive pilot. The first cohort will be relatively small, with hiring expected to increase as Parentive grows following pilot validation.
        </div>

        {/* Hero section */}
        <section style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '16px', color: 'var(--text)' }}>
            Help shape the Hive from the beginning
          </h3>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--text)', marginBottom: '16px' }}>
            Parentive&apos;s Founding Helpers won&apos;t just deliver the service — they&apos;ll help us understand what great work should look like here. Early Helpers will have a voice in how Parentive develops its standards, training, scheduling, employee experience and future benefits as the company grows.
          </p>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--text)', marginBottom: '16px' }}>
            We&apos;re building something that doesn&apos;t fit neatly into traditional cleaning, babysitting or gig-work categories. Parentive is about meaningful practical support for modern households — and our Founding Helpers will be central to shaping what that looks like.
          </p>
        </section>

        {/* What we're looking for */}
        <section style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', color: 'var(--text)' }}>
            What We&apos;re Looking For
          </h3>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--text)', marginBottom: '16px' }}>
            We&apos;re recruiting broadly for people who are capable, dependable, practical, warm, service-oriented, comfortable working independently, committed to quality, and able to uphold Parentive&apos;s standards inside customers&apos; homes.
          </p>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--text-muted)', marginBottom: '0' }}>
            Relevant experience may come from household management, hospitality, customer service, food preparation, childcare, education, caregiving, cleaning, retail, parenting, or other practical work. We evaluate demonstrated ability over conventional employment history.
          </p>
        </section>

        {/* Compensation */}
        <section style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', color: 'var(--text)' }}>
            Compensation
          </h3>
          <div style={{ padding: '18px 20px', background: 'var(--panel-muted)', borderRadius: '12px', marginBottom: '12px' }}>
            <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--brand)', marginBottom: '6px' }}>
              $20–$23/hour
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Pilot compensation range
            </div>
          </div>
          <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-muted)', marginBottom: '0' }}>
            Compensation will be reviewed as Parentive moves through pilot and launch. Compensation within the range may ultimately reflect relevant experience, demonstrated skills and role requirements.
          </p>
        </section>

        {/* Employment model */}
        <section style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', color: 'var(--text)' }}>
            Employment Model
          </h3>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--text)', marginBottom: '16px' }}>
            <strong>Parentive Helpers are Parentive employees</strong> — not independent contractors or gig-platform workers.
          </p>
          <div className="alert alert-warning">
            <strong>Pilot hours are flexible and will vary with customer demand.</strong> There is no guaranteed number of hours during this stage. Hours will depend on customer demand, geography, Helper availability and suitability. Preference will be given to applicants who can commit to at least 6 hours of availability per week.
          </div>
        </section>

        {/* Work geography */}
        <section style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', color: 'var(--text)' }}>
            Work Geography
          </h3>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--text)', marginBottom: '8px' }}>
            Parentive Helpers work in customer homes across select GTA communities, including:
          </p>
          <ul style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--text)', paddingLeft: '24px', marginBottom: '0' }}>
            <li>East Gwillimbury</li>
            <li>Newmarket</li>
            <li>Aurora</li>
            <li>Georgina</li>
            <li>Whitchurch-Stouffville</li>
          </ul>
          <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-muted)', marginTop: '12px' }}>
            Work locations vary by assignment.
          </p>
        </section>

        {/* Requirements */}
        <section style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', color: 'var(--text)' }}>
            Core Requirements
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '16px', background: 'var(--panel-muted)', borderRadius: '10px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px', color: 'var(--text)' }}>
                Age & Eligibility
              </h4>
              <ul style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text)', paddingLeft: '20px', margin: 0 }}>
                <li>At least 18 years old</li>
                <li>Legally eligible to work in Canada</li>
              </ul>
            </div>
            <div style={{ padding: '16px', background: 'var(--panel-muted)', borderRadius: '10px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px', color: 'var(--text)' }}>
                Transportation
              </h4>
              <ul style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text)', paddingLeft: '20px', margin: 0 }}>
                <li>Valid driver&apos;s license</li>
                <li>Reliable personal vehicle</li>
                <li>Appropriate insurance</li>
              </ul>
            </div>
            <div style={{ padding: '16px', background: 'var(--panel-muted)', borderRadius: '10px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px', color: 'var(--text)' }}>
                Capabilities
              </h4>
              <ul style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text)', paddingLeft: '20px', margin: 0 }}>
                <li>Dependable and punctual</li>
                <li>Comfortable working independently</li>
                <li>Excellent customer service</li>
                <li>Committed to quality standards</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Child support */}
        <section style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', color: 'var(--text)' }}>
            Child Support Capability
          </h3>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--text)', marginBottom: '16px' }}>
            Child-support assignments require an additional capability designation. Not every Parentive Helper automatically qualifies for child-support work.
          </p>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--text)', marginBottom: '16px' }}>
            Parentive child support is intentionally hands-on. Helpers assigned to these tasks must demonstrate meaningful, active child engagement — not merely supervision. We assess relevant experience, comfort with children, appropriate judgement, ability to actively engage, and understanding of age-appropriate interaction.
          </p>
        </section>

        {/* Hiring process */}
        <section style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', color: 'var(--text)' }}>
            Hiring Process
          </h3>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--text)', marginBottom: '16px' }}>
            Parentive&apos;s hiring process includes:
          </p>
          <ul style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--text)', paddingLeft: '24px', marginBottom: '16px' }}>
            <li>Application submission</li>
            <li>Interview process</li>
            <li>Job-related practical assessment</li>
            <li>Reference checks</li>
            <li>Criminal record check (following conditional offer)</li>
            <li>Parentive onboarding</li>
          </ul>
          <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-muted)', marginBottom: '0' }}>
            Our practical assessment allows candidates to demonstrate capability even when their resume doesn&apos;t contain directly comparable employment experience. Assessment focuses on organization, judgement, task execution, following instructions, attention to detail, communication, and customer-service thinking.
          </p>
        </section>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '32px 20px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '22px', fontWeight: 600, marginBottom: '12px', color: 'var(--text)' }}>
            Ready to Join the Hive?
          </h3>
          <p style={{ fontSize: '16px', color: 'var(--text-muted)', marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>
            Submit your application to become a Founding Helper with Parentive.
          </p>
          <Button
            onClick={() => window.location.href = '/helpers/apply'}
            style={{ maxWidth: '300px', margin: '0 auto' }}
          >
            Start Your Application
          </Button>
        </div>
      </div>
    </main>
  );
}
