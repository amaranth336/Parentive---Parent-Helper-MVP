/**
 * Step 5: Review & Submit
 * 
 * Reviews application and collects final consent.
 */

'use client';

import React from 'react';
import { Checkbox } from '@/components/form';

interface Step5Props {
  formData: any;
  onUpdate: (data: any) => void;
  errors: Record<string, string>;
  onEditStep?: (step: number) => void;
}

export default function Step5({ formData, onUpdate, errors, onEditStep }: Step5Props) {
  const handleChange = (field: string, value: any) => {
    onUpdate({ ...formData, [field]: value });
  };

  return (
    <div>
      <h2 className="form-section-title">Review & Submit</h2>
      <p className="form-section-description">
        Review your application and provide final consent to submit.
      </p>

      {/* Personal Information Summary */}
      <div className="review-section">
        <div className="review-section-title">
          Personal Information
          {onEditStep && (
            <button type="button" onClick={() => onEditStep(0)}>
              Edit
            </button>
          )}
        </div>
        <div className="review-item">
          <div className="review-label">Name</div>
          <div className="review-value">{formData.firstName} {formData.lastName}</div>
        </div>
        <div className="review-item">
          <div className="review-label">Email</div>
          <div className="review-value">{formData.email}</div>
        </div>
        <div className="review-item">
          <div className="review-label">Mobile</div>
          <div className="review-value">{formData.mobile}</div>
        </div>
        <div className="review-item">
          <div className="review-label">Location</div>
          <div className="review-value">
            {formData.postalCode}
            {formData.municipality && ` — ${formData.municipality}`}
          </div>
        </div>
        <div className="review-item">
          <div className="review-label">Transportation</div>
          <div className="review-value">
            {formData.hasValidDriversLicense && formData.hasReliableVehicle && formData.hasAppropriateInsurance
              ? 'Valid license, vehicle, and insurance ✓'
              : 'Requirements not met'}
          </div>
        </div>
      </div>

      {/* Availability Summary */}
      <div className="review-section">
        <div className="review-section-title">
          Availability
          {onEditStep && (
            <button type="button" onClick={() => onEditStep(1)}>
              Edit
            </button>
          )}
        </div>
        <div className="review-item">
          <div className="review-label">Available times</div>
          <div className="review-value">
            {formData.availabilityWindows && formData.availabilityWindows.length > 0
              ? formData.availabilityWindows.map((w: string) => {
                  const labels: Record<string, string> = {
                    weekday_morning: 'Weekday mornings',
                    weekday_afternoon: 'Weekday afternoons',
                    weekday_evening: 'Weekday evenings',
                    saturday: 'Saturdays',
                    sunday: 'Sundays',
                    open_flexible: 'Open/flexible',
                  };
                  return labels[w] || w;
                }).join(', ')
              : 'Not specified'}
          </div>
        </div>
        {(formData.desiredWeeklyHoursMin || formData.desiredWeeklyHoursMax) && (
          <div className="review-item">
            <div className="review-label">Desired weekly hours</div>
            <div className="review-value">
              {formData.desiredWeeklyHoursMin && formData.desiredWeeklyHoursMax
                ? `${formData.desiredWeeklyHoursMin}-${formData.desiredWeeklyHoursMax} hours`
                : formData.desiredWeeklyHoursMin
                ? `At least ${formData.desiredWeeklyHoursMin} hours`
                : `Up to ${formData.desiredWeeklyHoursMax} hours`}
            </div>
          </div>
        )}
      </div>

      {/* Experience Summary */}
      <div className="review-section">
        <div className="review-section-title">
          Experience
          {onEditStep && (
            <button type="button" onClick={() => onEditStep(2)}>
              Edit
            </button>
          )}
        </div>
        <div className="review-item">
          <div className="review-label">Child support interest</div>
          <div className="review-value">
            {formData.interestedInChildSupport ? 'Yes' : 'No'}
          </div>
        </div>
        {formData.relevantExperience && (
          <div className="review-item">
            <div className="review-label">Experience provided</div>
            <div className="review-value">✓</div>
          </div>
        )}
      </div>

      {/* Qualifications Summary */}
      <div className="review-section">
        <div className="review-section-title">
          Qualifications
          {onEditStep && (
            <button type="button" onClick={() => onEditStep(3)}>
              Edit
            </button>
          )}
        </div>
        <div className="review-item">
          <div className="review-label">Certifications</div>
          <div className="review-value">
            {formData.hasFirstAidCertification && 'First Aid '}
            {formData.hasFoodSafetyCertification && 'Food Safety '}
            {!formData.hasFirstAidCertification && !formData.hasFoodSafetyCertification && 'None specified'}
          </div>
        </div>
        {formData.resumeFile && (
          <div className="review-item">
            <div className="review-label">Resume</div>
            <div className="review-value">{formData.resumeFile.name}</div>
          </div>
        )}
        {formData.coverLetterFile && (
          <div className="review-item">
            <div className="review-label">Cover letter</div>
            <div className="review-value">{formData.coverLetterFile.name}</div>
          </div>
        )}
      </div>

      {/* Final consent and acknowledgments */}
      <div className="form-section">
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: 'var(--text)' }}>
          Final Acknowledgments
        </h3>

        <div className="alert alert-info" style={{ marginBottom: '16px' }}>
          <strong>Founding Helper Opportunity:</strong> As a Founding Helper, you&apos;ll have a voice in how Parentive develops its standards, training, scheduling, employee experience and future benefits as the company grows.
        </div>

        <Checkbox
          label="I understand and am interested in the Founding Helper opportunity"
          hint="I understand that I'll help shape Parentive's development and have input into company standards and practices"
          checked={formData.foundingHelperInterestConfirmed || false}
          onChange={(e) => handleChange('foundingHelperInterestConfirmed', e.target.checked)}
        />

        <Checkbox
          label="I acknowledge pilot hours are flexible with no guaranteed minimums"
          hint="I understand that pilot hours will vary with customer demand and there is no guaranteed number of hours during this stage"
          checked={formData.pilotHoursAcknowledgment || false}
          onChange={(e) => handleChange('pilotHoursAcknowledgment', e.target.checked)}
        />

        <Checkbox
          label="I consent to Parentive contacting me about this application"
          hint="I consent to Parentive reviewing my application and contacting me via the methods I provided regarding my application status, interviews, and next steps"
          checked={formData.applicationConsent || false}
          onChange={(e) => handleChange('applicationConsent', e.target.checked)}
        />

        <Checkbox
          label="I'd like to receive occasional updates about Parentive (optional)"
          hint="Optional. Receive news about Parentive's development, hiring updates, and company milestones"
          checked={formData.marketingConsent || false}
          onChange={(e) => handleChange('marketingConsent', e.target.checked)}
        />

        {errors.consent && (
          <div className="field-error">{errors.consent}</div>
        )}
        {errors.pilotAcknowledgment && (
          <div className="field-error">{errors.pilotAcknowledgment}</div>
        )}
      </div>

      <div className="alert alert-success">
        <strong>Ready to submit?</strong> Once you submit your application, we&apos;ll review it and be in touch regarding next steps.
      </div>
    </div>
  );
}
