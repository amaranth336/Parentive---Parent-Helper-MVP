/**
 * Step 1: Personal Information & Eligibility
 * 
 * Collects basic information and verifies core requirements.
 */

'use client';

import React from 'react';
import { Field, TextInput, Radio, RadioGroup, Checkbox } from '@/components/form';

interface Step1Props {
  formData: any;
  onUpdate: (data: any) => void;
  errors: Record<string, string>;
}

export default function Step1({ formData, onUpdate, errors }: Step1Props) {
  const handleChange = (field: string, value: any) => {
    onUpdate({ ...formData, [field]: value });
  };

  return (
    <div>
      <h2 className="form-section-title">Personal Information & Eligibility</h2>
      <p className="form-section-description">
        Let&apos;s start with your basic information and confirm core requirements for the pilot.
      </p>

      {/* Personal Information */}
      <div className="form-section">
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: 'var(--text)' }}>
          Contact Information
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
          <Field label="First Name" htmlFor="firstName" error={errors.firstName}>
            <TextInput
              id="firstName"
              value={formData.firstName || ''}
              onChange={(e) => handleChange('firstName', e.target.value)}
              error={!!errors.firstName}
              required
            />
          </Field>
          
          <Field label="Last Name" htmlFor="lastName" error={errors.lastName}>
            <TextInput
              id="lastName"
              value={formData.lastName || ''}
              onChange={(e) => handleChange('lastName', e.target.value)}
              error={!!errors.lastName}
              required
            />
          </Field>
        </div>

        <Field label="Email Address" htmlFor="email" error={errors.email}>
          <TextInput
            id="email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            error={!!errors.email}
            required
          />
        </Field>

        <Field label="Mobile Number" htmlFor="mobile" error={errors.mobile}>
          <TextInput
            id="mobile"
            type="tel"
            value={formData.mobile || ''}
            onChange={(e) => handleChange('mobile', e.target.value)}
            placeholder="e.g. 647-555-0123"
            error={!!errors.mobile}
            required
          />
        </Field>

        <Field label="Preferred Contact Method" htmlFor="contactMethod">
          <RadioGroup>
            <Radio
              name="preferredContactMethod"
              value="email"
              label="Email"
              checked={formData.preferredContactMethod === 'email'}
              onChange={(e) => handleChange('preferredContactMethod', e.target.value)}
            />
            <Radio
              name="preferredContactMethod"
              value="text"
              label="Text message"
              checked={formData.preferredContactMethod === 'text'}
              onChange={(e) => handleChange('preferredContactMethod', e.target.value)}
            />
            <Radio
              name="preferredContactMethod"
              value="phone"
              label="Phone call"
              checked={formData.preferredContactMethod === 'phone'}
              onChange={(e) => handleChange('preferredContactMethod', e.target.value)}
            />
            <Radio
              name="preferredContactMethod"
              value="either"
              label="Either email or text"
              checked={formData.preferredContactMethod === 'either'}
              onChange={(e) => handleChange('preferredContactMethod', e.target.value)}
            />
          </RadioGroup>
        </Field>
      </div>

      {/* Location */}
      <div className="form-section">
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: 'var(--text)' }}>
          Location
        </h3>
        
        <Field label="Postal Code" htmlFor="postalCode" error={errors.postalCode}>
          <TextInput
            id="postalCode"
            value={formData.postalCode || ''}
            onChange={(e) => handleChange('postalCode', e.target.value)}
            placeholder="e.g. L4G 1A1"
            error={!!errors.postalCode}
            required
          />
        </Field>

        <Field 
          label="Municipality" 
          htmlFor="municipality"
          hint="Optional - helps us understand your location"
        >
          <TextInput
            id="municipality"
            value={formData.municipality || ''}
            onChange={(e) => handleChange('municipality', e.target.value)}
            placeholder="e.g. Newmarket"
          />
        </Field>
      </div>

      {/* Age & Eligibility */}
      <div className="form-section">
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: 'var(--text)' }}>
          Eligibility Requirements
        </h3>
        
        <Checkbox
          label="I am 18 years of age or older"
          checked={formData.age18OrOver || false}
          onChange={(e) => handleChange('age18OrOver', e.target.checked)}
        />

        <Checkbox
          label="I am legally eligible to work in Canada"
          checked={formData.legallyEligibleToWorkInCanada || false}
          onChange={(e) => handleChange('legallyEligibleToWorkInCanada', e.target.checked)}
        />

        {errors.eligibility && (
          <div className="field-error">{errors.eligibility}</div>
        )}
      </div>

      {/* Transportation */}
      <div className="form-section">
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: 'var(--text)' }}>
          Transportation Requirements
        </h3>
        
        <div className="alert alert-info" style={{ marginBottom: '16px' }}>
          During the pilot, Helpers must have a valid driver&apos;s license, reliable personal vehicle, and appropriate insurance. This requirement may be revisited following pilot validation.
        </div>

        <Checkbox
          label="I have a valid driver's license"
          checked={formData.hasValidDriversLicense || false}
          onChange={(e) => handleChange('hasValidDriversLicense', e.target.checked)}
        />

        <Checkbox
          label="I have access to a reliable personal vehicle"
          checked={formData.hasReliableVehicle || false}
          onChange={(e) => handleChange('hasReliableVehicle', e.target.checked)}
        />

        <Checkbox
          label="I have appropriate insurance required to legally operate my vehicle"
          checked={formData.hasAppropriateInsurance || false}
          onChange={(e) => handleChange('hasAppropriateInsurance', e.target.checked)}
        />

        {errors.transportation && (
          <div className="field-error">{errors.transportation}</div>
        )}
      </div>
    </div>
  );
}
