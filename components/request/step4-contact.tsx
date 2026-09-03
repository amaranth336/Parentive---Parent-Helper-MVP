/**
 * Step 4: Contact Details
 * 
 * Collects customer contact information and consent.
 */

'use client';

import React from 'react';
import { Field, TextInput, Radio, RadioGroup, Checkbox } from '@/components/form';

interface Step4Props {
  formData: any;
  onUpdate: (data: any) => void;
  errors: Record<string, string>;
}

export default function Step4({ formData, onUpdate, errors }: Step4Props) {
  const {
    firstName = '',
    lastName = '',
    email = '',
    mobile = '',
    preferredContactMethod = 'either',
    contactConsent = false,
    marketingConsent = false,
  } = formData;

  return (
    <div>
      <h2 className="form-section-title">Your contact details</h2>
      <p className="form-section-description">
        We&apos;ll use this information to follow up about your request as Parentive moves toward pilot availability.
      </p>

      <div className="form-section">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Field 
            label="First Name" 
            htmlFor="first-name"
            error={errors.firstName}
          >
            <TextInput
              id="first-name"
              value={firstName}
              onChange={(e) => onUpdate({ ...formData, firstName: e.target.value })}
              placeholder="First name"
              error={!!errors.firstName}
            />
          </Field>

          <Field 
            label="Last Name" 
            htmlFor="last-name"
            error={errors.lastName}
          >
            <TextInput
              id="last-name"
              value={lastName}
              onChange={(e) => onUpdate({ ...formData, lastName: e.target.value })}
              placeholder="Last name"
              error={!!errors.lastName}
            />
          </Field>
        </div>

        <Field 
          label="Email" 
          htmlFor="email"
          error={errors.email}
        >
          <TextInput
            id="email"
            type="email"
            value={email}
            onChange={(e) => onUpdate({ ...formData, email: e.target.value })}
            placeholder="you@example.com"
            error={!!errors.email}
          />
        </Field>

        <Field 
          label="Mobile" 
          htmlFor="mobile"
          error={errors.mobile}
        >
          <TextInput
            id="mobile"
            type="tel"
            value={mobile}
            onChange={(e) => onUpdate({ ...formData, mobile: e.target.value })}
            placeholder="(555) 123-4567"
            error={!!errors.mobile}
          />
        </Field>
      </div>

      <div className="form-section">
        <h3 className="form-section-title" style={{ fontSize: '16px' }}>
          Preferred Contact Method
        </h3>
        <RadioGroup>
          <Radio
            name="contact-method"
            value="email"
            label="Email"
            checked={preferredContactMethod === 'email'}
            onChange={(e) => onUpdate({ ...formData, preferredContactMethod: e.target.value })}
          />
          <Radio
            name="contact-method"
            value="text"
            label="Text"
            checked={preferredContactMethod === 'text'}
            onChange={(e) => onUpdate({ ...formData, preferredContactMethod: e.target.value })}
          />
          <Radio
            name="contact-method"
            value="either"
            label="Either"
            checked={preferredContactMethod === 'either'}
            onChange={(e) => onUpdate({ ...formData, preferredContactMethod: e.target.value })}
          />
        </RadioGroup>
      </div>

      <div className="form-section">
        <h3 className="form-section-title" style={{ fontSize: '16px' }}>
          Consent
        </h3>
        
        <div style={{ padding: '16px', background: 'var(--panel-muted)', borderRadius: '12px', marginBottom: '16px' }}>
          <Checkbox
            label="I consent to Parentive contacting me about this support request"
            hint="Required. This allows Parentive to follow up about your request."
            checked={contactConsent}
            onChange={(e) => onUpdate({ ...formData, contactConsent: e.target.checked })}
          />
        </div>

        <Checkbox
          label="I'd like to receive occasional updates about Parentive"
          hint="Optional. Hear about new services, availability updates, and helpful tips. Unsubscribe anytime."
          checked={marketingConsent}
          onChange={(e) => onUpdate({ ...formData, marketingConsent: e.target.checked })}
        />

        {!contactConsent && (
          <p style={{ fontSize: '13px', color: 'var(--danger)', marginTop: '12px' }}>
            * Contact consent is required to submit your request
          </p>
        )}
      </div>
    </div>
  );
}
