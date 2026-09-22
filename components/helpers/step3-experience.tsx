/**
 * Step 3: Experience & Background
 * 
 * Collects relevant experience and interest in the role.
 */

'use client';

import React from 'react';
import { Field, TextArea, Checkbox } from '@/components/form';

interface Step3Props {
  formData: any;
  onUpdate: (data: any) => void;
  errors: Record<string, string>;
}

export default function Step3({ formData, onUpdate, errors }: Step3Props) {
  const handleChange = (field: string, value: any) => {
    onUpdate({ ...formData, [field]: value });
  };

  return (
    <div>
      <h2 className="form-section-title">Experience & Background</h2>
      <p className="form-section-description">
        Tell us about your relevant experience and why you&apos;re interested in becoming a Parentive Helper.
      </p>

      {/* Relevant experience */}
      <div className="form-section">
        <Field 
          label="Relevant Experience"
          htmlFor="relevantExperience"
          hint="Tell us about your background. This may include household management, hospitality, customer service, food preparation, childcare, education, caregiving, cleaning, retail, parenting, or other practical work."
        >
          <TextArea
            id="relevantExperience"
            value={formData.relevantExperience || ''}
            onChange={(e) => handleChange('relevantExperience', e.target.value)}
            placeholder="Describe your relevant experience and skills..."
            rows={5}
          />
        </Field>
      </div>

      {/* Why interested */}
      <div className="form-section">
        <Field 
          label="Why are you interested in becoming a Parentive Helper?"
          htmlFor="whyInterested"
          hint="What draws you to this role and to being part of Parentive's founding team?"
        >
          <TextArea
            id="whyInterested"
            value={formData.whyInterested || ''}
            onChange={(e) => handleChange('whyInterested', e.target.value)}
            placeholder="Tell us what interests you about this opportunity..."
            rows={4}
          />
        </Field>
      </div>

      {/* Strengths */}
      <div className="form-section">
        <Field 
          label="What would you bring to this role?"
          htmlFor="strengths"
          hint="What strengths, skills, or qualities would you bring as a Parentive Helper?"
        >
          <TextArea
            id="strengths"
            value={formData.strengths || ''}
            onChange={(e) => handleChange('strengths', e.target.value)}
            placeholder="Describe your key strengths and what makes you a great fit..."
            rows={4}
          />
        </Field>
      </div>

      {/* Child support capability */}
      <div className="form-section">
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: 'var(--text)' }}>
          Child Support Capability
        </h3>
        
        <div className="alert alert-info" style={{ marginBottom: '16px' }}>
          <strong>Parentive child support is intentionally hands-on.</strong> This work requires meaningful, active child engagement — not merely supervision. Child-support assignments require an additional capability designation, and not every Helper automatically qualifies.
        </div>

        <Checkbox
          label="I'm interested in child-support assignments"
          checked={formData.interestedInChildSupport || false}
          onChange={(e) => handleChange('interestedInChildSupport', e.target.checked)}
        />

        {formData.interestedInChildSupport && (
          <>
            <Field 
              label="Child Support Experience"
              htmlFor="childSupportExperience"
              hint="Describe your relevant experience with children (childcare, education, parenting, etc.)"
            >
              <TextArea
                id="childSupportExperience"
                value={formData.childSupportExperience || ''}
                onChange={(e) => handleChange('childSupportExperience', e.target.value)}
                placeholder="Tell us about your experience working with children..."
                rows={4}
              />
            </Field>

            <Field 
              label="Child Engagement Approach"
              htmlFor="childEngagementApproach"
              hint="How do you actively engage children? What does meaningful interaction look like to you?"
            >
              <TextArea
                id="childEngagementApproach"
                value={formData.childEngagementApproach || ''}
                onChange={(e) => handleChange('childEngagementApproach', e.target.value)}
                placeholder="Describe how you would engage with children during assignments..."
                rows={4}
              />
            </Field>
          </>
        )}
      </div>

      {/* How did you hear about us */}
      <div className="form-section">
        <Field 
          label="How did you hear about Parentive?"
          htmlFor="howDidYouHearAboutUs"
          hint="Optional"
        >
          <TextArea
            id="howDidYouHearAboutUs"
            value={formData.howDidYouHearAboutUs || ''}
            onChange={(e) => handleChange('howDidYouHearAboutUs', e.target.value)}
            placeholder="e.g. Job posting, referral, social media..."
            rows={2}
          />
        </Field>
      </div>
    </div>
  );
}
