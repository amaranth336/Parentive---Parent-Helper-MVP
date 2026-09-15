/**
 * Step 5: Review and Submit
 * 
 * Shows a summary of all entered information for review before submission.
 */

'use client';

import React from 'react';
import { Alert } from '@/components/form';
import { getServiceBySlug } from '@/lib/catalogue';

interface Step5Props {
  formData: any;
  onUpdate: (data: any) => void;
  errors: Record<string, string>;
  onEditStep: (step: number) => void;
}

export default function Step5({ formData, onUpdate, errors, onEditStep }: Step5Props) {
  const {
    selectedServices = [],
    flexibleSupportDescription = '',
    serviceNotes = '',
    preferredDate = '',
    alternateDate = '',
    dateFlexible = false,
    preferredTimeWindow = '',
    recurrence = '',
    preferredWeekdays = [],
    arrivalNotificationPreference = '',
    postalCode = '',
    inServiceArea = true,
    hasPets = false,
    petDetails = '',
    ingredientsAvailable = '',
    foodAllergiesPresent = false,
    numberOfChildren = '',
    childrenAges = '',
    firstName = '',
    lastName = '',
    email = '',
    mobile = '',
    preferredContactMethod = '',
    contactConsent = false,
    marketingConsent = false,
  } = formData;

  return (
    <div>
      <h2 className="form-section-title">Review your request</h2>
      <p className="form-section-description">
        Please review your information before submitting. You can go back to edit any section.
      </p>

      <Alert variant="info">
        <strong>Before you submit:</strong>
        <br />
        Parentive is currently preparing for launch and is not yet accepting confirmed bookings. This request helps us understand your support needs so we can follow up when pilot availability opens.
      </Alert>

      <div className="review-section">
        <div className="review-section-title">
          Services
          <button onClick={() => onEditStep(0)}>Edit</button>
        </div>
        {selectedServices.length > 0 && (
          <div className="review-item">
            <div className="review-label">Selected Services:</div>
            <div className="review-value">
              {selectedServices
                .map((slug: string) => getServiceBySlug(slug)?.public.name ?? slug)
                .join(', ')}
            </div>
          </div>
        )}
        {flexibleSupportDescription && (
          <div className="review-item">
            <div className="review-label">Flexible Support:</div>
            <div className="review-value">{flexibleSupportDescription}</div>
          </div>
        )}
        {serviceNotes && (
          <div className="review-item">
            <div className="review-label">Service Notes:</div>
            <div className="review-value">{serviceNotes}</div>
          </div>
        )}
      </div>

      <div className="review-section">
        <div className="review-section-title">
          Timing
          <button onClick={() => onEditStep(1)}>Edit</button>
        </div>
        {preferredDate && (
          <div className="review-item">
            <div className="review-label">Preferred Date:</div>
            <div className="review-value">{preferredDate}</div>
          </div>
        )}
        {alternateDate && (
          <div className="review-item">
            <div className="review-label">Alternate Date:</div>
            <div className="review-value">{alternateDate}</div>
          </div>
        )}
        {dateFlexible && (
          <div className="review-item">
            <div className="review-label">Date Flexibility:</div>
            <div className="review-value">Flexible with dates</div>
          </div>
        )}
        <div className="review-item">
          <div className="review-label">Time of Day:</div>
          <div className="review-value">{preferredTimeWindow}</div>
        </div>
        <div className="review-item">
          <div className="review-label">Recurrence:</div>
          <div className="review-value">{recurrence}</div>
        </div>
        {preferredWeekdays.length > 0 && (
          <div className="review-item">
            <div className="review-label">Preferred Days:</div>
            <div className="review-value">{preferredWeekdays.join(', ')}</div>
          </div>
        )}
        {arrivalNotificationPreference && (
          <div className="review-item">
            <div className="review-label">Arrival Notification:</div>
            <div className="review-value">{arrivalNotificationPreference === 'yes' ? 'Yes, please' : arrivalNotificationPreference === 'no' ? 'No, thanks' : 'No preference'}</div>
          </div>
        )}
      </div>

      <div className="review-section">
        <div className="review-section-title">
          Household
          <button onClick={() => onEditStep(2)}>Edit</button>
        </div>
        <div className="review-item">
          <div className="review-label">Postal Code:</div>
          <div className="review-value">{postalCode}</div>
        </div>
        {!inServiceArea && (
          <div className="review-item">
            <div className="review-label">Service Area:</div>
            <div className="review-value" style={{ color: 'var(--text-muted)' }}>Outside current area - waitlist interest noted</div>
          </div>
        )}
        <div className="review-item">
          <div className="review-label">Pets:</div>
          <div className="review-value">{hasPets ? `Yes${petDetails ? ': ' + petDetails : ''}` : 'No'}</div>
        </div>
        {ingredientsAvailable && (
          <div className="review-item">
            <div className="review-label">Ingredients Available:</div>
            <div className="review-value">{ingredientsAvailable}</div>
          </div>
        )}
        {foodAllergiesPresent && (
          <div className="review-item">
            <div className="review-label">Food Allergies:</div>
            <div className="review-value">Yes - details provided</div>
          </div>
        )}
        {numberOfChildren && (
          <div className="review-item">
            <div className="review-label">Number of Children:</div>
            <div className="review-value">{numberOfChildren} (ages: {childrenAges})</div>
          </div>
        )}
      </div>

      <div className="review-section">
        <div className="review-section-title">
          Contact
          <button onClick={() => onEditStep(3)}>Edit</button>
        </div>
        <div className="review-item">
          <div className="review-label">Name:</div>
          <div className="review-value">{firstName} {lastName}</div>
        </div>
        <div className="review-item">
          <div className="review-label">Email:</div>
          <div className="review-value">{email}</div>
        </div>
        <div className="review-item">
          <div className="review-label">Mobile:</div>
          <div className="review-value">{mobile}</div>
        </div>
        <div className="review-item">
          <div className="review-label">Preferred Contact:</div>
          <div className="review-value">{preferredContactMethod}</div>
        </div>
        <div className="review-item">
          <div className="review-label">Consent:</div>
          <div className="review-value">
            Contact: {contactConsent ? '✓ Yes' : '✗ No'}
            {marketingConsent && ' • Marketing: ✓ Yes'}
          </div>
        </div>
      </div>

      <Alert variant="info">
            <strong>What happens next?</strong>
            <br />
            We&apos;ll save your request so we can understand what support you&apos;re looking for and follow up as Parentive moves toward pilot availability.
          </Alert>
    </div>
  );
}
